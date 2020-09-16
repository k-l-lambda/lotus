
import {MusicNotation} from "@k-l-lambda/web-widgets";

import npmPackage from "../package.json";
import {recoverJSON} from "../inc/jsonRecovery";
import {StaffToken, SheetDocument} from "../inc/staffSvg";
import {PitchContextTable} from "../inc/pitchContext";
import * as LilyNotation from "../inc/lilyNotation";
import * as SheetBaker from "./sheetBaker";
import DictArray from "../inc/DictArray";
import ScoreJSON from "../inc/scoreJSON";



const parseVersion = (ver: string): number => {
	if(ver) {
		const captures = ver.match(/\d+/g);
		if (captures) {
			const numbers = captures.map(Number).reverse();

			return numbers.reduce((ver, n, i) => ver + n * (1000 ** i), 0);
		}
	}

	return -1;
};



export default class ScoreBundle {
	scoreJSON: ScoreJSON;

	midiNotation: MusicNotation.Notation;
	pitchContextGroup: PitchContextTable[];
	matchedIds: Set<string>;
	onStatus: (...args: any) => any;
	bakingImages: string[];


	constructor (source: string, {measureLayout = LilyNotation.LayoutType.Full, onStatus = ((..._) => _), jsonHandle = json => json} = {}) {
		this.onStatus = onStatus;

		this.scoreJSON = jsonHandle(recoverJSON(source, {StaffToken, SheetDocument, LilyNotation: LilyNotation.Notation, ...LilyNotation.MLayoutClasses, DictArray}));
		this.checkVersion();

		this.onStatus("json loaded");

		if (this.scoreJSON.lilyNotation) {
			this.matchedIds = this.scoreJSON.lilyNotation.idSet;
			this.scoreJSON.doc.updateMatchedTokens(this.matchedIds);
		}

		if (measureLayout)
			this.loadNotation(measureLayout);
	}


	loadNotation (layout: LilyNotation.LayoutType) {
		const lilyNotation = this.scoreJSON.lilyNotation;
		if (lilyNotation) {
			const measureIndices = lilyNotation.getMeasureIndices(layout);

			this.midiNotation = lilyNotation.toPerformingNotationWithEvents(measureIndices);
			this.pitchContextGroup = lilyNotation.getContextGroup(measureIndices);

			this.onStatus("notation loaded");
		}
	}


	bakeSheet (canvas: HTMLCanvasElement) {
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


	checkVersion () {
		//const apiVersion = parseVersion(npmPackage.version);
		const version = parseVersion(this.scoreJSON.version);

		// warning line
		if (version < parseVersion("0.6.1"))
			console.warn(`This score bundle version[${this.scoreJSON.version}] is too low! The current Lotus API version is: ${npmPackage.version}.`);
	}
};
