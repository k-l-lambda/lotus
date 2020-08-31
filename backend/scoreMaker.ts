
import _ from "lodash";
import {DOMParser, XMLSerializer} from "xmldom";
import {MusicNotation} from "@k-l-lambda/web-widgets";
// eslint-disable-next-line
import {MIDI} from "@k-l-lambda/web-widgets";
// eslint-disable-next-line
import {Readable} from "stream";

import {xml2ly, engraveSvg} from "./lilyCommands";
import {LilyDocument, replaceSourceToken, LilyTerms} from "../inc/lilyParser";
import * as staffSvg from "../inc/staffSvg";
import {SingleLock} from "../inc/mutex";
import {PitchContextTable} from "../inc/pitchContext";
import * as LilyNotation from "../inc/lilyNotation";
import {svgToPng} from "./canvas";
// eslint-disable-next-line
import LogRecorder from "../inc/logRecorder";
// eslint-disable-next-line
import ScoreJSON, {NoteLinking} from "../inc/scoreJSON";
// eslint-disable-next-line
import {LilyProcessOptions} from "./lilyCommands";
// eslint-disable-next-line
import {LilyDocumentAttribute, LilyDocumentAttributeReadOnly} from "../inc/lilyParser/lilyDocument";



interface GrammarParser {
	parse (source: string): any;
};


const markupLily = (source: string, markup: string, lilyParser: GrammarParser): string => {
	const docMarkup = new LilyDocument(lilyParser.parse(markup));
	const docSource = new LilyDocument(lilyParser.parse(source));

	// copy attributes
	const attrS = docSource.globalAttributes() as LilyDocumentAttribute;
	const attrM = docMarkup.globalAttributes({readonly: true}) as LilyDocumentAttributeReadOnly;

	[
		"staffSize", "paperWidth", "paperHeight",
		"topMargin", "bottomMargin", "leftMargin", "rightMargin",
		"systemSpacing", "topMarkupSpacing", "raggedLast", "raggedBottom", "raggedLastBottom",
		"printPageNumber",
	].forEach(field => {
		if (attrM[field] !== undefined) {
			if (typeof attrS[field].value === "object" && attrS[field].value && (attrS[field].value as any).set)
				(attrS[field].value as any).set(attrM[field]);
			else
				attrS[field].value = attrM[field];
		}
	});

	// execute commands list
	const commands = docMarkup.root.getField("LotusCommands");
	const cmdList = commands && commands.value && commands.value.args && commands.value.args[0].body;
	if (cmdList && Array.isArray(cmdList)) {
		for (const command of cmdList) {
			if (command.exp && docSource[command.exp])
				docSource[command.exp]();
			else
				console.warn("unexpected markup command:", command);
		}
	}

	// copy LotusOption assignments
	const assignments = docMarkup.root.entries.filter(term => term instanceof LilyTerms.Assignment && /^LotusOption\..+/.test(term.key.toString()));
	assignments.forEach(assignment => docSource.root.sections.push(assignment.clone()));

	return docSource.toString();
};


const xmlBufferToLy = async (xml: Buffer, options: LilyProcessOptions = {}): Promise<string> => {
	const bom = (xml[0] << 8 | xml[1]);
	const utf16 = bom === 0xfffe;
	const content = xml.toString(utf16 ? "utf16le" : "utf8");

	return await xml2ly(content, {replaceEncoding: utf16, ...options});
};


const unescapeStringExp = exp => exp && exp.toString();


