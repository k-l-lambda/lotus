

import fs from "fs";
import path from "path";
import child_process from "child-process-promise";
import {MIDI} from "@k-l-lambda/web-widgets";
import {Writable} from "stream";

import asyncCall from "../inc/asyncCall";
import {SingleLock} from "../inc/mutex";
import {preprocessXml} from "./xmlTools";
import * as lilyAddon from "./lilyAddon";



let MUSICXML2LY_PATH;
let MIDI2LY_PATH;
let LILYPOND_PATH;


let env;
const setEnvironment = e => {
	env = e;

	MUSICXML2LY_PATH = filePathResolve(env.LILYPOND_DIR, "musicxml2ly");
	MIDI2LY_PATH = filePathResolve(env.LILYPOND_DIR, "midi2ly");
	LILYPOND_PATH = filePathResolve(env.LILYPOND_DIR, "lilypond");

	emptyCache();

	if (env.LILYPOND_ADDON)
		lilyAddon.loadAddon(env.LILYPOND_ADDON);
};


const _WINDOWS = process.platform === "win32";


const genHashString = (len = 8) => Buffer.from(Math.random().toString()).toString("base64").substr(3, 3 + len);


const filePathResolve = (...parts: string[]): string => {
	const result = path.join(...parts);
	return _WINDOWS ? `"${result}"` : result;
};


const emptyCache = async () => {
	// empty temporary directory
	try {
		if (env.TEMP_DIR) {
			if (_WINDOWS)
				await child_process.exec(`del /q "${env.TEMP_DIR}*"`);
			else
				await child_process.exec(`rm ${env.TEMP_DIR}*`);
			console.log("Temporary directory clear.");
		}
	}
	catch (err) {
		if (_WINDOWS)
			console.log("emptyCache error:", err);
	}
};


export interface LilyProcessOptions {
	// xml
	language?: string;
	removeMeasureImplicit?: boolean;
	replaceEncoding?: boolean;
	removeNullDynamics?: boolean;
	fixHeadMarkup?: boolean;
	fixBackSlashes?: boolean;
	roundTempo?: boolean;
	escapedWordsDoubleQuotation?: boolean;
	removeTrivialRests?: boolean;
	removeBadMetronome?: boolean;
	removeInvalidHarmonies?: boolean;
	removeAllHarmonies?: boolean;
	fixChordVoice?: boolean;
	fixBarlines?: boolean;
	removeInvalidClef?: boolean;

	// lilypond
	pointClick?: boolean;
	midi?: boolean;
	removeBreak?: boolean;
	removePageBreak?: boolean;
	removeInstrumentName?: boolean;
	removeTempo?: boolean;
	tupletReplace?: boolean;
};




