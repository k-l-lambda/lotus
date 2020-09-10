
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


const alignNotationTicks = (source: MusicNotation.Notation, criterion: MusicNotation.Notation, {midiTrackTickBias}: {midiTrackTickBias?: number[]}) => {
	const midiTickFactor = criterion.ticksPerBeat / source.ticksPerBeat;

	source.ticksPerBeat = criterion.ticksPerBeat;
	source.notes.forEach(note => {
		note.startTick *= midiTickFactor;
		note.endTick *= midiTickFactor;

		const bias = midiTrackTickBias && midiTrackTickBias[note.track];
		if (bias) {
			note.startTick += bias;
			note.endTick += bias;
		}
	});

	source.events.forEach(event => {
		event.ticks *= midiTickFactor;

		const bias = midiTrackTickBias && midiTrackTickBias[event.track];
		if (bias)
			event.ticks += bias;
	});
	source.events.sort((e1, e2) => e1.ticks - e2.ticks);
};


const matchWithExactMIDI = async (lilyNotation: Notation, target: MIDI.MidiData): Promise<MatcherResult> => {
	const criterion = lilyNotation.toPerformingNotation();

	const trackTickBiasMap = lilyNotation.trackTickBias;
	const midiTrackTickBias = target.tracks.map(events => {
		const nameEvent = events.find(event => event.subtype === "trackName");
		const name = nameEvent && nameEvent.text;
		if (name)
			return trackTickBiasMap[name] || 0;

		return 0;
	});
	//console.log("midiTrackTickBias:", midiTrackTickBias);

	const midiNotation = MusicNotation.Notation.parseMidi(target);
	alignNotationTicks(midiNotation, criterion, {midiTrackTickBias});

	// 1st pass: ordinary notes exact matching
	const noteKey = note => `${note.channel}|${Math.round(note.startTick)}|${note.pitch}`;

	const snoteMap: {[key: string]: MusicNotation.Note} = {};
	midiNotation.notes.forEach(note => {
		snoteMap[noteKey(note)] = note;
	});

	const path = Array(midiNotation.notes.length).fill(-1);

	const restCNotes = [];
	criterion.notes.forEach(note => {
		if (!(note as any).implicitType) {
			const key = noteKey(note);
			const sn = snoteMap[key];
			if (sn) {
				path[sn.index] = note.index;
				delete snoteMap[key];

				return;
			}
		}

		restCNotes.push(note);
	});

	// 2nd pass: implicit notes matching
	const restCNotes2 = [];
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

				matches.forEach(sn => {
					path[sn.index] = note.index;
					//delete snoteMap[noteKey(sn)];
				});

				return;
			}
		}

		restCNotes2.push(note);
	});

	// 3rd pass: rest fuzzy matching
	const restCNotes3 = [];
	restCNotes2.forEach(note => {
		const sn = restSNotes.find(sn => sn.pitch === note.pitch && Math.abs(sn.startTick - note.startTick) < 4);
		if (sn) {
			path[sn.index] = note.index;
			delete snoteMap[noteKey(sn)];
		}
		else
			restCNotes3.push(note);
	});

	// 4th pass: nearest matching
	const restSNotes3 = Object.values(snoteMap);
	restCNotes3.forEach(note => {
		const sn = restSNotes3.reduce((best, sn) => {
			if (sn.pitch === note.pitch) {
				if (!best || Math.abs(sn.startTick - note.startTick) < Math.abs(best.startTick - note.startTick))
					return sn;
			}

			return best;
		}, null);
		if (sn)
			path[sn.index] = note.index;
	});

	const matcher = {criterion, sample: midiNotation, path};
	lilyNotation.assignMatcher(matcher);

	return matcher;
};



export {
	matchWithMIDI,
	matchWithExactMIDI,
};
