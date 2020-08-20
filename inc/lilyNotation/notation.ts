
// eslint-disable-next-line
import {MusicNotation} from "@k-l-lambda/web-widgets";
// eslint-disable-next-line
import {PitchContextTable} from "inc/pitchContext";



export interface Note extends MusicNotation.Note {
	id: string;
	endTick: number;
	tied?: boolean;
	overlapped?: boolean;
};


export interface Notation {
	notes: Note[];
	pitchContextGroup: PitchContextTable[];
};
