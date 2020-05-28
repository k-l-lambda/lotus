
import {MusicNotation} from "@k-l-lambda/web-widgets";

import {recoverJSON} from "../inc/jsonRecovery";
import {StaffToken, SheetDocument, PitchContext, PitchContextTable} from "../inc/staffSvg";
import * as StaffNotation from "../inc/staffSvg/staffNotation";
import * as SheetBaker from "./sheetBaker";
import DictArray from "../inc/DictArray";



export default class ScoreBundle {
	scoreJSON: {
		doc: SheetDocument;
		hashTable: {[key: string]: any};
		midi: object;
		noteLinkings: any[];
		pitchContextGroup: object[];
	};

	midiNotation: object;
	matchedIds: Set<string>;
	onStatus: (...args: any) => any;
	bakingImages: string[];


	constructor (source, {onStatus = (..._) => _} = {}) {
		this.scoreJSON = recoverJSON(source, {StaffToken, SheetDocument, PitchContext, PitchContextTable, DictArray});
		this.onStatus = onStatus;

		if (!this.scoreJSON.midi)
			console.warn("No midi data, baking will fail.");

		this.onStatus("json loaded");

		if (this.scoreJSON.midi) {
			const midiNotation = MusicNotation.Notation.parseMidi(this.scoreJSON.midi);

			if (this.scoreJSON.noteLinkings) {
				this.scoreJSON.noteLinkings.forEach((fields, i) => Object.assign(midiNotation.notes[i], fields));

				this.matchedIds = this.scoreJSON.noteLinkings.reduce((ids, note) => (note.ids && note.ids.forEach(id => ids.add(id)), ids), new Set());

				StaffNotation.assignNotationEventsIds(midiNotation);
			}

			this.midiNotation = midiNotation;
		}
	}


	bakeSheet (canvas) {
		console.assert(!!this.scoreJSON.doc, "sheetDocument is null.");
		console.assert(!!this.scoreJSON.hashTable, "hashTable is null.");
		console.assert(!!this.matchedIds, "matchedIds is null.");

		return SheetBaker.bakeLiveSheetGen({
			sheetDocument: this.scoreJSON.doc,
			hashTable: this.scoreJSON.hashTable,
			matchedIds: this.matchedIds,
			canvas,
		});
	}
};
