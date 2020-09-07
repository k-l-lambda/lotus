
import _ from "lodash";

import {MusicNotation} from "@k-l-lambda/web-widgets";

import {WHOLE_DURATION_MAGNITUDE} from "../lilyParser";
import {PitchContextTable} from "../pitchContext";
import {MatcherResult} from "./matcher";
import {MeasureLayout, LayoutType} from "./measureLayout";



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


interface MeasureEvent {
	data: any;
	ticks?: number;
};


interface Measure {
	tick: number;
	duration: number;

	notes: MeasureNote[];
	events?: MeasureEvent[];
};


/*interface NotationData {
	pitchContextGroup: PitchContextTable[];
	measures: Measure[];
};*/


const EXTRA_NOTE_FIELDS = ["rest", "tied", "overlapped", "contextIndex", "staffTrack"];
const COMMON_NOTE_FIELDS = ["id", "ids", "pitch", "velocity", ...EXTRA_NOTE_FIELDS];


export class Notation {
	pitchContextGroup: PitchContextTable[];
	measureLayout: MeasureLayout;
	measures: Measure[];


	static fromAbsoluteNotes (notes: Note[], measureHeads: number[], data?: Partial<Notation>): Notation {
		const notation = new Notation(data);

		notation.measures = Array(measureHeads.length).fill(null).map((__, i) => {
			const tick = measureHeads[i];
			const duration = measureHeads[i + 1] ? (measureHeads[i + 1] - tick) : 0;

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


	constructor (data?: Partial<Notation>) {
		if (data)
			Object.assign(this, data);
	}


	get ordinaryMeasureIndices (): number[] {
		if (this.measureLayout)
			return this.measureLayout.serialize(LayoutType.Ordinary);

		return Array(this.measures.length).fill(null).map((_, i) => i + 1);
	}


	toAbsoluteNotes (measureIndices: number[] = this.ordinaryMeasureIndices): Note[] {
		let measureTick = 0;
		const measureNotes: Note[][] = measureIndices.map(index => {
			const measure = this.measures[index - 1];
			console.assert(!!measure, "invalid measure index:", index, this.measures.length);

			const notes = measure.notes.map(mnote => ({
				startTick: measureTick + mnote.tick,
				endTick: measureTick + mnote.tick + mnote.duration,
				start: measureTick + mnote.tick,
				duration: mnote.duration,
				channel: 0,
				measure: index,
				..._.pick(mnote, COMMON_NOTE_FIELDS),
			}) as Note);

			measureTick += measure.duration;

			return notes;
		});

		return [].concat(...measureNotes);
	}


	toPerformingNotation (measureIndices: number[] = this.ordinaryMeasureIndices): MusicNotation.Notation {
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

		return notation;
	}


	toPerformingNotationWithEvents (type: LayoutType): MusicNotation.Notation {
		const measureIndices = this.measureLayout.serialize(type);
		//console.log("toPerformingNotationWithEvents:", this, measureIndices);

		let measureTick = 0;
		const measureEvents: MeasureEvent[][] = measureIndices.map(index => {
			const measure = this.measures[index - 1];
			console.assert(!!measure, "invalid measure index:", index, this.measures.length);

			const events = measure.events.map(mevent => ({
				ticks: measureTick + mevent.ticks,
				data: mevent.data,
			}));

			measureTick += measure.duration;

			return events;
		});

		let ticks = 0;

		const track = [].concat(...measureEvents)
			.sort((e1, e2) => e1.ticks - e2.ticks)
			.map(e => {
				e.data.deltaTime = e.ticks - ticks;
				ticks = e.ticks;

				return e.data;
			});
		track.push({deltaTime: 0, type: "meta", subtype: "endOfTrack"});

		const midi = {
			header: {
				formatType: 0,
				ticksPerBeat: TICKS_PER_BEAT,
			},
			tracks: [
				track,
			],
		};

		const notation = MusicNotation.Notation.parseMidi(midi);
		assignNotationNoteDataFromEvents(notation);

		return notation;
	}


	getContextGroup (type: LayoutType): PitchContextTable[] {
		const measureIndices = this.measureLayout.serialize(type);

		const contextGroup = this.pitchContextGroup.map(table => table.items.map(item => item.context));
		const midiNotation = this.toPerformingNotation(measureIndices);

		return PitchContextTable.createPitchContextGroup(contextGroup, midiNotation);
	}


	assignMatcher (matcher: MatcherResult): this {
		const tickFactor = TICKS_PER_BEAT / matcher.sample.ticksPerBeat;

		matcher.path.forEach((ci, si) => {
			if (ci >= 0) {
				const cn = matcher.criterion.notes[ci] as Note;
				const sn = matcher.sample.notes[si] as Note;
				sn.ids = cn.ids || [cn.id];
				sn.measure = cn.measure;
			}
		});
		assignNotationEventsIds(matcher.sample, ["ids", "measure"]);

		this.measures.forEach(measure => measure.events = []);

		//console.log("matcher.sample.events:", matcher.sample.events);
		(matcher.sample.events as MeasureEvent[]).forEach(event => {
			if (Number.isInteger(event.data.measure)) {
				const measure = this.measures[event.data.measure - 1];
				console.assert(!!measure, "measure index is invalid:", event.data.measure, this.measures.length);

				measure.events.push({
					data: event.data,
					ticks: event.ticks * tickFactor - measure.tick,
				});
			}
		});

		return this;
	}
};


export const assignNotationEventsIds = (midiNotation: MusicNotation.NotationData, fields = ["ids"]) => {
	const events = midiNotation.notes.reduce((events, note) => {
		const dict = _.pick(note, fields);
		events.push({ticks: note.startTick, subtype: "noteOn", channel: note.channel, pitch: note.pitch, dict});
		events.push({ticks: note.startTick, subtype: "setTempo", dict});
		events.push({ticks: note.endTick, subtype: "noteOff", channel: note.channel, pitch: note.pitch, dict});

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
					Object.assign(event.data, ne.dict);
					break;
				}
			}
		}
	}
};


const assignNotationNoteDataFromEvents = (midiNotation: MusicNotation.NotationData, fields = ["ids"]) => {
	const noteId = (channel: number, pitch: number, tick: number): string => `${channel}|${pitch}|${tick}`;

	const noteMap = midiNotation.notes.reduce((map, note) => {
		map[noteId(note.channel, note.pitch, note.startTick)] = note;

		return map;
	}, {});

	midiNotation.events.forEach(event => {
		if (event.data.subtype === "noteOn") {
			const id = noteId(event.data.channel, event.data.noteNumber, event.ticks);
			const note = noteMap[id];
			console.assert(!!note, "cannot find note of", id);

			if (note)
				Object.assign(note, _.pick(event.data, fields));
		}
	});
};
