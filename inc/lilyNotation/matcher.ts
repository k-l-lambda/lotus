
import {MusicNotation, Matcher} from "@k-l-lambda/web-widgets";
// eslint-disable-next-line
import {MIDI} from "@k-l-lambda/web-widgets";

import {WHOLE_DURATION_MAGNITUDE} from "../lilyParser/utils";

// eslint-disable-next-line
import {Notation} from "./notation";



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


const matchWithExactMIDI = async (lilyNotation: Notation, target: MIDI.MidiData): Promise<MatcherResult> => {
	const midiTickFactor = (WHOLE_DURATION_MAGNITUDE / 4) / target.header.ticksPerBeat;

	const noteKey = note => `${note.channel}|${Math.round(note.startTick)}|${note.pitch}`;

	const snoteMap: {[key: string]: MusicNotation.Note} = {};

	const midiNotation = MusicNotation.Notation.parseMidi(target);
	midiNotation.notes.forEach(note => {
		note.startTick *= midiTickFactor;
		snoteMap[noteKey(note)] = note;
	});

	const criterion = lilyNotation.toPerformingNotation();

	const path = Array(midiNotation.notes.length).fill(-1);

	criterion.notes.forEach(note => {
		if (!(note as any).implicitType) {
			const sn = snoteMap[noteKey(note)];
			if (sn)
				path[sn.index] = note.index;
		}
	});

	const matcher = {criterion, sample: midiNotation, path};
	lilyNotation.assignMatcher(matcher);

	return matcher;
};



export {
	matchWithMIDI,
	matchWithExactMIDI,
};
