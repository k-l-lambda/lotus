
import _ from "lodash";
import sha1 from "sha1";
import {Matcher} from "@k-l-lambda/web-widgets";

import LogRecorder from "../logRecorder";
import DictArray from "../DictArray";
import {roundNumber, constants} from "./utils";



const TICKS_PER_BEAT = 480;

const GROUP_N_TO_PITCH = [0, 2, 4, 5, 7, 9, 11];
const MIDDLE_C = 60;


const mod7 = x => {
	let y = x % 7;
	while (y < 0)
		y += 7;

	return y;
};

const mod12 = x => {
	let y = x % 12;
	while (y < 0)
		y += 12;

	return y;
};


interface NotationNote {
	track?: number;
	time: number;
	pitch: number;
	id: number;
	tied: boolean;
	contextIndex: number;
};


const stringifyNumber = x => Number.isFinite(x) ? x : x.toString();


/*
	Coordinates:

		note:
			zero: the middle C line (maybe altered)
			positive: high (right on piano keyboard)
			unit: a step in scales of the current staff key

		staff Y:
			zero: the third (middle) line among 5 staff lines
			positive: down
			unit: a interval between 2 neighbor staff lines
*/


class PitchContext {
	clef = -3;
	keyAlters: DictArray;
	octaveShift = 0;
	alters: DictArray;


	constructor (data) {
		//console.assert(data.keyAlters instanceof DictArray, "unexpected keyAlters:", data);
		Object.assign(this, data);
	}


	toJSON () {
		return {
			__prototype: this.constructor.name,
			clef: this.clef,
			keyAlters: new DictArray(this.keyAlters),
			octaveShift: this.octaveShift,
			alters: new DictArray(this.alters),
		};
	}


	get keySignature () {
		return this.keyAlters.filter(a => Number.isInteger(a)).reduce((sum, a) => sum + a, 0);
	}


	noteToY (note: number): number {
		return -note / 2 - this.clef - this.octaveShift * 3.5;
	}


	pitchToNote (pitch: number, {preferredAlter = null} = {}) {
		if (!preferredAlter)
			preferredAlter = this.keySignature < 0 ? -1 : 1;

		const group = Math.floor((pitch - MIDDLE_C) / 12);
		const gp = mod12(pitch);
		const alteredGp = GROUP_N_TO_PITCH.includes(gp) ? gp : mod12(gp - preferredAlter);
		const gn = GROUP_N_TO_PITCH.indexOf(alteredGp);
		console.assert(gn >= 0, "invalid preferredAlter:", pitch, preferredAlter, alteredGp);

		const naturalNote = group * 7 + gn;

		const alterValue = gp - alteredGp;
		const keyAlterValue = this.keyAlters[gn] || 0;
		const onAcc = Number.isInteger(this.alters[naturalNote]);

		const alter = onAcc ? alterValue :
			(alterValue === keyAlterValue ? null : alterValue);

		return {note: naturalNote, alter};
	}


	pitchToY (pitch: number, {preferredAlter = null} = {}) {
		const {note, alter} = this.pitchToNote(pitch, {preferredAlter});
		const y = this.noteToY(note);

		return {y, alter};
	}


	get hash () {
		return sha1(JSON.stringify(this));
	}
};


interface PitchContextItem {
	tick: number;
	endTick: number;
	context: PitchContext;
};


class PitchContextTable {
	items: PitchContextItem[];


	static createFromNotation (contexts: PitchContext[], midiNotation, track: number) {
		const items = [];

		let index = -1;
		const notes = midiNotation.notes.filter(note => note.staffTrack === track);
		for (const note of notes) {
			while (note.contextIndex > index) {
				++index;
				const context = contexts[index];
				console.assert(!!context, "invalid contextIndex:", index, note.contextIndex, contexts.length);

				items.push({
					tick: note.startTick,
					context,
				});
			}
		}

		// assign end ticks
		items.forEach((item, i) => item.endTick = (i + 1 < items.length ? items[i + 1].tick : Infinity));

		// start from 0
		if (items[0])
			items[0].tick = 0;

		return new PitchContextTable({items});
	}


	// workaround 'Infinity' JSON representation issue.
	static itemToJSON (item) {
		return {
			...item,
			endTick: stringifyNumber(item.endTick),
		};
	}


