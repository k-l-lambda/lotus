
import {MusicNotation, Matcher} from "@k-l-lambda/web-widgets";
// eslint-disable-next-line
import {MIDI} from "@k-l-lambda/web-widgets";

import {WHOLE_DURATION_MAGNITUDE} from "../lilyParser/utils";

import {assignNotationEventsIds} from "./notation";
// eslint-disable-next-line
import {Notation} from "./notation";



interface MatcherResult {
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

	const notes = lilyNotation.notes.filter(note => !note.rest && !note.tied && !note.overlapped).map(note => ({
		channel: note.channel,
		start: note.start,
		pitch: note.pitch,
		duration: note.duration,
		velocity: note.velocity || 127,
		ids: [note.id],
		staffTrack: note.staffTrack,
		contextIndex: note.contextIndex,
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
	const trimmedNotes = Object.values(noteMap);

	const criterion = new MusicNotation.Notation({
		meta: {},
		tempos: [],
		channels: [trimmedNotes],
		endTime: notes[notes.length - 1].start + notes[notes.length - 1].duration,
	});

	Matcher.genNotationContext(criterion, {softIndexFactor: 1e3});
	Matcher.genNotationContext(midiNotation, {softIndexFactor: midiTickFactor * 1e3});
	//console.debug("notations:", criterion, midiNotation);

	for (const note of midiNotation.notes)
		Matcher.makeMatchNodes(note, criterion);

	const navigator = await Matcher.runNavigation(criterion, midiNotation);
	const path = navigator.path();

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
	assignNotationEventsIds(midiNotation);

	return {criterion, sample: midiNotation, path};
};



export {
	matchWithMIDI,
};
