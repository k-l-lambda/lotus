
import sha1 from "sha1";
import {Matcher} from "@k-l-lambda/web-widgets";

import LogRecorder from "../logRecorder";



const TICKS_PER_BEAT = 480;

const GROUP_N_TO_PITCH = [0, 2, 4, 5, 7, 9, 11];


const mod7 = x => {
	while (x >= 7)
		x -= 7;
	while (x < 0)
		x += 7;

	return x;
};


interface NotationNote {
	track?: number;
	time: number;
	pitch: number;
	id: number;
	tied: boolean;
	contextIndex: number;
};


class PitchContext {
	clef = -3;
	keyAlters = [];
	octaveShift = 0;
	alters = [];


	constructor (data) {
		Object.assign(this, data);
	}


	pitchToY (pitch: number): number {
		// TODO:
	}


	get hash () {
		return sha1(JSON.stringify(this));
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
	keyAlters = [];
	octaveShift = 0;
	alters = [];
	track = new NotationTrack();

	dirty = true;


	constructor ({logger}) {
		this.logger = logger;
	}


	snapshot () {
		if (this.dirty) {
			const context = new PitchContext({
				clef: this.clef,
				keyAlters: [...this.keyAlters],
				octaveShift: this.octaveShift,
				alters: [...this.alters],
			});
			if (!this.track.lastPitchContext || context.hash !== this.track.lastPitchContext.hash)
				this.track.contexts.push(context);

			this.dirty = false;
		}

		return this.track.contexts.length - 1;
	}


	resetKeyAlters () {
		if (this.keyAlters.length) {
			this.keyAlters = [];

			this.dirty = true;
		}
	}


	resetAlters () {
		if (this.alters.length) {
			this.alters = [];

			this.dirty = true;
		}
	}


	setKeyAlter (y, value) {
		//console.log("setKeyAlter:", y, value);

		const n = mod7(this.yToNote(y));
		this.keyAlters[n] = value;

		this.dirty = true;
	}


	setAlter (y, value) {
		//console.log("setAlter:", y, value);
		this.alters[this.yToNote(y)] = value;

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
		return (-y - this.clef) * 2;
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
		const group = Math.floor(note / 7) - this.octaveShift;
		const gn = mod7(note);

		return (group + 5) * 12 + GROUP_N_TO_PITCH[gn] + this.alterOnNote(note);
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
			const contextIndex = context.snapshot();

			const note = {
				x: token.rx - measure.noteRange.begin,
				y: token.ry,
				pitch: context.yToPitch(token.ry),
				id: token.href,
				tied: token.tied,
				contextIndex,
			};
			notes.push(note);

			xs[note.x] = xs[note.x] || new Set();
			xs[note.x].add(token.ry);
		}
	}

	const duration = context.beatsPerMeasure * TICKS_PER_BEAT;

	//console.log("notes:", notes);
	notes.forEach(note => {
		if (xs[note.x - 1.5] && xs[note.x - 1.5].has(note.y))
			note.x -= 1.5;
		else if (xs[note.x - 1.25] && xs[note.x - 1.25].has(note.y))
			note.x -= 1.25;
		else if (xs[note.x + 1.25] && xs[note.x + 1.25].has(note.y - 0.5))
			note.x += 1.25;
		else if (xs[note.x - 0.5])
			note.x -= 0.5;
		else if (xs[note.x - 0.25])
			note.x -= 0.25;

		context.track.appendNote(duration * note.x / (measure.noteRange.end - measure.noteRange.begin), {
			pitch: note.pitch,
			id: note.id,
			tied: note.tied,
			contextIndex: note.contextIndex,
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
	if (!document.pages[0].rows[0].staves.length)
		return null;

	const contexts = Array(document.pages[0].rows[0].staves.length).fill(null).map(() => new StaffContext({logger}));

	for (const page of document.pages) {
		for (const row of page.rows) {
			console.assert(row.staves.length === contexts.length, "staves size mismatched:", contexts.length, row.staves.length, row);

			row.staves.forEach((staff, i) => contexts[i] && parseNotationInStaff(contexts[i], staff));
		}
	}

	//console.log("result:", contexts);

	// merge tracks
	contexts.forEach((context, t) => context.track.notes.forEach(note => note.track = t));

	const notes = [].concat(...contexts.map(context => context.track.notes)).sort((n1, n2) => n1.time - n2.time);

	return {
		endTime: contexts[0].track.endTime,
		notes,
		pitchContexts: contexts.map(context => context.track.contexts),
	};
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
				const sn = {start: note.time * 16, pitch: note.pitch, id: note.id};
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
	//console.log("after.runNavigation:", performance.now());
	const path = navigator.path();
	//console.log("path:", path);
	//console.log("after.path:", performance.now());

	path.forEach((ci, si) => {
		if (ci >= 0) {
			const cn = criterion.notes[ci];
			const ids = cn.ids || [cn.id];
			midiNotation.notes[si].ids = ids;
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

	return {noteIds};
};



export {
	parseNotationFromSheetDocument,
	matchNotations,
	assignIds,
};
