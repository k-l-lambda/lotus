
import {MIDI} from "@k-l-lambda/web-widgets";



declare class SheetDocument {}
declare class PitchContextTable {}


interface NoteLinking {
	ids: string[];
	staffTrack: number;
	contextIndex: number;
}


interface ScoreMeta {
	title: string;
	composer: string;
	pageSize: {
		width: Number,
		height: Number,
	};
}


interface ScoreJSON {
	meta: ScoreMeta;
	doc: SheetDocument;
	hashTable: {[key: string]: any};
	midi: MIDI.MidiData;
	noteLinkings: NoteLinking[];
	pitchContextGroup: PitchContextTable[];
}



export default ScoreJSON;
