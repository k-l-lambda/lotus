
import {MusicNotation} from "@k-l-lambda/web-widgets";

import {recoverJSON} from "../inc/jsonRecovery";
import {StaffToken, SheetDocument, StaffNotation} from "../inc/staffSvg";
import * as SheetBaker from "./sheetBaker";
import DictArray from "../inc/DictArray";
// eslint-disable-next-line
import ScoreJSON from "../inc/scoreJSON";



export default class ScoreBundle {
	scoreJSON: ScoreJSON;

	midiNotation: object;
	matchedIds: Set<string>;
	onStatus: (...args: any) => any;
	bakingImages: string[];


	constructor (source, {loadNotation = true, onStatus = ((..._) => _), jsonHandle = json => json} = {}) {
		const {PitchContext, PitchContextTable} = StaffNotation;

		this.scoreJSON = jsonHandle(recoverJSON(source, {StaffToken, SheetDocument, PitchContext, PitchContextTable, DictArray}));
		this.onStatus = onStatus;

		if (!this.scoreJSON.midi)
			console.warn("No midi data, baking will fail.");

		this.onStatus("json loaded");

		if (loadNotation)
			this.loadNotation();
	}


	loadNotation () {
		if (this.scoreJSON.midi) {
			const midiNotation = MusicNotation.Notation.parseMidi(this.scoreJSON.midi);

			if (this.scoreJSON.noteLinkings) {
				this.scoreJSON.noteLinkings.forEach((fields, i) => Object.assign(midiNotation.notes[i], fields));

				this.matchedIds = this.scoreJSON.noteLinkings.reduce((ids, note) => (note.ids && note.ids.forEach(id => ids.add(id)), ids), new Set()) as Set<string>;

				StaffNotation.assignNotationEventsIds(midiNotation);
			}

			this.midiNotation = midiNotation;

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
