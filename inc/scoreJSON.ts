
import SheetDocument from "./staffSvg/sheetDocument";
import {HashTable} from "./staffSvg/tokenizeElements";
import * as LilyNotation from "./lilyNotation";



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
	hash?: number;
	meta: ScoreMeta;
	doc: SheetDocument;
	hashTable: HashTable;
	lilyNotation: LilyNotation.Notation;
}



export default ScoreJSON;
