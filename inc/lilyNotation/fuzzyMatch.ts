
// eslint-disable-next-line
import {MusicNotation} from "@k-l-lambda/web-widgets";



interface Note {
	index: number;
	pitch: number;
	softIndex: number;
	baseCsi?: number;
};


const notePitchDistance = (n1: Note, n2: Note): number => {
	let differ = Math.abs(n1.pitch - n2.pitch);
	if (differ > 7)
		differ -= 11.5;

	return differ * 2;
};


const fuzzyMatchNotes = (path: number[], cnotes: Note[], snotes: Note[], pitchTolerance: number, offsetTolerance = 2): {fixed: number, matched: number} => {
	const candidates: {[key: number]: {si: number, distance: number}} = {};

	const matched = snotes.reduce((count, snote) => {
		const pcan = cnotes.filter(cnote => notePitchDistance(cnote, snote) <= pitchTolerance
			&& Math.abs(snote.baseCsi - cnote.softIndex) < offsetTolerance)
			.sort((n1, n2) => Math.abs(snote.baseCsi - n1.softIndex) - Math.abs(snote.baseCsi - n2.softIndex));

		if (pcan.length) {
			const bestDistance = notePitchDistance(pcan[0], snote);
			const last = candidates[pcan[0].index];
			if (!last || bestDistance < last.distance)
				candidates[pcan[0].index] = {si: snote.index, distance: bestDistance};

			++count;
		}

		return count;
	}, 0);

	const fixed = Object.entries(candidates).map(([ci, {si}]) => {
		path[si] = Number(ci);

		return [si, Number(ci)];
	});
	//console.debug("fuzzyMatch.fixed:", fixed.map(pair => pair.join()));

	return {fixed: fixed.length, matched};
};


const fuzzyMatchNotations = (path: number[], criterion: MusicNotation.NotationData, sample: MusicNotation.NotationData) => {
	// unmatch overlapped indices
	const overlapped = new Set();
	path.reduce((set, ci) => {
		if (ci >= 0) {
			if (set.has(ci))
				overlapped.add(ci);
			else
				set.add(ci);
		}

		return set;
	}, new Set());
	//console.debug("overlapped:", overlapped, [...path]);
	path.forEach((ci, si) => {
		if (overlapped.has(ci))
			path[si] = -1;
	});

	// assign base offset on sample notes
	let offset = null;
	for (let i = 0; i < sample.notes.length; ++i) {
		const note = sample.notes[i];
		const ci = path[i];

		if (ci < 0)
			(note as any).baseOffset = offset;
		else
			offset = note.softIndex - criterion.notes[ci].softIndex;
	}
	for (let i = sample.notes.length - 1; i >= 0; --i) {
		const note = sample.notes[i];
		const ci = path[i];

		if (ci < 0) {
			const lastOffset = (note as any).baseOffset;
			(note as any).baseOffset = Number.isFinite(lastOffset) ? (lastOffset + offset) / 2 : offset;
		}
		else
			offset = note.softIndex - criterion.notes[ci].softIndex;
	}

	let pitchTolerance = 0;
	while (true) {
		const cnotes = criterion.notes.filter(note => !path.some(ci => ci === note.index)).map(note => ({index: note.index, pitch: note.pitch, softIndex: note.softIndex}));
		const snotes = sample.notes.filter(note => path[note.index] < 0 && Number.isFinite((note as any).baseOffset))
			.map(note => ({index: note.index, pitch: note.pitch, softIndex: note.softIndex, baseCsi: note.softIndex - (note as any).baseOffset}));

		//console.debug("fuzzyMatch.notes:", cnotes.map(note => note.index), snotes.map(note => note.index));

		if (!cnotes.length || !snotes.length || pitchTolerance > 4)
			break;

		const {fixed, matched} = fuzzyMatchNotes(path, cnotes, snotes, pitchTolerance);
		if (matched)
			console.debug("fuzzyMatch.pass:", `c:${cnotes.length}, s:${snotes.length},`, pitchTolerance, `${fixed}/${matched}`);

		if (fixed >= matched)
			++pitchTolerance;
	}
	//console.debug("fuzzyMatch.path:", path);
};



export {
	fuzzyMatchNotations,
};
