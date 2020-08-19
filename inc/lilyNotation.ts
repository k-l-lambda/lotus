
// eslint-disable-next-line
import {MusicNotation} from "@k-l-lambda/web-widgets";



export interface Note extends MusicNotation.Note {
	id: string;
	tied?: boolean;
	overlapped?: boolean;
};


export interface Notation {
	notes: Note[];
};
