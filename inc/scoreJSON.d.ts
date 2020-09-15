
import SheetDocument from "./staffSvg/sheetDocument";
import * as LilyNotation from "../inc/lilyNotation";



/*export interface NoteLinking {
	ids: string[];
	staffTrack: number;
	contextIndex: number;
}*/


export interface ScoreMeta {
	title: string;
	composer: string;
	pageSize: {
		width: number,
		height: number,
	};
	pageCount: number;
	staffSize: number;
	trackInfos: {[key: string]: string}[];
}


interface ScoreJSON {
	version?: string;
	meta: ScoreMeta;
	doc: SheetDocument;
	hashTable: {[key: string]: any};
	lilyNotation: LilyNotation.Notation,
}



export default ScoreJSON;
