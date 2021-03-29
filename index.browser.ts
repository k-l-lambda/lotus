
import npmPackage from "./package.json";
import * as staffSvg from "./inc/staffSvg";
import * as staffNotation from "./inc/staffSvg/staffNotation";
import {recoverJSON} from "./inc/jsonRecovery";
import * as lilyParser from "./inc/lilyParser";
import LogRecorder from "./inc/logRecorder";
import * as constants from "./inc/constants";
import * as LilyNotation from "./inc/lilyNotation";
import StreamParser from "./inc/streamParser";
import {PitchContextTable, PitchContext} from "./inc/pitchContext";
import ScoreJSON from "./inc/scoreJSON";
import * as measureLayout from "./inc/measureLayout";

import SheetLive from "./app/components/sheet-live.vue";
import SheetSigns from "./app/components/sheet-signs.vue";
import * as SheetBaker from "./app/sheetBaker";
import ScoreBundle from "./app/scoreBundle";



const version = npmPackage.version;



export {
	version,
	staffSvg,
	staffNotation,
	recoverJSON,
	measureLayout,
	lilyParser,
	LogRecorder,
	constants,
	LilyNotation,
	StreamParser,
	SheetLive,
	SheetSigns,
	SheetBaker,
	ScoreBundle,
	PitchContextTable,
	PitchContext,
	ScoreJSON,
};
