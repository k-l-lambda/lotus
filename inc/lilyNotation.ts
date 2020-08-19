
// eslint-disable-next-line
import {MusicNotation} from "@k-l-lambda/web-widgets";



export interface Note extends MusicNotation.Note {
	id: string;
	endTick: number;
	tied?: boolean;
	overlapped?: boolean;
};


export interface Notation {
	notes: Note[];
};
