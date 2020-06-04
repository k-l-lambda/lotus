
declare class SheetDocument {}
declare class PitchContextTable {}


interface NoteLinking {
	ids: string[];
	staffTrack: number;
	contextIndex: number;
}


interface ScoreJSON {
	doc: SheetDocument;
	hashTable: {[key: string]: any};
	midi: object;
	noteLinkings: NoteLinking[];
	pitchContextGroup: PitchContextTable[];
}
