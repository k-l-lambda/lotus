
import {DOMParser, XMLSerializer} from "xmldom";
import {MusicNotation} from "@k-l-lambda/music-widgets";
import {MIDI} from "@k-l-lambda/music-widgets";
import {Readable} from "stream";
import CRC32 from "crc-32";

import npmPackage from "../package.json";
import {xml2ly, engraveSvg, LilyProcessOptions} from "./lilyCommands";
import {LilyDocument, LilyTerms, docLocationSet} from "../inc/lilyParser";
import * as staffSvg from "../inc/staffSvg";
import {SingleLock} from "../inc/mutex";
import * as LilyNotation from "../inc/lilyNotation";
import {svgToPng} from "./canvas";
import LogRecorder from "../inc/logRecorder";
import ScoreJSON from "../inc/scoreJSON";
import {LilyDocumentAttributeReadOnly} from "../inc/lilyParser/lilyDocument";
import {Block} from "../inc/lilyParser/lilyTerms";



interface GrammarParser {
	parse (source: string): any;
};


const markupLily = (source: string, markup: string, lilyParser: GrammarParser): string => {
	const docMarkup = new LilyDocument(lilyParser.parse(markup));
	const docSource = new LilyDocument(lilyParser.parse(source));

	/*// copy attributes
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
	assignments.forEach(assignment => docSource.root.sections.push(assignment.clone()));*/
	docSource.markup(docMarkup);

	return docSource.toString();
};


const xmlBufferToLy = async (xml: Buffer, options: LilyProcessOptions = {}): Promise<string> => {
	const bom = (xml[0] << 8 | xml[1]);
	const utf16 = bom === 0xfffe;
	const content = xml.toString(utf16 ? "utf16le" : "utf8");

	return await xml2ly(content, {replaceEncoding: utf16, ...options});
};


const unescapeStringExp = exp => exp && exp.toString();


interface SheetNotationResult extends Partial<ScoreJSON> {
	midi: MIDI.MidiData;
	midiNotation: MusicNotation.NotationData;
	//sheetNotation: staffSvg.StaffNotation.SheetNotation;
	lilyDocument: LilyDocument;
	bakingImages?: Readable[];
};


const makeSheetNotation = async (source: string, lilyParser: GrammarParser, {withNotation = false, logger, lilyDocument, includeFolders, baking}: {
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

	type ParserArguments = {
		attributes: LilyDocumentAttributeReadOnly,
		tieLocations: Set<string>,
		briefChordLocations: Set<string>,
		lyricLocations: Set<string>,
	};

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

			const tieLocations = docLocationSet(lilyDocument.getTiedNoteLocations2());
			const briefChordLocations = docLocationSet(lilyDocument.getBriefChordLocations());
			const lyricLocations = docLocationSet(lilyDocument.getLyricLocations());

			argsGen.release({attributes, tieLocations, briefChordLocations, lyricLocations});
			//console.log("tp.1:", Date.now() - t0);
		},
		onMidiRead: midi_ => {
			//console.log("tm.0:", Date.now() - t0);
			midi = midi_;
			if (withNotation)
				midiNotation = midi && MusicNotation.Notation.parseMidi(midi);
			//console.log("tm.1:", Date.now() - t0);
		},
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

	const midiMusic = lilyDocument.interpret().midiMusic;

	const {attributes} = await argsGen.wait();
	const meta = {
		title: unescapeStringExp(attributes.title),
		composer: unescapeStringExp(attributes.composer),
		pageSize: doc.pageSize,
		pageCount: doc.pages.length,
		staffSize: attributes.staffSize as number,
		trackInfos: midiMusic && midiMusic.trackContextDicts,
	};

	/*const t00 = Date.now();
	const sheetNotation = staffSvg.StaffNotation.parseNotationFromSheetDocument(doc, {logger});

	// correct notation time by location-tick table from lily document
	const tickTable = lilyDocument.getLocationTickTable();
	staffSvg.StaffNotation.assignTickByLocationTable(sheetNotation, tickTable);
	console.log("parseNotationFromSheetDocument cost:", Date.now() - t00);*/

	return {
		midi,
		bakingImages: baking ? bakingImages : null,
		midiNotation,
		//sheetNotation,
		meta,
		doc,
		hashTable,
		lilyDocument,
	};
};


interface MakerOptions {
	midi: MIDI.MidiData;
	logger: LogRecorder;
	includeFolders: string[];
	baking: boolean;
	ignoreNotation: boolean;
};


interface MakerResult {
	bakingImages?: Readable[],
	score: Partial<ScoreJSON>,
};


// non-negative crc-32
const hashString = (str: string): number => {
	const value = CRC32.str(str);
	return value < 0 ? 0x100000000 + value : value;
};


const makeScore = async (
	source: string,
	lilyParser: GrammarParser,
	{midi, logger, baking = false, includeFolders, ignoreNotation = false}: Partial<MakerOptions> = {},
): Promise<MakerResult> => {
	const t0 = Date.now();

	const hash = hashString(source);

	const foldData = await makeSheetNotation(source, lilyParser, {logger, includeFolders, baking});
	const {meta, doc, hashTable, bakingImages, lilyDocument} = foldData;

	midi = midi || foldData.midi;
	const lilyNotation = !ignoreNotation && lilyDocument.interpret().getNotation();

	if (ignoreNotation || !midi || !lilyNotation) {
		if (!ignoreNotation) {
			if (!midi)
				console.warn("Neither lilypond or external arguments did not offer MIDI data, score maker finished incompletely.");

			if (!lilyNotation)
				console.warn("lilyNotation parsing failed, score maker finished incompletely.");
		}

		return {
			score: {
				version: npmPackage.version,
				hash,
				meta,
				doc,
				hashTable,
			},
		};
	}

	const t5 = Date.now();

	const matcher = await LilyNotation.matchWithExactMIDI(lilyNotation, midi);

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

	doc.updateMatchedTokens(lilyNotation.idSet);

	// idTrackMap is useless in bundled score
	delete lilyNotation.idTrackMap;

	if (baking)
		doc.pruneForBakingMode();

	logger.append("scoreMaker.profile.full", {cost: Date.now() - t0});

	return {
		bakingImages,
		score: {
			version: npmPackage.version,
			hash,
			meta,
			doc,
			hashTable: !baking ? hashTable : null,
			lilyNotation,
		},
	};
};


const makeMIDI = async (source: string, lilyParser: GrammarParser, {unfoldRepeats = false, fixNestedRepeat = false, includeFolders = undefined} = {}): Promise<MIDI.MidiData> => {
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


const makeArticulatedMIDI = async (source: string, lilyParser: GrammarParser, {ignoreRepeats = true, includeFolders = undefined} = {}): Promise<MIDI.MidiData> => {
	const lilyDocument = new LilyDocument(lilyParser.parse(source));

	if (ignoreRepeats)
		lilyDocument.removeRepeats();

	lilyDocument.articulateMIDIOutput();

	// remove layout block to save time
	lilyDocument.root.sections = lilyDocument.root.sections.filter(section => !(section instanceof Block)
		|| !(section.head === "\\score")
		|| section.isMIDIDedicated);

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
	makeArticulatedMIDI,
};
