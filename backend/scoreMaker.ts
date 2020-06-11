
import _ from "lodash";
import {DOMParser} from "xmldom";
import {MusicNotation} from "@k-l-lambda/web-widgets";
// eslint-disable-next-line
import {MIDI} from "@k-l-lambda/web-widgets";

import {xml2ly, engraveSvg} from "./lilyCommands";
import {LilyDocument} from "../inc/lilyParser";
import * as staffSvg from "../inc/staffSvg";
// eslint-disable-next-line
import LogRecorder from "../inc/logRecorder";
// eslint-disable-next-line
import ScoreJSON from "../inc/scoreJSON";
// eslint-disable-next-line
import {LilyProcessOptions} from "./lilyCommands";



interface GrammarParser {
	parse (source: string): any;
};


const copyMarkup = async (source: string, markup: string, lilyParser: GrammarParser) => {
	const docMarkup = new LilyDocument(lilyParser.parse(markup));
	const docSource = new LilyDocument(lilyParser.parse(source));

	const attrS = docSource.globalAttributes();
	const attrM = docMarkup.globalAttributes({readonly: true});

	[
		"staffSize", "paperWidth", "paperHeight", "systemSpacing", "raggedLast",
	].forEach(field => {
		if (attrM[field]) {
			if (typeof attrS[field].value === "object" && attrS[field].value && attrS[field].value.set)
				attrS[field].value.set(attrM[field]);
			else
				attrS[field].value = attrM[field];
		}
	});

	return docSource.toString();
};


const xmlBufferToLy = async (xml: Buffer, options: LilyProcessOptions = {}): Promise<string> => {
	const bom = (xml[0] << 8 | xml[1]);
	const utf16 = bom === 0xfffe;
	const content = xml.toString(utf16 ? "utf16le" : "utf8");

	return await xml2ly(content, {replaceEncoding: utf16, ...options});
};


// TODO:
const unescapeStringExp = exp => typeof exp === "string" ? exp.replace(/"/g, "") : exp;


const markScore = async (source: string, lilyParser: GrammarParser, {midi, logger}: {midi?: MIDI.MidiData, logger?: LogRecorder} = {}): Promise<ScoreJSON> => {
	const engraving = await engraveSvg(source);

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

	const matcher = await staffSvg.StaffNotation.matchNotations(midiNotation, sheetNotation);

	if (logger) {
		const cis = new Set(Array(matcher.criterion.notes.length).keys());
		matcher.path.forEach(ci => cis.delete(ci));

		const omitC = cis.size;
		const omitS = matcher.path.filter(ci => ci < 0).length;

		const coverage = ((matcher.criterion.notes.length - omitC) / matcher.criterion.notes.length)
			* ((matcher.sample.notes.length - omitS) / matcher.sample.notes.length);

		logger.append("markScore.match", {coverage, omitC, omitS, path: matcher.path});
	}

	const matchedIds: Set<string> = new Set();
	midiNotation.notes.forEach(note => note.ids && note.ids.forEach(id => matchedIds.add(id)));

	doc.updateMatchedTokens(matchedIds);

	const pitchContextGroup = staffSvg.StaffNotation.createPitchContextGroup(sheetNotation.pitchContexts, midiNotation);

	const noteLinkings = midiNotation.notes.map(note => _.pick(note, ["ids", "staffTrack", "contextIndex"]));

	return {
		meta,
		doc,
		midi,
		hashTable,
		noteLinkings,
		pitchContextGroup,
	};
};



export {
	copyMarkup,
	xmlBufferToLy,
	markScore,
};
