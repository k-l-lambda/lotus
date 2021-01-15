
import {MusicNotation} from "@k-l-lambda/web-widgets";

import npmPackage from "../package.json";
import {recoverJSON} from "../inc/jsonRecovery";
import {StaffToken, SheetDocument} from "../inc/staffSvg";
import {PitchContextTable, PitchContext} from "../inc/pitchContext";
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
	scheduler: LilyNotation.Scheduler;


	static classDict = {
		StaffToken,
		SheetDocument,
		LilyNotation: LilyNotation.Notation,
		...LilyNotation.MLayoutClasses,
		DictArray,
		PitchContextTable,
		PitchContext,
	};


	static fromJSON (source: string, {measureLayout = LilyNotation.LayoutType.Full, onStatus = ((..._) => _), jsonHandle = json => json} = {}): ScoreBundle {
		const bundle = new ScoreBundle({onStatus});

		bundle.scoreJSON = jsonHandle(recoverJSON(source, ScoreBundle.classDict));
		bundle.checkVersion();

		bundle.onStatus("json loaded");

		if (bundle.scoreJSON.lilyNotation) {
			bundle.matchedIds = bundle.scoreJSON.lilyNotation.idSet;
			bundle.scoreJSON.doc.updateMatchedTokens(bundle.matchedIds);
		}

		if (measureLayout)
			bundle.loadNotation(measureLayout);

		return bundle;
	}


	constructor ({onStatus = ((..._) => _)} = {}) {
		this.onStatus = onStatus;
	}


	loadNotation (layout: LilyNotation.LayoutType, trackList?: boolean[]) {
		const lilyNotation = this.scoreJSON.lilyNotation;
		if (lilyNotation) {
			const measureIndices = lilyNotation.getMeasureIndices(layout);

			this.midiNotation = lilyNotation.toPerformingNotationWithEvents(measureIndices, {trackList});
			this.pitchContextGroup = lilyNotation.getContextGroup(measureIndices);

			const notation = lilyNotation.toPerformingNotation(measureIndices, {withRestTied: true});
			this.scheduler = LilyNotation.Scheduler.createFromNotation(notation, this.scoreJSON.doc.getTokenMap());

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
		const apiVersion = parseVersion(npmPackage.version);
		const version = parseVersion(this.scoreJSON.version);

		// warning line
		if (version < parseVersion("0.6.1"))
			console.warn(`This score bundle version[${this.scoreJSON.version}] is too low! The current Lotus API version is: ${npmPackage.version}.`);

		if (version > apiVersion)
			console.warn(`The current Lotus API version[${npmPackage.version}] is behind this score bundle[${this.scoreJSON.version}]. If any score problem encountered, try to upgrade Lotus API.`);
	}
};
