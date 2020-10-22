
import {Writable} from "stream";
import {MIDI} from "@k-l-lambda/web-widgets";

import {EngraverOptions, EngraverResult, postProcessSvg} from "./lilyCommands";



let lilypondEx = null;

const loadAddon = (path: string): boolean => {
	lilypondEx = require(path);

	return !!lilypondEx;
};


const engraveSvg = async (source: string,
	{onProcStart, onMidiRead, onSvgRead, includeFolders = []}: EngraverOptions = {}): Promise<Partial<EngraverResult>> => {
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

	const errorLevel = await engravePromise;

	return {
		logs,
		svgs,
		midi,
		errorLevel,
	};
};


const engraveSvgWithStream = async (source: string,
	output: Writable, {includeFolders = []}: {includeFolders?: string[]} = {},
): Promise<Partial<EngraverResult>> => {
	let logs;
	let midi;

	const errorLevel = await lilypondEx.engrave(source, {
		includeFolders,
		log (message) {
			logs = message;
		},
		onSVG (_, content) {
			const svg = postProcessSvg(content);
			output.write(svg);
			output.write("\n\n");
		},
		onMIDI (_, buffer) {
			midi = MIDI.parseMidiData(buffer);
		},
	});

	return {
		logs,
		midi,
		errorLevel,
	};
};




export {
	loadAddon,
	engraveSvg,
	engraveSvgWithStream,
};
