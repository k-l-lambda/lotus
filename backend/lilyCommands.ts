

import fs from "fs";
import glob from "glob";
import child_process from "child-process-promise";
import {MIDI} from "@k-l-lambda/web-widgets";

import asyncCall from "../inc/asyncCall";



const TEMP_DIR = process.env.TEMP_DIR;
const LILYPOND_DIR = process.env.LILYPOND_DIR;
const MIDI_FILE_EXTEND = process.env.MIDI_FILE_EXTEND;


const genHashString = (len = 8) => Buffer.from(Math.random().toString()).toString("base64").substr(3, 3 + len);


const initialize = async () => {
	// empty temporary directory
	try {
		await child_process.exec(`rm ${TEMP_DIR}*`);
		console.log("Temporary directory clear.");
	}
	catch (_) {
	}
};

initialize();


const postProcessLy = (ly, {
	pointClick = true,
	midi = true,
	removeBreak = false,
	removePageBreak = false,
	removeInstrumentName = false,
	removeTempo = false,
	tupletReplace = false,
} = {}) => {
	let result = ly;

	if (pointClick)
		result = result.replace(/\\pointAndClickOff\n/g, "");

	if (midi)
		result = result.replace(/%  \\midi/g, "\\midi");

	if (removeBreak)
		result = result.replace(/\s\\break\s/g, " ");

	if (removePageBreak)
		result = result.replace(/\s\\pageBreak\s/g, " ");

	if (removeInstrumentName)
		result = result.replace(/\\set Staff\.instrumentName/g, "% \\set Staff.instrumentName");

	if (removeTempo)
		result = result.replace(/\\tempo /g, "% \\tempo ");

	if (tupletReplace) {
		result = result
			.replace(/4\*128\/384/g, "8*2/3")
			.replace(/4\*64\/384/g, "16*2/3");
	}

	return result;
};


const xml2ly = async (xml, options) => {
	const hash = genHashString();
	const xmlFileName = `${TEMP_DIR}xml2ly-${hash}.xml`;
	await asyncCall(fs.writeFile, xmlFileName, xml);

	const lyFileName = `${TEMP_DIR}xml2ly-${hash}.ly`;

	await child_process.exec(`${LILYPOND_DIR}musicxml2ly ${xmlFileName} -o ${lyFileName}`);
	//console.log("musicxml2ly:", result.stdout, result.stderr);

	const ly = await asyncCall(fs.readFile, lyFileName);

	return postProcessLy(ly.toString(), options);
};


const midi2ly = async (midi, options) => {
	const hash = genHashString();
	//const midiFileName = `${TEMP_DIR}midi2ly-${hash}.midi`;
	//await asyncCall(fs.writeFile, midiFileName, midi);

	const lyFileName = `${TEMP_DIR}midi2ly-${hash}-midi.ly`;

	const result = await child_process.exec(`${LILYPOND_DIR}midi2ly ${midi.path} -o ${lyFileName}`);
	console.log("midi2ly:", result.stdout, result.stderr);

	const ly = await asyncCall(fs.readFile, lyFileName);

	return postProcessLy(ly.toString(), options);
};


const postProcessSvg = svg => {
	return svg.replace(/textedit:[^"]+:(\d+:\d+:\d+)/g, "textedit:$1");
};


const nameNumber = name => Number(name.match(/-(\d+)\./)[1]);


const engraveSvg = async source => {
	const hash = genHashString();
	const sourceFilename = `${TEMP_DIR}engrave-${hash}.ly`;
	//const outputFilename = `./engrave-${hash}`;
	const midiFilename = `${TEMP_DIR}engrave-${hash}.${MIDI_FILE_EXTEND}`;

	await asyncCall(fs.writeFile, sourceFilename, source);
	//console.log("ly source written:", sourceFilename);

	const result = await child_process.exec(`cd ${TEMP_DIR} && ${LILYPOND_DIR}lilypond -dbackend=svg .${sourceFilename}`);

	const svgFiles: string[] = await asyncCall(glob, `${TEMP_DIR}engrave-${hash}*.svg`);
	svgFiles.sort((n1, n2) => nameNumber(n1) - nameNumber(n2));
	//console.log("svgFiles:", svgFiles);

	const svgs = await Promise.all(svgFiles.map(filename => asyncCall(fs.readFile, filename)));

	let midi = null;
	try {
		await asyncCall(fs.access, midiFilename, fs.constants.F_OK);

		const buffer = await asyncCall(fs.readFile, midiFilename);
		midi = MIDI.parseMidiData(buffer);
	}
	catch (err) {
		console.log("[engraveSvg]	midi file reading failed:", midiFilename, err);
	}

	return {
		logs: result.stderr,
		svgs: svgs.map(svg => postProcessSvg(svg.toString())),
		midi,
	};
};



export {
	xml2ly,
	midi2ly,
	engraveSvg,
};
