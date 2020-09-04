
import _ from "lodash";

// eslint-disable-next-line
import {MusicNotation} from "@k-l-lambda/web-widgets";
// eslint-disable-next-line
import {PitchContextTable} from "../pitchContext";



export interface Note extends MusicNotation.Note {
	id: string;
	measure: number;
	endTick: number;
	rest?: boolean;
	tied?: boolean;
	overlapped?: boolean;

	contextIndex?: number;
	staffTrack?: number;
};


interface MeasureNote {
	tick: number;
	duration: number;

	id: string;
	ids: string[];
	pitch: number;
	velocity?: number;
	rest?: boolean;
	tied?: boolean;
	overlapped?: boolean;

	contextIndex?: number;
	staffTrack?: number;
};


interface Measure {
	tick: number;
	duration: number;
	notes: MeasureNote[];
};


interface NotationData {
	pitchContextGroup: PitchContextTable[];
	measures: Measure[];
};


export class Notation implements NotationData {
	pitchContextGroup: PitchContextTable[];
	measures: Measure[];


	static fromAbsoluteNotes (notes: Note[], measureHeads: number[], data?: Partial<NotationData>): Notation {
		const notation = new Notation(data);

		notation.measures = Array(measureHeads.length - 1).fill(null).map((__, i) => {
			const tick = measureHeads[i];
			const duration = measureHeads[i + 1] - tick;

			const mnotes = notes.filter(note => note.measure === i + 1).map(note => ({
				tick: note.startTick - tick,
				duration: note.endTick - note.startTick,
				..._.pick(note, ["id", "ids", "pitch", "velocity", "rest", "tied", "overlapped", "contextIndex", "staffTrack"]),
			} as MeasureNote));

			return {
				tick,
				duration,
				notes: mnotes,
			};
		});

		return notation;
	}


	static performAbsoluteNotes (abNotes: Note[]): MusicNotation.Note[] {
		const notes = abNotes.filter(note => !note.rest && !note.tied && !note.overlapped).map(note => ({
			channel: note.channel,
			start: note.start,
			pitch: note.pitch,
			duration: note.duration,
			velocity: note.velocity || 127,
			ids: note.ids,
			staffTrack: note.staffTrack,
			contextIndex: note.contextIndex,
		}));

		const noteMap = notes.reduce((map, note) => {
			const key = `${note.channel}|${note.start}|${note.pitch}`;
			const priorNote = map[key];
			if (priorNote)
				priorNote.ids.push(...note.ids);
			else
				map[key] = note;
	
			return map;
		}, {});

		return Object.values(noteMap);
	}


	constructor (data?: Partial<NotationData>) {
		if (data)
			Object.assign(this, data);
	}


	get ordinaryMeasureIndices (): number[] {
		return [...Array(this.measures.length).keys()];
	}


	// TODO:
	//get fullMeasureIndices (): number[]
	//get conservativeMeasureIndices (): number[]
	//get onceMeasureIndices (): number[]


	toAbsoluteNotes (measureIndices: number[] = this.ordinaryMeasureIndices): Note[] {
		// TODO:

		return [];
	}


	toPerformingNotation (measureIndices: number[] = this.ordinaryMeasureIndices): MusicNotation.Notation {
		const abNotes = this.toAbsoluteNotes(measureIndices);
		const notes = Notation.performAbsoluteNotes(abNotes);
		const endTime = notes[notes.length - 1].start + notes[notes.length - 1].duration;

		return new MusicNotation.Notation({
			meta: {},
			tempos: [],
			channels: [notes],
			endTime,
		});
	}
};


export const assignNotationEventsIds = (midiNotation: MusicNotation.NotationData) => {
	const events = midiNotation.notes.reduce((events, note) => {
		events.push({ticks: note.startTick, subtype: "noteOn", channel: note.channel, pitch: note.pitch, ids: note.ids});
		events.push({ticks: note.endTick, subtype: "noteOff", channel: note.channel, pitch: note.pitch, ids: note.ids});

		return events;
	}, []).sort((e1, e2) => e1.ticks - e2.ticks);

	let index = -1;
	let ticks = -Infinity;
	for (const event of midiNotation.events) {
		while (event.ticks > ticks && index < events.length) {
			++index;
			ticks = events[index] && events[index].ticks;
		}

		if (index >= events.length)
			break;

		if (event.ticks < ticks)
			continue;

		for (let i = index; i < events.length; ++i) {
			const ne = events[i];
			if (ne.ticks > ticks)
				break;
			else {
				if (event.data.subtype === ne.subtype && event.data.channel === ne.channel && event.data.noteNumber === ne.pitch) {
					(event.data as any).ids = ne.ids;
					break;
				}
			}
		}
	}
};
