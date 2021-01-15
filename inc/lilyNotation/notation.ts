
import _ from "lodash";

import {MusicNotation, MIDI} from "@k-l-lambda/web-widgets";

import {WHOLE_DURATION_MAGNITUDE} from "../lilyParser/utils";
import {PitchContextTable} from "../pitchContext";
import {MatcherResult} from "./matcher";
import {MeasureLayout, LayoutType} from "../measureLayout";
import ImplicitType from "./implicitType";
import npmPackage from "../../package.json";



const TICKS_PER_BEAT = WHOLE_DURATION_MAGNITUDE / 4;

// import WHOLE_DURATION_MAGNITUDE from "../lilyParser" may result in null error in nodejs
console.assert(Number.isFinite(TICKS_PER_BEAT), "TICKS_PER_BEAT is invalid:", TICKS_PER_BEAT);


interface ChordPosition {
	index: number;
	count: number;
};


interface StaffNoteProperties {
	rest: boolean;
	tied: boolean;
	overlapped: boolean;
	implicitType: ImplicitType;
	afterGrace: boolean;
	chordPosition: ChordPosition;

	contextIndex: number;
	staffTrack: number;
};


export interface Note extends MusicNotation.Note, Partial<StaffNoteProperties> {
	id: string;
	measure: number;
	endTick: number;
};


interface SubNote {
	startTick: number;
	endTick: number;
	pitch: number;
	velocity?: number;
};


interface MeasureNote extends Partial<StaffNoteProperties> {
	tick: number;
	pitch: number;
	duration: number;
	chordPosition: ChordPosition;

	track: number;
	channel: number;
	id: string;
	ids: string[];

	subNotes: SubNote[];
};


interface MeasureEvent {
	data: any;
	track: number;
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


const EXTRA_NOTE_FIELDS = ["rest", "tied", "overlapped", "implicitType", "afterGrace", "contextIndex", "staffTrack", "chordPosition"];
const COMMON_NOTE_FIELDS = ["id", "ids", "pitch", "velocity", "track", "channel", ...EXTRA_NOTE_FIELDS];


export class Notation {
	pitchContextGroup: PitchContextTable[];
	measureLayout: MeasureLayout;
	measures: Measure[];

	trackNames: string[];
	idTrackMap: {[key: string]: number};

	ripe: boolean = false;


	static fromAbsoluteNotes (notes: Note[], measureHeads: number[], data?: Partial<Notation>): Notation {
		const notation = new Notation(data);

		notation.measures = Array(measureHeads.length).fill(null).map((__, i) => {
			const tick = measureHeads[i];
			const duration = measureHeads[i + 1] ? (measureHeads[i + 1] - tick) : 0;

			const mnotes = notes.filter(note => note.measure === i + 1).map(note => ({
				tick: note.startTick - tick,
				duration: note.endTick - note.startTick,
				..._.pick(note, COMMON_NOTE_FIELDS),
				subNotes: [],
			} as MeasureNote));

			// reduce note data size
			mnotes.forEach(mn => ["rest", "tied", "implicitType", "afterGrace"].forEach(field => {
				if (!mn[field])
					delete mn[field];
			}));

			return {
				tick,
				duration,
				notes: mnotes,
			};
		});

		notation.idTrackMap = notes.reduce((map, note) => {
			if (note.id)
				map[note.id] = note.track;

			return map;
		}, {});

		return notation;
	}


