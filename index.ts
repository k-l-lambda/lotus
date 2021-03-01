
import npmPackage from "./package.json";
import * as staffSvg from "./inc/staffSvg";
import * as lilyParser from "./inc/lilyParser";
import * as backend from "./backend";
import LogRecorder from "./inc/logRecorder";
import * as constants from "./inc/constants";
import * as LilyNotation from "./inc/lilyNotation";
import {recoverJSON} from "./inc/jsonRecovery";
import {PitchContextTable, PitchContext} from "./inc/pitchContext";
import ScoreJSON from "./inc/scoreJSON";



const version = npmPackage.version;



export {
	version,
	staffSvg,
	lilyParser,
	LilyNotation,
	LogRecorder,
	backend,
	constants,
	recoverJSON,
	PitchContextTable,
	PitchContext,
	ScoreJSON,
};