const makeScoreV1 = async (source: string, lilyParser: GrammarParser, {midi, logger}: {midi?: MIDI.MidiData, logger?: LogRecorder} = {}): Promise<ScoreJSON> => {
	const t0 = Date.now();

	const engraving = await engraveSvg(source);

	logger.append("scoreMaker.profile.engraving", {cost: Date.now() - t0});
	logger.append("lilypond.log", engraving.logs);

	const lilyDocument = new LilyDocument(lilyParser.parse(source));
	const {doc, hashTable} = staffSvg.createSheetDocumentFromSvgs(engraving.svgs, source, lilyDocument, {logger, DOMParser});

	const sheetNotation = staffSvg.StaffNotation.parseNotationFromSheetDocument(doc, {logger});

	const attributes = lilyDocument.globalAttributes({readonly: true});

	const meta = {
		title: unescapeStringExp(attributes.title),
		composer: unescapeStringExp(attributes.composer),
		pageSize: doc.pageSize,
		pageCount: doc.pages.length,
		staffSize: attributes.staffSize,
	};

	midi = midi || engraving.midi;
	const midiNotation = MusicNotation.Notation.parseMidi(midi);

	const t5 = Date.now();

	const matcher = await staffSvg.StaffNotation.matchNotations(midiNotation, sheetNotation);

	logger.append("scoreMaker.profile.matching", {cost: Date.now() - t5});

	if (logger) {
		const cis = new Set(Array(matcher.criterion.notes.length).keys());
		matcher.path.forEach(ci => cis.delete(ci));

		const omitC = cis.size;
		const omitS = matcher.path.filter(ci => ci < 0).length;

		const coverage = ((matcher.criterion.notes.length - omitC) / matcher.criterion.notes.length)
			* ((matcher.sample.notes.length - omitS) / matcher.sample.notes.length);

		logger.append("makeScore.match", {coverage, omitC, omitS, path: matcher.path});
	}

	const matchedIds: Set<string> = new Set();
	midiNotation.notes.forEach(note => note.ids && note.ids.forEach(id => matchedIds.add(id)));

	doc.updateMatchedTokens(matchedIds);

	const pitchContextGroup = PitchContextTable.createPitchContextGroup(sheetNotation.pitchContexts, midiNotation);

	const noteLinkings = midiNotation.notes.map(note => _.pick(note, ["ids", "staffTrack", "contextIndex"]) as NoteLinking);

	logger.append("scoreMaker.profile.full", {cost: Date.now() - t0});

	return {
		meta,
		doc,
		midi,
		hashTable,
		noteLinkings,
		pitchContextGroup,
	};
};


interface IncompleteScoreJSON {
	meta?: any,
	doc?: any;
	hashTable?: {[key: string]: any};
	midi?: MIDI.MidiData;
	noteLinkings?: NoteLinking;
	pitchContextGroup?: any;
};


interface SheetNotationResult extends IncompleteScoreJSON {
	midiNotation: MusicNotation.NotationData;
	sheetNotation: staffSvg.StaffNotation.SheetNotation;
	lilyDocument: LilyDocument;
	bakingImages?: Readable[];
};


const makeScoreV2 = async (source: string, lilyParser: GrammarParser, {midi, logger}: {midi?: MIDI.MidiData, logger?: LogRecorder} = {}): Promise<ScoreJSON | IncompleteScoreJSON> => {
	let midiNotation = null;

	const pages = [];
	const hashTable = {};

	const t0 = Date.now();

	const attrGen = new SingleLock<LilyDocumentAttributeReadOnly>(true);

	const engraving = await engraveSvg(source, {
		// do some work during lilypond process running to save time
		onProcStart: () => {
			//console.log("tp.0:", Date.now() - t0);
			const lilyDocument = new LilyDocument(lilyParser.parse(source));
			attrGen.release(lilyDocument.globalAttributes({readonly: true}) as LilyDocumentAttributeReadOnly);
			//console.log("tp.1:", Date.now() - t0);
		},
		onMidiRead: midi_ => {
			//console.log("tm.0:", Date.now() - t0);
			if (!midi) {
				midi = midi_;
				midiNotation = midi && MusicNotation.Notation.parseMidi(midi);
			}
			//console.log("tm.1:", Date.now() - t0);
		},
		onSvgRead: async svg => {
			//console.log("ts.0:", Date.now() - t0);
			const attributes = await attrGen.wait();
			const page = staffSvg.parseSvgPage(svg, source, {DOMParser, logger, attributes});
			pages.push(page.structure);
			Object.assign(hashTable, page.hashTable);
			//console.log("ts.1:", Date.now() - t0);
		},
	});

	//console.log("t2:", Date.now() - t0);

	logger.append("scoreMaker.profile.engraving", {cost: Date.now() - t0});
	logger.append("lilypond.log", engraving.logs);

	const doc = new staffSvg.SheetDocument({pages});

	//console.log("t3:", Date.now() - t0);

	const attributes = await attrGen.wait();
	const meta = {
		title: unescapeStringExp(attributes.title),
		composer: unescapeStringExp(attributes.composer),
		pageSize: doc.pageSize,
		pageCount: doc.pages.length,
		staffSize: attributes.staffSize,
	};

	if (!midiNotation) {
		console.warn("Neither lilypond or external arguments did not offer MIDI data, score maker finish incompletely.");
		return {
			meta,
			doc,
			midi,
			hashTable,
		}; 
	}

	//console.log("t4:", Date.now() - t0);

	const sheetNotation = staffSvg.StaffNotation.parseNotationFromSheetDocument(doc, {logger});

	//console.log("t5:", Date.now() - t0);
	const t5 = Date.now();

	const matcher = await staffSvg.StaffNotation.matchNotations(midiNotation, sheetNotation);

	//console.log("t6:", Date.now() - t0);
	logger.append("scoreMaker.profile.matching", {cost: Date.now() - t5});

	if (logger) {
		const cis = new Set(Array(matcher.criterion.notes.length).keys());
		matcher.path.forEach(ci => cis.delete(ci));

		const omitC = cis.size;
		const omitS = matcher.path.filter(ci => ci < 0).length;

		const coverage = ((matcher.criterion.notes.length - omitC) / matcher.criterion.notes.length)
			* ((matcher.sample.notes.length - omitS) / matcher.sample.notes.length);

		logger.append("markScore.match", {coverage, omitC, omitS, path: matcher.path});
	}

	//console.log("t7:", Date.now() - t0);

	const matchedIds: Set<string> = new Set();
	midiNotation.notes.forEach(note => note.ids && note.ids.forEach(id => matchedIds.add(id)));

	//console.log("t8:", Date.now() - t0);

	doc.updateMatchedTokens(matchedIds);

	//console.log("t9:", Date.now() - t0);

	const pitchContextGroup = PitchContextTable.createPitchContextGroup(sheetNotation.pitchContexts, midiNotation);

	//console.log("t10:", Date.now() - t0);

	const noteLinkings = midiNotation.notes.map(note => _.pick(note, ["ids", "staffTrack", "contextIndex"]));

	//console.log("t11:", Date.now() - t0);
	logger.append("scoreMaker.profile.full", {cost: Date.now() - t0});

	return {
		meta,
		doc,
		midi,
		hashTable,
		noteLinkings,
		pitchContextGroup,
	};
};


