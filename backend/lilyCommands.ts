

import * as fs from "fs";
import * as glob from "glob";
import * as child_process from "child-process-promise";
import {MIDI} from "@k-l-lambda/web-widgets";



const TEMP_DIR = process.env.TEMP_DIR;
const LILYPOND_DIR = process.env.LILYPOND_DIR;


const asyncCall = (func, ...args): Promise<any> => new Promise((resolve, reject) => func(...args, (err, data) => {
	if (err)
		reject(err);
	else
		resolve(data);
}));


const genHashString = (len = 8) => Buffer.from(Math.random().toString()).toString("base64").substr(3, 3 + len);


const initialize = async () => {
	// empty temporary directory
	try {
		await child_process.exec(`rm ${TEMP_DIR}*`);
	}
	catch (_) {
	}
};

initialize();


const postProcessLy = (ly, {pointClick = true, midi = true} = {}) => {
	let result = ly;

	if (pointClick)
		result = result.replace(/\\pointAndClickOff\n/g, "");

	if (midi)
		result = result.replace(/%  \\midi/g, "\\midi");

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


const postProcessSvg = svg => {
	return svg.replace(/textedit:[^"]+:(\d+:\d+:\d+)/g, "textedit:$1");
};


const engraveSvg = async source => {
	const hash = genHashString();
	const sourceFilename = `${TEMP_DIR}engrave-${hash}.ly`;
	//const outputFilename = `./engrave-${hash}`;
	const midiFilename = `${TEMP_DIR}engrave-${hash}.midi`;

	await asyncCall(fs.writeFile, sourceFilename, source);

	const result = await child_process.exec(`cd ${TEMP_DIR} && ${LILYPOND_DIR}lilypond -dbackend=svg .${sourceFilename}`);

	const svgFiles: string[] = await asyncCall(glob, `${TEMP_DIR}engrave-${hash}*.svg`);
	svgFiles.sort();

	const svgs = await Promise.all(svgFiles.map(filename => asyncCall(fs.readFile, filename)));

	let midi = null;
	try {
		await asyncCall(fs.access, midiFilename, fs.constants.F_OK);

		const buffer = await asyncCall(fs.readFile, midiFilename);
		midi = MIDI.parseMidiData(buffer);
	}
	catch (_) {}

	return {
		logs: result.stderr,
		svgs: svgs.map(svg => postProcessSvg(svg.toString())),
		midi,
	};
};



export {
	xml2ly,
	engraveSvg,
};