const postProcessLy = (ly: string, {
	pointClick = true,
	midi = true,
	removeBreak = false,
	removePageBreak = false,
	removeInstrumentName = false,
	removeTempo = false,
	tupletReplace = false,
} = {}): string => {
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


const xml2ly = async (xml: string, {language = "english", ...options}: LilyProcessOptions): Promise<string> => {
	xml = preprocessXml(xml, options);
	//console.log("xml:", options, xml.substr(0, 100));

	const hash = genHashString();
	const xmlFileName = `${env.TEMP_DIR}xml2ly-${hash}.xml`;
	await asyncCall(fs.writeFile, xmlFileName, xml);

	const lyFileName = `${env.TEMP_DIR}xml2ly-${hash}.ly`;

	if (env.MUSICXML2LY_BY_PYTHON) {
		await child_process.spawn(path.resolve(env.LILYPOND_DIR, "python"), [
			path.resolve(env.LILYPOND_DIR, "musicxml2ly.py"), xmlFileName, "-o", lyFileName,
			...(language ? ["-l", language] : []),
		]);
	}
	else
		await child_process.exec(`${MUSICXML2LY_PATH} ${xmlFileName} -o ${lyFileName} ${language ? "-l " + language : ""}`, {maxBuffer: 0x80000});
	//console.log("musicxml2ly:", result.stdout, result.stderr);

	const ly = await asyncCall(fs.readFile, lyFileName);

	return postProcessLy(ly.toString(), options);
};


const midi2ly = async (midi, options: LilyProcessOptions): Promise<string> => {
	const hash = genHashString();
	//const midiFileName = `${env.TEMP_DIR}midi2ly-${hash}.midi`;
	//await asyncCall(fs.writeFile, midiFileName, midi);

	const lyFileName = `${env.TEMP_DIR}midi2ly-${hash}-midi.ly`;

	let result;
	if (env.MUSICXML2LY_BY_PYTHON) {
		result = await child_process.spawn(path.resolve(env.LILYPOND_DIR, "python"),
			[path.resolve(env.LILYPOND_DIR, "midi2ly.py"), midi.path, "-o", lyFileName]);
	}
	else
		result = await child_process.exec(`${MIDI2LY_PATH} ${midi.path} -o ${lyFileName}`);
	console.log("midi2ly:", result.stdout, result.stderr);

	const ly = await asyncCall(fs.readFile, lyFileName);

	return postProcessLy(ly.toString(), options);
};


const postProcessSvg = (svg: string): string => {
	return svg.replace(/textedit:[^"]+:(\d+:\d+:\d+)/g, "textedit:$1");
};


//const nameNumber = name => Number(name.match(/-(\d+)\./)[1]);


// lilypond command line output file pattern
const FILE_BORN_OUPUT_PATTERN = /output\sto\s`(.+)'/;


export interface EngraverOptions {
	onProcStart?: () => void|Promise<void>;
	onMidiRead?: (content: MIDI.MidiData, options?: {filePath: string}) => void|Promise<void>;
	onSvgRead?: (index: number, content: string, options?: {filePath: string}) => void|Promise<void>;
	includeFolders?: string[];	// include folder path should be relative to TEMP_DIR
};

export interface EngraverResult {
	logs: string;
	svgs: string[];
	midi: MIDI.MidiData;
};


const engraveSvgCli = async (source: string,
	{onProcStart, onMidiRead, onSvgRead, includeFolders = []}: EngraverOptions = {},
): Promise<EngraverResult> => {
	const hash = genHashString();
	const sourceFilename = `${env.TEMP_DIR}engrave-${hash}.ly`;

	await asyncCall(fs.writeFile, sourceFilename, source);
	//console.log("ly source written:", sourceFilename);

	let midi = null;
	const svgs = [];

	const fileReady = new SingleLock<string>();

	const loadFile = async filename => {
		//console.log("loadFile:", filename);

		// wait for file writing finished
		//await new Promise(resolve => setTimeout(resolve, 100));

		const captures = filename.match(/\.(\w+)$/);
		if (!captures) {
			console.warn("invalid filename:", filename);
			return;
		}
		const [_, ext] = captures;

		const filePath = path.resolve(env.TEMP_DIR, filename);
		//console.log("file output:", filePath, ext);

		switch (ext) {
		case env.MIDI_FILE_EXTEND: {
			// wait extra time for MIDI file
			//await fileReady.lock();
			await new Promise(resolve => setTimeout(resolve, 100));

			const buffer = await asyncCall(fs.readFile, filePath);
			if (!buffer.length)
				console.warn("empty MIDI buffer:", filename);

			midi = MIDI.parseMidiData(buffer);

			await onMidiRead && onMidiRead(midi, {filePath});
		}

			break;
		case "svg": {
			// eslint-disable-next-line
			const captures = filename.match(/(\d+)\.svg$/);
			const index = captures ? Number(captures[1]) - 1 : 0;

			const buffer = await asyncCall(fs.readFile, filePath);
			if (!buffer.length)
				console.warn("empty SVG buffer:", filename);

			const svg = postProcessSvg(buffer.toString());
			svgs[index] = svg;

			//console.log("svg load:", filePath);
			await onSvgRead && onSvgRead(index, svg, {filePath});
		}

			break;
		}
	};

	const loadProcs: Promise<void>[] = [];

	const checkFile = async (line: string) => {
		fileReady.release(line);

		// skip error messages in command line output
		if (FILE_BORN_OUPUT_PATTERN.test(line)) {
			let newLine = await fileReady.lock();
			while (/error|warning/.test(newLine))
				newLine = await fileReady.lock();

			let captures;
			const exp = new RegExp(FILE_BORN_OUPUT_PATTERN.source, "g");
			while (captures = exp.exec(line))
				loadProcs.push(loadFile(captures[1]));
		}
	};

	const includeParameters = includeFolders.map(folder => `--include=${folder}`).join(" ");

	const proc: any = child_process.exec(`${LILYPOND_PATH} -dbackend=svg -o ${env.TEMP_DIR} ${includeParameters} ${sourceFilename}`,
		{maxBuffer: 0x100000});
	//const proc = child_process.spawn(LILYPOND_PATH, ["-dbackend=svg", `-o ${env.TEMP_DIR}`, sourceFilename]);
	proc.childProcess.stdout.on("data", checkFile);
	proc.childProcess.stderr.on("data", checkFile);

	const startPromise = onProcStart && onProcStart();
	if (startPromise)
		loadProcs.push(startPromise);

	const result = await proc;

	fileReady.release();

	await Promise.all(loadProcs);

	//console.log("svgs:", svgs.length);

	const validCount = svgs.filter(svg => svg).length;
	if (validCount < svgs.length)
		console.warn("svg loading incompleted: ", validCount, svgs.length);

	return {
		logs: result.stderr,
		svgs,
		midi,
	};
};


const engraveSvgWithStream = async (source: string, output: Writable, {includeFolders = []}: {includeFolders?: string[]} = {}) => {
	const hash = genHashString();
	const sourceFilename = `${env.TEMP_DIR}engrave-${hash}.ly`;

	await asyncCall(fs.writeFile, sourceFilename, source);

	const writing = new SingleLock();
	const fileReady = new SingleLock();

	const loadFile = async line => {
		const [_, filename] = line.match(FILE_BORN_OUPUT_PATTERN);
		const [__, ext] = filename.match(/\.(\w+)$/);

		switch (ext) {
		case "svg": {
			await fileReady.lock();
			await writing.wait();
	
			writing.lock();

			const filePath = path.resolve(env.TEMP_DIR, filename);
			const fileStream = fs.createReadStream(filePath);
			fileStream.pipe(output, {end: false});

			fileStream.on("close", () => output.write("\n\n"));

			writing.release();
		}

			break;
		}
	};

	const checkFile = line => {
		fileReady.release();

		if (FILE_BORN_OUPUT_PATTERN.test(line))
			loadFile(line);
	};

	const includeParameters = includeFolders.map(folder => `--include=${folder}`).join(" ");

	const proc: any = child_process.exec(`${LILYPOND_PATH} -dbackend=svg -o ${env.TEMP_DIR} ${includeParameters} ${sourceFilename}`);
	proc.childProcess.stdout.on("data", checkFile);
	proc.childProcess.stderr.on("data", checkFile);

	proc.then(() => fileReady.release());

	return proc;
};


const engraveScm = async (source: string, {onProcStart, includeFolders = []}: {
	onProcStart?: () => void|Promise<void>,
	includeFolders?: string[],	// include folder path should be relative to TEMP_DIR
} = {}): Promise<{
	logs: string,
	scm: string,
}> => {
	const hash = genHashString();
	const sourceFilename = `${env.TEMP_DIR}engrave-${hash}.ly`;
	const targetFilename = `${env.TEMP_DIR}engrave-${hash}.scm`;

	await fs.promises.writeFile(sourceFilename, source);
	//console.log("ly source written:", sourceFilename);

	const includeParameters = includeFolders.map(folder => `--include=${folder}`).join(" ");

	const proc = child_process.exec(`${LILYPOND_PATH} -dbackend=scm -o ${env.TEMP_DIR} ${includeParameters} ${sourceFilename}`,
		{maxBuffer: 0x100000});

	await onProcStart && onProcStart();

	const result = await proc;

	const scmBuffer = await fs.promises.readFile(targetFilename);

	return {
		logs: result.stderr,
		scm: scmBuffer.toString(),
	};
};


const engraveSvg = async (source: string, options: EngraverOptions = {}): Promise<EngraverResult> =>
	(env.LILYPOND_ADDON ? lilyAddon.engraveSvg : engraveSvgCli)(source, options);



export {
	xml2ly,
	midi2ly,
	engraveSvg,
	engraveSvgCli,
	engraveSvgWithStream,
	engraveScm,
	setEnvironment,
	emptyCache,
	postProcessSvg,
};