const makeSheetNotation = async (source: string, lilyParser: GrammarParser, {withNotation = true, logger, lilyDocument, includeFolders, baking}: {
	withNotation?: boolean,
	logger?: LogRecorder,
	lilyDocument?: LilyDocument,
	includeFolders?: string[],
	baking?: boolean,
} = {}): Promise<SheetNotationResult> => {
	let midi = null;
	let midiNotation = null;

	const pages = [];
	const hashTable = {};
	const bakingImages = [];

	const t0 = Date.now();

	type ParserArguments = {attributes: LilyDocumentAttributeReadOnly, tieLocations: {[key: string]: boolean}};

	const argsGen = new SingleLock<ParserArguments>(true);

	const engraving = await engraveSvg(source, {
		includeFolders,
		// do some work during lilypond process running to save time
		onProcStart: () => {
			//console.log("tp.0:", Date.now() - t0);
			if (!lilyDocument) {
				lilyDocument = new LilyDocument(lilyParser.parse(source));
				lilyDocument.interpret();
			}

			const attributes = lilyDocument.globalAttributes({readonly: true}) as LilyDocumentAttributeReadOnly;

			//const tieLocations = lilyDocument.getTiedNoteLocations(text)
			const tieLocations = lilyDocument.getTiedNoteLocations2()
				.reduce((table, loc) => ((table[`${loc[0]}:${loc[1]}`] = true), table), {});

			argsGen.release({attributes, tieLocations});
			//console.log("tp.1:", Date.now() - t0);
		},
		onMidiRead: withNotation && (midi_ => {
			//console.log("tm.0:", Date.now() - t0);
			midi = midi_;
			midiNotation = midi && MusicNotation.Notation.parseMidi(midi);
			//console.log("tm.1:", Date.now() - t0);
		}),
		onSvgRead: async (index, svg) => {
			//console.log("ts.0:", Date.now() - t0);
			const args = await argsGen.wait();
			const page = staffSvg.parseSvgPage(svg, source, {DOMParser, logger, ...args});
			pages[index] = page.structure;
			Object.assign(hashTable, page.hashTable);
			//console.log("ts.1:", Date.now() - t0);
		},
	});

	logger.append("scoreMaker.profile.engraving", {cost: Date.now() - t0});
	logger.append("lilypond.log", engraving.logs);

	const doc = new staffSvg.SheetDocument({pages});

	staffSvg.postProcessSheetDocument(doc, lilyDocument);

	if (baking) {
		await Promise.all(engraving.svgs.map(async (svg, index) => {
			const svgText = staffSvg.turnRawSvgWithSheetDocument(svg, pages[index], {DOMParser, XMLSerializer});
			bakingImages[index] = await svgToPng(Buffer.from(svgText));
		}));
	}

	const {attributes} = await argsGen.wait();
	const meta = {
		title: unescapeStringExp(attributes.title),
		composer: unescapeStringExp(attributes.composer),
		pageSize: doc.pageSize,
		pageCount: doc.pages.length,
		staffSize: attributes.staffSize,
	};

	const sheetNotation = staffSvg.StaffNotation.parseNotationFromSheetDocument(doc, {logger});

	// correct notation time by location-tick table from lily document
	const tickTable = lilyDocument.getLocationTickTable();
	staffSvg.StaffNotation.assignTickByLocationTable(sheetNotation, tickTable);

	return {
		midi,
		bakingImages: baking ? bakingImages : null,
		midiNotation,
		sheetNotation,
		meta,
		doc,
		hashTable,
		lilyDocument,
	};
};


