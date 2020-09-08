
import {MusicNotation, Matcher} from "@k-l-lambda/web-widgets";
import {MIDI} from "@k-l-lambda/web-widgets";

import {WHOLE_DURATION_MAGNITUDE} from "../lilyParser/utils";
import {Notation} from "./notation";
import ImplicitType from "./implicitType";



export interface MatcherResult {
	criterion: MusicNotation.NotationData,
	sample: MusicNotation.NotationData,
	path: number[],
};


const matchWithMIDI = async (lilyNotation: Notation, target: MIDI.MidiData): Promise<MatcherResult> => {
	const midiTickFactor = (WHOLE_DURATION_MAGNITUDE / 4) / target.header.ticksPerBeat;

	const midiNotation = MusicNotation.Notation.parseMidi(target);

	const criterion = lilyNotation.toPerformingNotation();

	Matcher.genNotationContext(criterion, {softIndexFactor: 1e3});
	Matcher.genNotationContext(midiNotation, {softIndexFactor: midiTickFactor * 1e3});
	//console.debug("notations:", criterion, midiNotation);

	for (const note of midiNotation.notes)
		Matcher.makeMatchNodes(note, criterion);

	const navigator = await Matcher.runNavigation(criterion, midiNotation);
	const path = navigator.path();

	const matcher = {criterion, sample: midiNotation, path};
	lilyNotation.assignMatcher(matcher);

	return matcher;
};


const IMPLICIT_PITCH_BIAS = {
	[ImplicitType.Mordent]: [0, -1, -2],
	[ImplicitType.Prall]: [0, 1, 2],
	[ImplicitType.Turn]: [-2, -1, 0, 1, 2],
	[ImplicitType.Trill]: [0, 1, 2],
};


const matchWithExactMIDI = async (lilyNotation: Notation, target: MIDI.MidiData): Promise<MatcherResult> => {
	const midiTickFactor = (WHOLE_DURATION_MAGNITUDE / 4) / target.header.ticksPerBeat;

	const noteKey = note => `${note.channel}|${Math.round(note.startTick)}|${note.pitch}`;

	const snoteMap: {[key: string]: MusicNotation.Note} = {};

	const midiNotation = MusicNotation.Notation.parseMidi(target);
	midiNotation.ticksPerBeat = WHOLE_DURATION_MAGNITUDE / 4;
	midiNotation.notes.forEach(note => {
		note.startTick *= midiTickFactor;
		note.endTick *= midiTickFactor;
		snoteMap[noteKey(note)] = note;
	});
	midiNotation.events.forEach(event => event.ticks *= midiTickFactor);

	// TODO: scale setTempo in midiNotation

	const criterion = lilyNotation.toPerformingNotation();

	const path = Array(midiNotation.notes.length).fill(-1);

	const restCNotes = [];
	criterion.notes.forEach(note => {
		if (!(note as any).implicitType) {
			const sn = snoteMap[noteKey(note)];
			if (sn) {
				path[sn.index] = note.index;
				delete snoteMap[noteKey(note)];

				return;
			}
		}

		restCNotes.push(note);
	});

	// TODO: fuzzy match rest ordinary notes

	const restSNotes = Object.values(snoteMap);
	restCNotes.forEach(note => {
		if (note.implicitType) {
			const pbs = IMPLICIT_PITCH_BIAS[note.implicitType];
			if (pbs) {
				const matches = restSNotes.filter(sn => {
					const tick = Math.round(sn.startTick);
					const pb = sn.pitch - note.pitch;
					return tick >= note.startTick && tick < note.endTick && pbs.includes(pb);
				});

				matches.forEach(sn => path[sn.index] = note.index);
			}
		}
		else
			console.warn("missed ordinary C note:", note);
	});

	const matcher = {criterion, sample: midiNotation, path};
	lilyNotation.assignMatcher(matcher);

	return matcher;
};



export {
	matchWithMIDI,
	matchWithExactMIDI,
};
