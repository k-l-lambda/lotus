
/// <reference path="../inc/logRecorder.ts" />
/// <reference path="../inc/scoreJSON.d.ts" />

import _ from "lodash";
import {DOMParser} from "xmldom";
import {MusicNotation} from "@k-l-lambda/web-widgets";

import {xml2ly, engraveSvg} from "./lilyCommands";
import loadLilyParser from "./loadLilyParserNode";
import {LilyDocument} from "../inc/lilyParser";
import * as staffSvg from "../inc/staffSvg";


interface LilyProcessOptions {};


const xmlToLyWithMarkup = async (xml: string | Buffer, options: LilyProcessOptions, markup: string): Promise<string> => {
	const lily = await xml2ly(xml, options);

	// copy markup
	if (markup) {
		const parser = await loadLilyParser();
		const docMarkup = new LilyDocument(parser.parse(markup));
		const docSource = new LilyDocument(parser.parse(lily));
	
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
	}

	return lily;
};


const markScore = async (source: string, {midi, logger}: {midi?: Buffer, logger?: LogRecorder} = {}): Promise<ScoreJSON> => {
	const engraving = await engraveSvg(source);

	const lilyParser = await loadLilyParser();
	const lilyDocument = new LilyDocument(lilyParser.parse(source));
	const {doc, hashTable} = staffSvg.createSheetDocumentFromSvgs(engraving.svgs, source, lilyDocument, {logger, DOMParser});

	const sheetNotation = staffSvg.StaffNotation.parseNotationFromSheetDocument(doc, {logger});

	midi = midi || engraving.midi;
	const midiNotation = MusicNotation.Notation.parseMidi(midi);

	await staffSvg.StaffNotation.matchNotations(midiNotation, sheetNotation);

	const matchedIds: Set<string> = new Set();
	midiNotation.notes.forEach(note => note.ids && note.ids.forEach(id => matchedIds.add(id)));

	doc.updateMatchedTokens(matchedIds);

	const pitchContextGroup = staffSvg.StaffNotation.createPitchContextGroup(sheetNotation.pitchContexts, midiNotation);

	const noteLinkings = midiNotation.notes.map(note => _.pick(note, ["ids", "staffTrack", "contextIndex"]));

	return {
		doc,
		midi,
		hashTable,
		noteLinkings,
		pitchContextGroup,
	};
};



export {
	xmlToLyWithMarkup,
	markScore,
};