const makeScoreV3 = async (source: string, lilyParser: GrammarParser, {midi, logger, unfoldRepeats = false, includeFolders}: {
	midi?: MIDI.MidiData,
	logger?: LogRecorder,
	unfoldRepeats?: boolean,
	includeFolders?: string[],
} = {}): Promise<ScoreJSON | IncompleteScoreJSON> => {
	const t0 = Date.now();

	let lilyDocument = null;
	let unfoldSource = null;

	if (unfoldRepeats) {
		lilyDocument = new LilyDocument(lilyParser.parse(source));
		lilyDocument.interpret();
		if (lilyDocument.containsRepeat()) {
			lilyDocument.unfoldRepeats();
			unfoldSource = lilyDocument.toString();

			// keep 2 version lilypond source note href uniform
			source = replaceSourceToken(unfoldSource, "\\unfoldRepeats");
		}
	}

	const foldData = await makeSheetNotation(source, lilyParser, {logger, lilyDocument, withNotation: !midi && !unfoldSource, includeFolders});
	const {meta, doc, hashTable} = foldData;

	lilyDocument = lilyDocument || foldData.lilyDocument;
	let midiNotation = foldData.midiNotation;
	let sheetNotation = foldData.sheetNotation;

	if (midi)
		midiNotation = MusicNotation.Notation.parseMidi(midi);

	if (unfoldSource) {
		const unfoldData = await makeSheetNotation(unfoldSource, lilyParser, {logger, lilyDocument, withNotation: !midi, includeFolders});

		midi = midi || unfoldData.midi;
		midiNotation = unfoldData.midiNotation;
		sheetNotation = unfoldData.sheetNotation;
	}

	midi = midi || foldData.midi;
	if (!midi || !sheetNotation) {
		if (!midi)
			console.warn("Neither lilypond or external arguments did not offer MIDI data, score maker finished incompletely.");

		if (!sheetNotation)
			console.warn("sheetNotation parsing failed, score maker finished incompletely.");

		return {
			meta,
			doc,
			midi,
			hashTable,
		};
	}

	const t5 = Date.now();

	const matcher = await staffSvg.StaffNotation.matchNotations(midiNotation, sheetNotation);

	logger.append("scoreMaker.profile.matching", {cost: Date.now() - t5});

	if (logger && logger.enabled) {
		const cis = new Set(Array(matcher.criterion.notes.length).keys());
		matcher.path.forEach(ci => cis.delete(ci));

		const omitC = cis.size;
		const omitS = matcher.path.filter(ci => ci < 0).length;

		const coverage = ((matcher.criterion.notes.length - omitC) / matcher.criterion.notes.length)
			* ((matcher.sample.notes.length - omitS) / matcher.sample.notes.length);

		logger.append("makeScore.match", {coverage, omitC, omitS, path: matcher.path});
	}

	const matchedIds: Set<string> = new Set();
	midiNotation.notes.forEach(note => note.ids && note.ids.forEach(id => matchedIds.add(id)));

	doc.updateMatchedTokens(matchedIds);

	const pitchContextGroup = PitchContextTable.createPitchContextGroup(sheetNotation.pitchContexts, midiNotation);

	const noteLinkings = midiNotation.notes.map(note => _.pick(note, ["ids", "staffTrack", "contextIndex"]) as NoteLinking);

	logger.append("scoreMaker.profile.full", {cost: Date.now() - t0});

	return {
		meta,
		doc,
		midi,
		hashTable,
		noteLinkings,
		pitchContextGroup,
	};
};


