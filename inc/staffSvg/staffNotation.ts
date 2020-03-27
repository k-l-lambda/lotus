
import Matcher from "@k-l-lambda/web-widgets/source/inc/Matcher";



const TICKS_PER_BEAT = 480;

const GROUP_N_TO_PITCH = [0, 2, 4, 5, 7, 9, 11];


const mod7 = x => {
	while (x >= 7)
		x -= 7;
	while (x < 0)
		x += 7;

	return x;
};


class NotationTrack {
	endTime = 0;
	notes = [];


	appendNote (time, data) {
		this.notes.push({
			time: this.endTime + time,
			...data,
		});
	}
};


class StaffContext {
	beatsPerMeasure = 4;
	clef = -3;
	keyAlters = [];
	octaveShift = 0;
	alters = [];
	track = new NotationTrack();


	resetKeyAlters () {
		this.keyAlters = [];
	}


	resetAlters () {
		this.alters = [];
	}


	setKeyAlter (y, value) {
		//console.log("setKeyAlter:", y, value);

		const n = mod7(this.yToNote(y));
		this.keyAlters[n] = value;
	}


	setAlter (y, value) {
		//console.log("setAlter:", y, value);
		this.alters[this.yToNote(y)] = value;
	}


	setClef (y, value) {
		this.clef = -y - value / 2;
	}


	setOctaveShift (value) {
		this.octaveShift = value;
	}


	setBeatsPerMeasure (value) {
		this.beatsPerMeasure = value;
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
		const group = Math.floor(note / 7);
		const gn = mod7(note);

		return (group + 5) * 12 + GROUP_N_TO_PITCH[gn] + this.alterOnNote(note);
	}


	yToPitch (y) {
		return this.noteToPitch(this.yToNote(y));
	}
};


const parseNotationInMeasure = (context : StaffContext, measure) => {
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
			const note = {
				x: token.rx - measure.noteRange.begin,
				y: token.ry,
				pitch: context.yToPitch(token.ry),
				id: token.href,
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


const parseNotationFromSheetDocument = document => {
	const contexts = Array(document.pages[0].rows[0].staves.length).fill(null).map(() => new StaffContext());

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
	};
};


const matchNotations = async (midiNotation, svgNotation) => {
	// map svgNotation without duplicated ones
	const noteMap = {};
	const svgNotes = svgNotation.notes.reduce((notes, note) => {
		const index = `${note.time}-${note.pitch}`;
		if (noteMap[index]) {
			noteMap[index].ids = noteMap[index].ids || [noteMap[index].id];
			noteMap[index].ids.push(note.id);
		}
		else {
			const sn = {start: note.time * 16, pitch: note.pitch, id: note.id};
			noteMap[index] = sn;
			notes.push(sn);
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

	const navigator = await Matcher.runNavigation(criterion, sample);
	const path = navigator.path();
	//console.log("path:", path);

	path.forEach((ci, si) => {
		if (ci >= 0) {
			const cn = criterion.notes[ci];
			const ids = cn.ids || [cn.id];
			midiNotation.notes[si].ids = ids;
		}
	});

	for (const note of midiNotation.notes) {
		if (!note.ids)
			continue;

		const on = midiNotation.events.find(event => event.data.subtype === "noteOn"
			&& event.data.noteNumber === note.pitch
			&& event.ticks === note.startTick);
		if (on)
			on.data.ids = note.ids;

		const off = midiNotation.events.find(event => event.data.subtype === "noteOff"
			&& event.data.noteNumber === note.pitch
			&& event.ticks === note.endTick);
		if (off)
			off.data.ids = note.ids;
	}
	//console.log("midiNotation:", midiNotation);

	return midiNotation;
};



export {
	parseNotationFromSheetDocument,
	matchNotations,
};
