
import sha1 from "sha1";

import DictArray from "./DictArray";
// eslint-disable-next-line
import LogRecorder from "./logRecorder";



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
	time?: number;
	startTick: number;
	pitch: number;
	id?: string;
	tied?: boolean;
	contextIndex?: number;
	staffTrack?: number;
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
			__prototype: "PitchContext",
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


	static createFromNotation (contexts: PitchContext[], notes: NotationNote[], track: number) {
		const items = [];

		let index = -1;
		const trackNotes = notes.filter(note => note.staffTrack === track);
		for (const note of trackNotes) {
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
			__prototype: "PitchContextTable",
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


	snapshot (): number {
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
		//if (!Number.isInteger(y * 2))
		//	debugger;

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
			this.logger.append("noteToPitch.invalidPitch", {pitch, note, group, gn});
			console.warn("invalid pitch value:", pitch, note, group, gn);
			return -1;
		}

		return pitch;
	}


	yToPitch (y) {
		return this.noteToPitch(this.yToNote(y));
	}
};



export {
	PitchContext,
	PitchContextTable,
	NotationTrack,
	StaffContext,
};