	static itemFromJSON (item) {
		return {
			...item,
			endTick: Number(item.endTick),
		};
	}


	constructor ({items}) {
		this.items = items.map(PitchContextTable.itemFromJSON);
	}


	toJSON () {
		return {
			__prototype: this.constructor.name,
			items: this.items.map(PitchContextTable.itemToJSON),
		};
	}


	lookup (tick) {
		return this.items.find(item => tick >= item.tick && tick < item.endTick).context;
	}
};


class NotationTrack {
	endTime = 0;
	notes: NotationNote[] = [];

	contexts: PitchContext[] = [];


	get lastPitchContext () {
		if (this.contexts.length)
			return this.contexts[this.contexts.length - 1];

		return null;
	}


	appendNote (time, data) {
		this.notes.push({
			time: this.endTime + time,
			...data,
		});
	}
};


class StaffContext {
	logger: LogRecorder;

	beatsPerMeasure = 4;
	clef = -3;
	keyAlters = new DictArray();
	octaveShift = 0;
	alters = new DictArray();
	track = new NotationTrack();

	dirty = true;


	constructor ({logger}) {
		this.logger = logger;
	}


	snapshot () {
		if (this.dirty) {
			const context = new PitchContext({
				clef: this.clef,
				keyAlters: this.keyAlters.clone(),
				octaveShift: this.octaveShift,
				alters: this.alters.clone(),
			});
			if (!this.track.lastPitchContext || context.hash !== this.track.lastPitchContext.hash)
				this.track.contexts.push(context);

			this.dirty = false;
		}

		return this.track.contexts.length - 1;
	}


	resetKeyAlters () {
		this.logger.append("resetKeyAlters", Object.keys(this.keyAlters).length);

		if (Object.keys(this.keyAlters).length) {
			this.keyAlters.clear();

			this.dirty = true;
		}
	}


	resetAlters () {
		this.logger.append("resetAlters", Object.keys(this.alters).length);

		if (Object.keys(this.alters).length) {
			this.alters.clear();

			this.dirty = true;
		}
	}


	setKeyAlter (y, value) {
		//console.log("setKeyAlter:", y, value);

		// reset old key alters in one staff
		this.keyAlters.forEach((v, n) => {
			if (v * value < 0)
				this.keyAlters[n] = 0;
		});

		const n = mod7(this.yToNote(y));
		this.keyAlters[n] = value;

		this.logger.append("setKeyAlter", {n, value});

		this.dirty = true;
	}


	setAlter (y, value) {
		//console.log("setAlter:", y, this.yToNote(y), value);
		const n = this.yToNote(y);
		this.alters[n] = value;

		this.logger.append("setAlter", {n, value});

		this.dirty = true;
	}


	setClef (y, value) {
		const clef = -y - value / 2;
		if (clef !== this.clef) {
			this.clef = clef;

			this.dirty = true;
		}
	}


	setOctaveShift (value) {
		if (this.octaveShift !== value) {
			this.octaveShift = value;

			this.dirty = true;
	
			this.logger.append("octaveShift", value);
		}
	}


	setBeatsPerMeasure (value) {
		this.beatsPerMeasure = value;

		// this won't change pitch context
	}


	yToNote (y) {
		console.assert(Number.isInteger(y * 2), "invalid y:", y);

		return (-y - this.octaveShift * 3.5 - this.clef) * 2;
	}


	alterOnNote (note) {
		if (Number.isInteger(this.alters[note]))
			return this.alters[note];

		const gn = mod7(note);
		if (Number.isInteger(this.keyAlters[gn]))
			return this.keyAlters[gn];

		return 0;
	}


	noteToPitch (note) {
		const group = Math.floor(note / 7);
		const gn = mod7(note);

		const pitch = MIDDLE_C + group * 12 + GROUP_N_TO_PITCH[gn] + this.alterOnNote(note);
		if (!Number.isFinite(pitch)) {
			console.warn("invalid pitch value:", pitch, note, group, gn);
			return -1;
		}

		return pitch;
	}


	yToPitch (y) {
		return this.noteToPitch(this.yToNote(y));
	}
};


