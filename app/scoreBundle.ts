
import {MusicNotation} from "@k-l-lambda/web-widgets";

import {recoverJSON} from "../inc/jsonRecovery";
import {StaffToken, SheetDocument} from "../inc/staffSvg";
import {PitchContextTable} from "../inc/pitchContext";
import * as LilyNotation from "../inc/lilyNotation";
import * as SheetBaker from "./sheetBaker";
import DictArray from "../inc/DictArray";
// eslint-disable-next-line
import ScoreJSON from "../inc/scoreJSON";



export default class ScoreBundle {
	scoreJSON: ScoreJSON;

	midiNotation: MusicNotation.Notation;
	pitchContextGroup: PitchContextTable[];
	matchedIds: Set<string>;
	onStatus: (...args: any) => any;
	bakingImages: string[];


	constructor (source, {measureLayout = LilyNotation.LayoutType.Full, onStatus = ((..._) => _), jsonHandle = json => json} = {}) {
		this.scoreJSON = jsonHandle(recoverJSON(source, {StaffToken, SheetDocument, LilyNotation: LilyNotation.Notation, ...LilyNotation.MLayoutClasses, DictArray}));
		this.onStatus = onStatus;

		this.onStatus("json loaded");

		if (measureLayout)
			this.loadNotation(measureLayout);
	}


	loadNotation (layout: LilyNotation.LayoutType) {
		const lilyNotation = this.scoreJSON.lilyNotation;
		if (lilyNotation) {
			this.midiNotation = lilyNotation.toPerformingNotationWithEvents(layout);
			this.pitchContextGroup = lilyNotation.getContextGroup(layout);

			this.matchedIds = this.midiNotation.notes.reduce((ids, note) => (note.ids && note.ids.forEach(id => ids.add(id)), ids), new Set<string>());
			this.scoreJSON.doc.updateMatchedTokens(this.matchedIds);

			this.onStatus("notation loaded");
		}
	}


	bakeSheet (canvas) {
		console.assert(!!this.scoreJSON.doc, "sheetDocument is null.");
		console.assert(!!this.scoreJSON.hashTable, "hashTable is null.");
		console.assert(!!this.matchedIds, "matchedIds is null.");

		this.onStatus("baking sheet");

		return SheetBaker.bakeLiveSheetGen({
			sheetDocument: this.scoreJSON.doc,
			hashTable: this.scoreJSON.hashTable,
			matchedIds: this.matchedIds,
			canvas,
		});
	}
};
