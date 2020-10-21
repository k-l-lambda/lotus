
import {MIDI} from "@k-l-lambda/web-widgets";

import {EngraverOptions, EngraverResult, postProcessSvg} from "./lilyCommands";



let lilypondEx = null;

const loadAddon = (path: string): boolean => {
	lilypondEx = require(path);

	return !!lilypondEx;
};


const engraveSvg = async (source: string,
	{onProcStart, onMidiRead, onSvgRead, includeFolders = []}: EngraverOptions = {}): Promise<EngraverResult> => {
	if (!lilypondEx)
		throw new Error("Lilypond addon not loaded.");

	let logs;
	const svgs = [];
	let midi;

	const engravePromise = lilypondEx.engrave(source, {
		includeFolders,
		log (message) {
			logs = message;
		},
		onSVG (filename, content) {
			const captures = filename.match(/-(\d+)\.svg$/);
			const index = captures ? Number(captures[1]) - 1 : 0;

			const svg = postProcessSvg(content);
			svgs[index] = svg;

			onSvgRead && onSvgRead(index, svg);
		},
		onMIDI (_, buffer) {
			midi = MIDI.parseMidiData(buffer);

			onMidiRead && onMidiRead(midi);
		},
	});

	await onProcStart && onProcStart();

	const error = await engravePromise;
	console.debug("\nLilypond error level:", error);

	return {
		logs,
		svgs,
		midi,
	};
};



export {
	loadAddon,
	engraveSvg,
};