const parseNotationInMeasure = (context: StaffContext, measure) => {
	//console.log("parseNotationInMeasure:", measure);

	context.resetAlters();

	const notes = [];
	const xs = {};

	for (const token of measure.tokens) {
		if (!token.symbols.size)
			continue;

		if (token.is("ALTER")) {
			//if (token.source && token.source.substr(0, 4) === "\\key")
			if (token.x < measure.headX)
				context.setKeyAlter(token.ry, token.alterValue);
			else
				context.setAlter(token.ry, token.alterValue);
		}
		else if (token.is("CLEF")) 
			context.setClef(token.ry, token.clefValue);

		else if (token.is("OCTAVE")) 
			context.setOctaveShift(token.octaveShiftValue);

		else if (token.is("TIME_SIG")) {
			if (token.ry === 0)
				context.setBeatsPerMeasure(token.timeSignatureValue);
		}
		else if (token.is("NOTEHEAD")) {
			/*// ignore tempo note heads
			if (token.source.substr(0, 6) === "\\tempo")
				continue;*/

			const contextIndex = context.snapshot();

			const note = {
				x: roundNumber(token.logicX, 1e-4) - measure.noteRange.begin,
				rx: token.rx - measure.noteRange.begin,
				y: token.ry,
				pitch: context.yToPitch(token.ry),
				id: token.href,
				tied: token.tied,
				contextIndex,
				type: token.noteType,
			};
			notes.push(note);

			xs[note.rx] = xs[note.rx] || new Set();
			xs[note.rx].add(token.ry);
		}
	}

	const duration = context.beatsPerMeasure * TICKS_PER_BEAT;

	//console.log("notes:", notes);
	notes.forEach(note => {
		// merge first degree side by side notes
		if (xs[note.rx - 1.5] && xs[note.rx - 1.5].has(note.y))
			note.x -= constants.CLOSED_NOTEHEAD_INTERVAL_FIRST_DEG;
		else if (xs[note.rx - 1.25] && xs[note.rx - 1.25].has(note.y))
			note.x -= constants.CLOSED_NOTEHEAD_INTERVAL_FIRST_DEG;

		context.track.appendNote(note.x, {
			pitch: note.pitch,
			id: note.id,
			tied: note.tied,
			contextIndex: note.contextIndex,
			type: note.type,
		});
	});

	context.track.endTime += duration;
};


const parseNotationInStaff = (context : StaffContext, staff) => {
	//console.log("parseNotationInStaff:", staff);
	context.resetKeyAlters();

	if (staff) {
		for (const measure of staff.measures)
			parseNotationInMeasure(context, measure);
	}
};


const parseNotationFromSheetDocument = (document, {logger = new LogRecorder()} = {}) => {
	if (!document.trackCount)
		return null;

	const contexts = Array(document.trackCount).fill(null).map(() => new StaffContext({logger}));

	for (const page of document.pages) {
		logger.append("parsePage", document.pages.indexOf(page));

		for (const row of page.rows) {
			logger.append("parseRow", page.rows.indexOf(row));

			console.assert(row.staves.length === contexts.length, "staves size mismatched:", contexts.length, row.staves.length, row);

			row.staves.forEach((staff, i) => {
				logger.append("parseStaff", i);
				if (contexts[i])
					parseNotationInStaff(contexts[i], staff);
			});
		}
	}

	//console.log("result:", contexts);

	// merge tracks
	contexts.forEach((context, t) => context.track.notes.forEach(note => note.track = t));
	const notes = [].concat(...contexts.map(context => context.track.notes)).sort((n1, n2) => (n1.time - n2.time) + (n1.pitch - n2.pitch) * -1e-3);

	logger.append("notesBeforeClusterize", notes.map(note => _.pick(note, ["time", "pitch"])));

	clusterizeNotes(notes);

	return {
		endTime: contexts[0].track.endTime,
		notes,
		pitchContexts: contexts.map(context => context.track.contexts),
	};
};


const xClusterize = x => Math.tanh((x / 1.5) ** 12);


