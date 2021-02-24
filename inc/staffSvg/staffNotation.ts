
import _ from "lodash";
import {Matcher} from "@k-l-lambda/web-widgets";
// eslint-disable-next-line
import {MusicNotation} from "@k-l-lambda/web-widgets";

import LogRecorder from "../logRecorder";
import {roundNumber, constants} from "./utils";
import {fuzzyMatchNotations, assignNotationEventsIds} from "../lilyNotation";
import {StaffContext} from "../pitchContext";
// eslint-disable-next-line
import {PitchContext} from "../pitchContext";



const TICKS_PER_BEAT = 480;


const parseNotationInMeasure = (context: StaffContext, measure) => {
	//console.log("parseNotationInMeasure:", measure);

	context.resetAlters();

	const notes = [];
	//const xs = {};
	const pitchNotes: {[key: number]: any[]} = {};

	let keyAltered = false;

	for (const token of measure.tokens) {
		if (!token.symbols.size)
			continue;

		if (token.is("ALTER")) {
			// ignore invalid alters
			if (Number.isInteger(token.ry * 2)) {
				if (token.is("KEY") /*|| token.logicX < measure.headX*/) {
					if (!keyAltered) {
						context.resetKeyAlters();
						keyAltered = true;
					}
					context.setKeyAlter(token.ry, token.alterValue);
				}
				// alter with href may be chordmode element
				else if (!token.href)
					context.setAlter(token.ry, token.alterValue);
			}
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
				stemUp: token.stemUp,
			};
			notes.push(note);

			//xs[note.rx] = xs[note.rx] || new Set();
			//xs[note.rx].add(token.ry);

			pitchNotes[note.pitch] = pitchNotes[note.pitch] || [];
			pitchNotes[note.pitch].push(note);
		}
	}

	// merge first degree side by side notes
	Object.values(pitchNotes).forEach(notes => {
		//notes.length > 1 && console.log("notes:", notes);
		for (let i = 1; i < notes.length; ++i) {
			const note = notes[i];
			const lastNote = notes[i - 1];
			if (note.rx - lastNote.rx <= 1.5 && note.stemUp !== lastNote.stemUp)
				note.tied = true;
		}
	});

	const duration = context.beatsPerMeasure * TICKS_PER_BEAT;

	//console.log("notes:", notes);
	notes.forEach(note => {
		/*// merge first degree side by side notes
		if (xs[note.rx - 1.5] && xs[note.rx - 1.5].has(note.y))
			note.x -= constants.CLOSED_NOTEHEAD_INTERVAL_FIRST_DEG;
		else if (xs[note.rx - 1.25] && xs[note.rx - 1.25].has(note.y))
			note.x -= constants.CLOSED_NOTEHEAD_INTERVAL_FIRST_DEG;*/

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


interface SheetNotation extends MusicNotation.NotationData {
	pitchContexts: PitchContext[][];
};


const parseNotationFromSheetDocument = (document, {logger = new LogRecorder()} = {}): SheetNotation => {
	if (!document.trackCount)
		return null;

	const contexts = Array(document.trackCount).fill(null).map(() => new StaffContext({logger}));

	for (const page of document.pages) {
		logger.append("parsePage", document.pages.indexOf(page));

		for (const system of page.systems) {
			logger.append("parseSystem", page.systems.indexOf(system));

			console.assert(system.staves.length === contexts.length, "staves size mismatched:", contexts.length, system.staves.length);
			if (system.staves.length !== contexts.length)
				logger.append("mismatchedStaves", {contextLen: contexts.length, stavesLen: system.staves.length, system});

			system.staves.forEach((staff, i) => {
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


const assignTickByLocationTable = (notation: SheetNotation, locationTickTable: {[key: string]: number}) => {
	notation.notes.forEach((note: any) => {
		const location = note.id && note.id.match(/^\d+:\d+/)[0];
		if (locationTickTable[location] === undefined) {
			if (note.id) {
				const [line, column] = note.id.match(/\d+/g).map(Number);
				for (let c = column - 1; c >= 0; --c) {
					const loc = `${line}:${c}`;
					if (locationTickTable[loc]) {
						note.time = locationTickTable[loc];
						return;
					}
				}
			}

			console.warn("[assignTickByLocationTable]	location not found in table:", location);
			return;
		}

		note.time = locationTickTable[location];
	});
};


const xClusterize = x => Math.tanh((x / 1.2) ** 12);

const CLUSTERIZE_WIDTH_FACTORS = [1, 1, .5, .5];


// get time closed for notes in a chord
const clusterizeNotes = notes => {
	notes.forEach((note, i) => {
		if (i < 1)
			note.deltaTime = 0;
		else {
			const delta = note.time - notes[i - 1].time;
			const noteType = Math.min(note.type, notes[i - 1].type);

			note.deltaTime = xClusterize(delta / (constants.NOTE_TYPE_WIDTHS[noteType] * CLUSTERIZE_WIDTH_FACTORS[noteType]));
		}
	});

	notes.forEach((note, i) => i > 0 && (note.time = notes[i - 1].time + note.deltaTime * 480));
};


const matchNotations = async (midiNotation, svgNotation, {enableFuzzy = true} = {}) => {
	console.assert(midiNotation, "midiNotation is null.");
	console.assert(svgNotation, "svgNotation is null.");

	const TIME_FACTOR = 4;

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
				const sn = {start: note.time * TIME_FACTOR, pitch: note.pitch, id: note.id, track: note.track, contextIndex: note.contextIndex};
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
		notes: midiNotation.notes.map(({startTick, pitch}, index) => ({index, start: startTick * TIME_FACTOR, pitch})),
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

	if (enableFuzzy)
		fuzzyMatchNotations(path, criterion, sample);

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


const assignIds = (midiNotation: MusicNotation.NotationData, noteIds: string[][]) => {
	noteIds.forEach((ids, i) => {
		const note = midiNotation.notes[i];
		if (note && ids)
			note.ids = ids;
	});

	assignNotationEventsIds(midiNotation);
};



export {
	parseNotationFromSheetDocument,
	assignTickByLocationTable,
	matchNotations,
	assignIds,
	SheetNotation,
};
