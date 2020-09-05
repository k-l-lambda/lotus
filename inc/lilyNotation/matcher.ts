
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

	/*// scale pitch context group
	lilyNotation.pitchContextGroup.forEach(table => table.items.forEach(item => {
		item.tick /= midiTickFactor;
		item.endTick /= midiTickFactor;
	}));*/

	const midiNotation = MusicNotation.Notation.parseMidi(target);

	const criterion = lilyNotation.toPerformingNotation({withEvents: false});

	Matcher.genNotationContext(criterion, {softIndexFactor: 1e3});
	Matcher.genNotationContext(midiNotation, {softIndexFactor: midiTickFactor * 1e3});
	//console.debug("notations:", criterion, midiNotation);

	for (const note of midiNotation.notes)
		Matcher.makeMatchNodes(note, criterion);

	const navigator = await Matcher.runNavigation(criterion, midiNotation);
	const path = navigator.path();

	/*// copy linking data from criterion to midiNotation
	path.forEach((ci, si) => {
		if (ci >= 0) {
			const cn = criterion.notes[ci] as any;
			const ids = cn.ids || [cn.id];

			const note = midiNotation.notes[si] as any;
			note.ids = ids;
			note.staffTrack = cn.staffTrack;
			note.contextIndex = cn.contextIndex;
		}
	});

	// assign ids onto MIDI events
	assignNotationEventsIds(midiNotation);*/

	const matcher = {criterion, sample: midiNotation, path};
	lilyNotation.replaceMatchedNotes(matcher);

	return matcher;
};



export {
	matchWithMIDI,
};