	static performAbsoluteNotes (abNotes: Note[]): MusicNotation.Note[] {
		const notes = abNotes.filter(note => !note.rest && !note.tied && !note.overlapped).map(note => ({
			measure: note.measure,
			channel: note.channel,
			track: note.track,
			start: note.start,
			startTick: note.startTick,
			endTick: note.endTick,
			pitch: note.pitch,
			duration: note.duration,
			velocity: note.velocity || 127,
			id: note.id,
			ids: note.ids,
			staffTrack: note.staffTrack,
			contextIndex: note.contextIndex,
			implicitType: note.implicitType,
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


	// In Lilypond 2.20.0, minus tick value at the head of a track result in MIDI event time bias,
	//	So store the bias values to correct MIDI time from lilyond.
	get trackTickBias (): {[key: string]: number} {
		const headMeasure = this.measures[0];
		return this.trackNames.reduce((map, name, track) => {
			map[name] = 0;
			if (headMeasure) {
				const note = headMeasure.notes.find(note => note.track === track);
				if (note)
					map[name] = Math.min(note.tick, 0);
			}

			return map;
		}, {});
	}


	get idSet (): Set<string> {
		return this.measures.reduce((set, measure) =>
			(measure.notes.forEach(note => note.ids.forEach(id => set.add(id))), set), new Set<string>());
	}


	toJSON () {
		return {
			__prototype: "LilyNotation",
			pitchContextGroup: this.pitchContextGroup,
			measureLayout: this.measureLayout,
			measures: this.measures,
			idTrackMap: this.idTrackMap,
			trackNames: this.trackNames,
			ripe: this.ripe,
		};
	}


	toAbsoluteNotes (measureIndices: number[] = this.ordinaryMeasureIndices): Note[] {
		let measureTick = 0;
		const measureNotes: Note[][] = measureIndices.map(index => {
			const measure = this.measures[index - 1];
			console.assert(!!measure, "invalid measure index:", index, this.measures.length);

			const notes = measure.notes.map(mnote => {
				// TODO: process arpeggio note time

				return {
					startTick: measureTick + mnote.tick,
					endTick: measureTick + mnote.tick + mnote.duration,
					start: measureTick + mnote.tick,
					duration: mnote.duration,
					measure: index,
					..._.pick(mnote, COMMON_NOTE_FIELDS),
				} as Note;
			});

			measureTick += measure.duration;

			return notes;
		});

		return [].concat(...measureNotes);
	}


	getMeasureIndices (type: LayoutType) {
		return this.measureLayout.serialize(type);
	}


	toPerformingNotation (measureIndices: number[] = this.ordinaryMeasureIndices): MusicNotation.Notation {
		//console.debug("toPerformingNotation:", this, measureIndices);
		const abNotes = this.toAbsoluteNotes(measureIndices);
		const notes = Notation.performAbsoluteNotes(abNotes);

		const lastNote = notes[notes.length - 1];
		const endTime = lastNote ? (lastNote.start + lastNote.duration) : 0;

		const notation = new MusicNotation.Notation({
			ticksPerBeat: TICKS_PER_BEAT,
			meta: {},
			tempos: [],	// TODO
			channels: [notes],
			endTime,
		});

		return notation;
	}


	toPerformingMIDI (measureIndices: number[], {trackList}: {trackList?: boolean[]} = {}): MIDI.MidiData {
		if (!measureIndices.length)
			return null;

		let measureTick = 0;
		const measureEvents: MeasureEvent[][] = measureIndices.map(index => {
			const measure = this.measures[index - 1];
			console.assert(!!measure, "invalid measure index:", index, this.measures.length);

			const events = measure.events.map(mevent => ({
				ticks: measureTick + mevent.ticks,
				track: mevent.track,
				data: {
					...mevent.data,
					measure: index,
				},
			}));

			measureTick += measure.duration;

			return events;
		});

		interface MidiEvent extends MIDI.MidiEvent {
			ticks?: number;
			measure?: number;
			ids?: string[];
			staffTrack?: number;
		};
		type MidiTrack = MidiEvent[];

		const eventPriority = (event: MidiEvent): number => event.ticks + (event.subtype === "noteOff" ? -1e-4 : 0);

		const tracks: MidiTrack[] = [].concat(...measureEvents).reduce((tracks, mevent) => {
			tracks[mevent.track] = tracks[mevent.track] || [];
			tracks[mevent.track].push({
				ticks: mevent.ticks,
				...mevent.data,
			});

			return tracks;
		}, []);

		tracks[0] = tracks[0] || [];
		tracks[0].push({
			ticks: 0,
			type: "meta",
			subtype: "text",
			text: `${npmPackage.name} ${npmPackage.version}`,
		});

		// append note events
		measureTick = 0;
		measureIndices.map(index => {
			const measure = this.measures[index - 1];
			console.assert(!!measure, "invalid measure index:", index, this.measures.length);

			measure.notes.forEach(note => {
				if (trackList && !trackList[note.track])
					return;

				const tick = measureTick + note.tick;

				const track = tracks[note.track] = tracks[note.track] || [];

				note.subNotes.forEach(subnote => {
					track.push({
						ticks: tick + subnote.startTick,
						measure: index,
						ids: note.ids,
						type: "channel",
						subtype: "noteOn",
						channel: note.channel,
						noteNumber: subnote.pitch,
						velocity: subnote.velocity,
						staffTrack: note.staffTrack,
					});

					track.push({
						ticks: tick + subnote.endTick,
						measure: index,
						ids: note.ids,
						type: "channel",
						subtype: "noteOff",
						channel: note.channel,
						noteNumber: subnote.pitch,
						velocity: 0,
						staffTrack: note.staffTrack,
					});
				});
			});

			measureTick += measure.duration;
		});

		const finalTick = measureTick;

		// ensure no empty track
		for (let t = 0; t < tracks.length; ++t)
			tracks[t] = tracks[t] || [];

		// sort & make deltaTime
		tracks.forEach(events => {
			events.sort((e1, e2) => eventPriority(e1) - eventPriority(e2));

			let ticks = 0;
			events.forEach(event => {
				event.deltaTime = event.ticks - ticks;
				ticks = event.ticks;
			});

			events.push({deltaTime: Math.max(finalTick - ticks, 0), type: "meta", subtype: "endOfTrack"});
		});

		return {
			header: {
				formatType: 0,
				ticksPerBeat: TICKS_PER_BEAT,
			},
			tracks,
		};
	}


	toPerformingNotationWithEvents (measureIndices: number[], options: {trackList?: boolean[]} = {}): MusicNotation.Notation {
		if (!measureIndices.length)
			return null;

		const midi = this.toPerformingMIDI(measureIndices, options);
		const notation = MusicNotation.Notation.parseMidi(midi);

		assignNotationNoteDataFromEvents(notation);

		let tick = 0;

		notation.measures = measureIndices.map(index => {
			const startTick = tick;
			tick += this.measures[index - 1].duration;

			return {
				index,
				startTick,
				endTick: tick,
			};
		});

		return notation;
	}


	getContextGroup (measureIndices: number[]): PitchContextTable[] {
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

		// assign sub notes
		const c2sIndices = Array(matcher.criterion.notes.length).fill(null).map(() => []);
		matcher.path.forEach((ci, si) => ci >= 0 && c2sIndices[ci].push(si));

		const velocities: {[key: number]: number} = {};
		c2sIndices.forEach((indices, ci) => {
			const cn = matcher.criterion.notes[ci] as any;
			const measure = this.measures[cn.measure - 1];
			console.assert(!!measure, "cannot find measure for c note:", cn, this.measures.length);

			//const mn = measure.notes.find(note => note.tick === cn.startTick - measure.tick && note.pitch === cn.pitch);
			const mn = measure.notes.find(note => note.id === cn.id && note.pitch === cn.pitch);
			console.assert(!!mn, "cannot find measure note for c note:", cn, measure);

			const snotes = indices
				.map(si => matcher.sample.notes[si])
				.filter((sn, i) => Math.abs(sn.startTick - cn.startTick) < WHOLE_DURATION_MAGNITUDE
					&& (!mn.afterGrace || i < 1)); // lilypond's afterGrace MIDI parsing is ill, clip notes to avoid error matching

			if (!snotes.length) {
				//const track = matcher.trackMap[mn.track];

				mn.subNotes = [{
					//track,
					startTick: 0,
					endTick: mn.duration,
					pitch: mn.pitch,
					velocity: velocities[mn.track] || 90,
				}];
			}
			else {
				const sn0 = snotes[0];

				mn.subNotes = snotes.map(sn => {
					velocities[sn.track] = sn.velocity;

					console.assert(sn.endTick > sn.startTick, "midi note duration is zero or negative:", sn);

					// fix bad subnote duration
					const duration = sn.endTick - sn.startTick;
					if (duration > mn.duration * 2)
						sn.endTick = sn.startTick + mn.duration;

					return {
						//track: sn.track,
						startTick: Math.round(sn.startTick - sn0.startTick),
						endTick: Math.round(sn.endTick - sn0.startTick),
						pitch: sn.pitch,
						velocity: sn.velocity,
					};
				});
			}
		});

		// assign events
		this.measures.forEach(measure => measure.events = []);

		//console.debug("matcher.trackMap:", matcher.trackMap);
		(matcher.sample.events as MeasureEvent[]).forEach(event => {
			// exclude note events
			if (["noteOn", "noteOff"].includes(event.data.subtype))
				return;

			let track = matcher.trackMap[event.track];
			if (!Number.isFinite(track)) {
				const id = event.data.ids && event.data.ids[0];
				track = id ? (this.idTrackMap[id] || 0) : 0;
			}

			if (Number.isInteger(event.data.measure)) {
				const measure = this.measures[event.data.measure - 1];
				console.assert(!!measure, "measure index is invalid:", event.data.measure, this.measures.length);

				measure.events.push({
					data: event.data,
					track,
					ticks: Math.round(event.ticks * tickFactor - measure.tick),
				});
			}
			else {
				switch (event.data.subtype) {
				case "setTempo":
				case "timeSignature":
				case "keySignature": {
					// find container measure by tick range
					const tick = event.ticks * tickFactor;
					const measure = this.measures.find(measure => tick >= measure.tick && tick < measure.tick + measure.duration);
					if (measure) {
						measure.events.push({
							data: event.data,
							track,
							ticks: Math.round(tick - measure.tick),
						});
					}
				}

					break;
				}
			}
		});

		this.ripe = true;

		return this;
	}


	// find the MIDI event of setTempo in measures data, and change the value of microsecondsPerBeat
	setTempo (bpm: number): boolean {
		let found = false;
		for (const measure of this.measures) {
			for (const event of measure.events) {
				if (event.data.subtype === "setTempo") {
					event.data.microsecondsPerBeat = 60e+6 / bpm;
					found = true;
				}
			}
		}

		return found;
	}
};


export const assignNotationEventsIds = (midiNotation: MusicNotation.NotationData, fields = ["ids"]) => {
	const events = midiNotation.notes.reduce((events, note) => {
		const dict = _.pick(note, fields);
		events.push({ticks: note.startTick, subtype: "noteOn", channel: note.channel, pitch: note.pitch, dict});
		events.push({ticks: note.endTick, subtype: "noteOff", channel: note.channel, pitch: note.pitch, dict});

		["setTempo", "timeSignature", "keySignature"].forEach(subtype => events.push({ticks: note.startTick, subtype, dict}));

		return events;
	}, []).sort((e1, e2) => e1.ticks - e2.ticks);

	let index = -1;
	let ticks = -Infinity;
	for (const event of midiNotation.events) {
		console.assert(Number.isFinite(event.ticks), "invalid event ticks:", event);

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
			if (!ne) {
				console.warn("null event:", i, events.length);
				break;
			}

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


const assignNotationNoteDataFromEvents = (midiNotation: MusicNotation.NotationData, fields = ["ids", "measure", "staffTrack"]) => {
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