// get time closed for notes in a chord
const clusterizeNotes = notes => {
	notes.forEach((note, i) => {
		if (i < 1)
			note.deltaTime = 0;
		else {
			const delta = note.time - notes[i - 1].time;
			const noteType = Math.min(note.type, notes[i - 1].type);

			//if (note.track === notes[i - 1].track)
			note.deltaTime = xClusterize(delta * constants.NOTE_TYPE_INTERVAL_FACTORS[noteType]);
			//else
			//	note.deltaTime = delta;
		}
	});

	notes.forEach((note, i) => i > 0 && (note.time = notes[i - 1].time + note.deltaTime * 480));
};


const assignNotationEventsIds = midiNotation => {
	const events = midiNotation.notes.reduce((events, note) => {
		events.push({ticks: note.startTick, subtype: "noteOn", pitch: note.pitch, ids: note.ids});
		events.push({ticks: note.endTick, subtype: "noteOff", pitch: note.pitch, ids: note.ids});

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
				if (event.data.subtype === ne.subtype && event.data.noteNumber === ne.pitch) {
					event.data.ids = ne.ids;
					break;
				}
			}
		}
	}
};


const matchNotations = async (midiNotation, svgNotation) => {
	// map svgNotation without duplicated ones
	const noteMap = {};
	const notePMap = {};
	const svgNotes = svgNotation.notes.reduce((notes, note) => {
		if (note.tied) {
			if (notePMap[note.pitch]) {
				const tieNote = notePMap[note.pitch];
				tieNote.ids = tieNote.ids || [tieNote.id];
				tieNote.ids.push(note.id);
			}
		}
		else {
			const index = `${note.time}-${note.pitch}`;
			if (noteMap[index]) {
				noteMap[index].ids = noteMap[index].ids || [noteMap[index].id];
				noteMap[index].ids.push(note.id);
			}
			else {
				const sn = {start: note.time, pitch: note.pitch, id: note.id, track: note.track, contextIndex: note.contextIndex};
				noteMap[index] = sn;
				notePMap[sn.pitch] = sn;
				notes.push(sn);
			}
		}

		return notes;
	}, []).map((note, index) => ({index, ...note}));

	const criterion = {
		notes: svgNotes,
		pitchMap: null,
	};
	criterion.pitchMap = criterion.notes.reduce((map, note) => {
		map[note.pitch] = map[note.pitch] || [];
		map[note.pitch].push(note);

		return map;
	}, []);

	const sample = {
		notes: midiNotation.notes.map(({startTick, pitch}, index) => ({index, start: startTick * 16, pitch})),
	};

	Matcher.genNotationContext(criterion);
	Matcher.genNotationContext(sample);
	//console.log("criterion:", criterion, sample);

	for (const note of sample.notes)
		Matcher.makeMatchNodes(note, criterion);

	//console.log("before.runNavigation:", performance.now());
	const navigator = await Matcher.runNavigation(criterion, sample);
	//console.log("navigator:", navigator);
	//console.log("after.runNavigation:", performance.now());

	const path = navigator.path();
	//const path = navigator.sample.notes.map(note => note.matches[0] ? note.matches[0].ci : -1);

	//console.log("path:", path);
	//console.log("after.path:", performance.now());

	path.forEach((ci, si) => {
		if (ci >= 0) {
			const cn = criterion.notes[ci];
			const ids = cn.ids || [cn.id];
			midiNotation.notes[si].ids = ids;
			midiNotation.notes[si].staffTrack = cn.track;
			midiNotation.notes[si].contextIndex = cn.contextIndex;
		}
	});
	//console.log("after.path.forEach:", performance.now());

	// assign ids onto MIDI events
	assignNotationEventsIds(midiNotation);

	//console.log("after.ids:", performance.now());
	//console.log("midiNotation:", midiNotation.events);

	return {criterion, sample, path};
};


const assignIds = (midiNotation, noteIds) => {
	noteIds.forEach((ids, i) => {
		const note = midiNotation.notes[i];
		if (note && ids)
			note.ids = ids;
	});

	assignNotationEventsIds(midiNotation);
};


const createPitchContextGroup = (contextGroup: PitchContext[][], midiNotation): PitchContextTable[] =>
	contextGroup.map((contexts, track) => PitchContextTable.createFromNotation(contexts, midiNotation, track));



export {
	parseNotationFromSheetDocument,
	matchNotations,
	assignNotationEventsIds,
	assignIds,
	PitchContext,
	PitchContextTable,
	createPitchContextGroup,
};
