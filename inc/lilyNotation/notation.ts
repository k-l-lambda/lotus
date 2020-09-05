
import _ from "lodash";

// eslint-disable-next-line
import {MusicNotation, MIDI, MidiUtils} from "@k-l-lambda/web-widgets";

import {WHOLE_DURATION_MAGNITUDE} from "../lilyParser";
// eslint-disable-next-line
import {PitchContextTable, PitchContext} from "../pitchContext";
// eslint-disable-next-line
import {MatcherResult} from "./matcher";



const TICKS_PER_BEAT = WHOLE_DURATION_MAGNITUDE / 4;


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
	events?: MIDI.MidiEvent[];
};


interface NotationData {
	pitchContextGroup: PitchContextTable[];
	measures: Measure[];
};


const EXTRA_NOTE_FIELDS = ["rest", "tied", "overlapped", "contextIndex", "staffTrack"];
const COMMON_NOTE_FIELDS = ["id", "ids", "pitch", "velocity", ...EXTRA_NOTE_FIELDS];


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
				..._.pick(note, COMMON_NOTE_FIELDS),
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
			measure: note.measure,
			channel: note.channel,
			start: note.start,
			startTick: note.startTick,
			pitch: note.pitch,
			duration: note.duration,
			velocity: note.velocity || 127,
			id: note.id,
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
		let measureTick = 0;
		const measureNotes: Note[][] = measureIndices.map(index => {
			const measure = this.measures[index];
			console.assert(!!measure, "invalid measure index:", index, this.measures.length);

			const notes = measure.notes.map(mnote => ({
				startTick: measureTick + mnote.tick,
				endTick: measureTick + mnote.tick + mnote.duration,
				start: measureTick + mnote.tick,
				duration: mnote.duration,
				channel: 0,
				measure: index + 1,
				..._.pick(mnote, COMMON_NOTE_FIELDS),
			}) as Note);

			measureTick += measure.duration;

			return notes;
		});

		return [].concat(...measureNotes);
	}


	toPerformingNotation ({measureIndices = this.ordinaryMeasureIndices, withEvents = true}: {
		measureIndices?: number[],
		withEvents?: boolean,
	} = {}): MusicNotation.Notation {
		const abNotes = this.toAbsoluteNotes(measureIndices);
		const notes = Notation.performAbsoluteNotes(abNotes);
		const endTime = notes[notes.length - 1].start + notes[notes.length - 1].duration;

		const notation = new MusicNotation.Notation({
			ticksPerBeat: TICKS_PER_BEAT,
			meta: {},
			tempos: [],	// TODO
			channels: [notes],
			endTime,
		});

		if (withEvents) {
			const midi = MidiUtils.encodeToMIDIData(notation);
			const midiNotation = MusicNotation.Notation.parseMidi(midi);
			notation.events = midiNotation.events;
			notation.keyRange = midiNotation.keyRange;
			notation.tempos = midiNotation.tempos;
			notation.endTime = midiNotation.endTime;
			notation.endTick = midiNotation.endTick;

			assignNotationEventsIds(notation);
		}

		return notation;
	}


	getContextGroup (): PitchContext[][] {
		return this.pitchContextGroup.map(table => table.items.map(item => item.context));
	}


	replaceMatchedNotes (matcher: MatcherResult): this {
		const tickFactor = TICKS_PER_BEAT / matcher.sample.ticksPerBeat;

		this.measures.forEach(measure => measure.notes = []);

		matcher.path.forEach((ci, si) => {
			if (ci >= 0) {
				const cn = matcher.criterion.notes[ci] as Note;
				const sn = matcher.sample.notes[si];

				const measure = this.measures[cn.measure - 1];
				console.assert(!!measure, "measure index is invalid:", cn.measure, this.measures.length, ci, si);

				measure.notes.push({
					tick: sn.startTick * tickFactor - measure.tick,
					duration: (sn.endTick - sn.startTick) * tickFactor,
					pitch: sn.pitch,
					velocity: sn.velocity,
					id: cn.id,
					ids: cn.ids,
					..._.pick(cn, EXTRA_NOTE_FIELDS),
				});
			}
		});

		// TODO: copy MIDI events, at least for setTempo

		return this;
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