const makeScoreV4 = async (source: string, lilyParser: GrammarParser, {midi, logger, unfoldRepeats = false, baking = false, includeFolders}: {
	midi?: MIDI.MidiData,
	logger?: LogRecorder,
	unfoldRepeats?: boolean,
	includeFolders?: string[],
	baking?: boolean,
} = {}): Promise<{
	bakingImages?: Readable[],
	score: ScoreJSON | IncompleteScoreJSON,
}> => {
	const t0 = Date.now();

	let lilyDocument = null;
	let unfoldSource = null;

	if (unfoldRepeats) {
		lilyDocument = new LilyDocument(lilyParser.parse(source));
		lilyDocument.interpret();
		if (lilyDocument.containsRepeat()) {
			lilyDocument.unfoldRepeats();
			unfoldSource = lilyDocument.toString();

			// keep 2 version lilypond source note href uniform
			source = replaceSourceToken(unfoldSource, "\\unfoldRepeats");
		}
	}

	const foldData = await makeSheetNotation(source, lilyParser, {logger, lilyDocument, withNotation: !midi && !unfoldSource, includeFolders, baking});
	const {meta, doc, hashTable, bakingImages} = foldData;

	lilyDocument = lilyDocument || foldData.lilyDocument;
	//let sheetNotation = foldData.sheetNotation;

	const matchingMidi = midi || foldData.midi;

	if (unfoldSource) {
		const unfoldData = await makeSheetNotation(unfoldSource, lilyParser, {logger, lilyDocument, withNotation: !midi, includeFolders});

		midi = midi || unfoldData.midi;
		//sheetNotation = unfoldData.sheetNotation;
	}

	midi = midi || foldData.midi;
	const lilyNotation = lilyDocument.interpret().getNotation();

	if (!midi || !lilyNotation) {
		if (!midi)
			console.warn("Neither lilypond or external arguments did not offer MIDI data, score maker finished incompletely.");

		if (!lilyNotation)
			console.warn("sheetNotation parsing failed, score maker finished incompletely.");

		return {
			score: {
				meta,
				doc,
				midi,
				hashTable,
			},
		};
	}

	const t5 = Date.now();

	const matcher = await LilyNotation.matchWithMIDI(lilyNotation, matchingMidi);

	logger.append("scoreMaker.profile.matching", {cost: Date.now() - t5});

	if (logger && logger.enabled) {
		const cis = new Set(Array(matcher.criterion.notes.length).keys());
		matcher.path.forEach(ci => cis.delete(ci));

		const omitC = cis.size;
		const omitS = matcher.path.filter(ci => ci < 0).length;

		const coverage = ((matcher.criterion.notes.length - omitC) / matcher.criterion.notes.length)
			* ((matcher.sample.notes.length - omitS) / matcher.sample.notes.length);

		logger.append("makeScore.match", {coverage, omitC, omitS, path: matcher.path});
	}

	const midiNotation = matcher.sample;

	const matchedIds: Set<string> = new Set();
	midiNotation.notes.forEach(note => note.ids && note.ids.forEach(id => matchedIds.add(id)));

	doc.updateMatchedTokens(matchedIds);

	const pitchContextGroup = PitchContextTable.createPitchContextGroup(
		lilyNotation.pitchContextGroup.map(table => table.items.map(item => item.context)), midiNotation);

	const noteLinkings = midiNotation.notes.map(note => _.pick(note, ["ids", "staffTrack", "contextIndex"]) as NoteLinking);

	logger.append("scoreMaker.profile.full", {cost: Date.now() - t0});

	return {
		bakingImages,
		score: {
			meta,
			doc,
			midi,
			hashTable,
			noteLinkings,
			pitchContextGroup,
		},
	};
};


void makeScoreV1;
void makeScoreV2;
void makeScoreV3;
const makeScore = makeScoreV4;


const makeMIDI = async (source: string, lilyParser: GrammarParser, {unfoldRepeats = true, fixNestedRepeat = false, includeFolders = undefined} = {}): Promise<MIDI.MidiData> => {
	const lilyDocument = new LilyDocument(lilyParser.parse(source));

	if (fixNestedRepeat)
		lilyDocument.fixNestedRepeat();

	if (unfoldRepeats)
		lilyDocument.unfoldRepeats();

	const score = lilyDocument.root.getBlock("score");
	if (score) {
		// remove layout block to save time
		score.body = score.body.filter(term => !(term instanceof LilyTerms.Block && term.head === "\\layout"));

		// remove invalid tempo
		const midi: any = score.body.find(term => term instanceof LilyTerms.Block && term.head === "\\midi");
		if (midi)
			midi.body = midi.body.filter(term => !(term instanceof LilyTerms.Tempo && term.beatsPerMinute > 200));
	}

	const markupSource = lilyDocument.toString();
	//console.log("markupSource:", markupSource);

	return new Promise((resolve, reject) => engraveSvg(markupSource, {
		includeFolders,
		onMidiRead: resolve,
	}).catch(reject));
};



export {
	markupLily,
	xmlBufferToLy,
	makeScore,
	makeMIDI,
};
