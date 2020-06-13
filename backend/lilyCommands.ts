

import fs from "fs";
import path from "path";
import child_process from "child-process-promise";
import {DOMParser, XMLSerializer} from "xmldom";
import {MIDI} from "@k-l-lambda/web-widgets";

import asyncCall from "../inc/asyncCall";



let env = process.env;
const setEnvironment = e => {
	env = e;
	initialize();
};


const genHashString = (len = 8) => Buffer.from(Math.random().toString()).toString("base64").substr(3, 3 + len);


const initialize = async () => {
	// empty temporary directory
	try {
		if (env.TEMP_DIR) {
			await child_process.exec(`rm ${env.TEMP_DIR}*`);
			console.log("Temporary directory clear.");
		}
	}
	catch (_) {
	}
};

initialize();


interface LilyProcessOptions {
	// xml
	removeMeasureImplicit?: boolean;
	replaceEncoding?: boolean;

	// lilypond
	pointClick?: boolean;
	midi?: boolean;
	removeBreak?: boolean;
	removePageBreak?: boolean;
	removeInstrumentName?: boolean;
	removeTempo?: boolean;
	tupletReplace?: boolean;
};


const traverse = (node, handle) => {
	handle(node);

	if (node.childNodes) {
		for (let i = 0; i < node.childNodes.length; ++i)
			traverse(node.childNodes[i], handle);
	}
};


const preprocessXml = (xml, {
	removeMeasureImplicit = true,
	replaceEncoding = true,
} = {}): string => {
	if (!removeMeasureImplicit && !replaceEncoding)
		return xml;

	const dom = new DOMParser().parseFromString(xml, "text/xml");

	if (replaceEncoding) {
		const headNode = Array.prototype.find.call(dom.childNodes, node => node.tagName === "xml");
		if (headNode)
			headNode.data = headNode.data.replace(/UTF-16/, "UTF-8");
	}

	if (removeMeasureImplicit) {
		traverse(dom, node => {
			if (node.tagName === "measure")
				node.removeAttribute("implicit");
		});
	}

	//console.log("dom:", dom);

	return new XMLSerializer().serializeToString(dom);
};


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


const xml2ly = async (xml: string | Buffer, options: LilyProcessOptions): Promise<string> => {
	xml = preprocessXml(xml, options);
	//console.log("xml:", options, xml.substr(0, 100));

	const hash = genHashString();
	const xmlFileName = `${env.TEMP_DIR}xml2ly-${hash}.xml`;
	await asyncCall(fs.writeFile, xmlFileName, xml);

	const lyFileName = `${env.TEMP_DIR}xml2ly-${hash}.ly`;

	await child_process.exec(`${env.LILYPOND_DIR}musicxml2ly ${xmlFileName} -o ${lyFileName}`);
	//console.log("musicxml2ly:", result.stdout, result.stderr);

	const ly = await asyncCall(fs.readFile, lyFileName);

	return postProcessLy(ly.toString(), options);
};


const midi2ly = async (midi, options: LilyProcessOptions) => {
	const hash = genHashString();
	//const midiFileName = `${env.TEMP_DIR}midi2ly-${hash}.midi`;
	//await asyncCall(fs.writeFile, midiFileName, midi);

	const lyFileName = `${env.TEMP_DIR}midi2ly-${hash}-midi.ly`;

	const result = await child_process.exec(`${env.LILYPOND_DIR}midi2ly ${midi.path} -o ${lyFileName}`);
	console.log("midi2ly:", result.stdout, result.stderr);

	const ly = await asyncCall(fs.readFile, lyFileName);

	return postProcessLy(ly.toString(), options);
};


const postProcessSvg = svg => {
	return svg.replace(/textedit:[^"]+:(\d+:\d+:\d+)/g, "textedit:$1");
};


//const nameNumber = name => Number(name.match(/-(\d+)\./)[1]);


// lilypond command line output file pattern
const FILE_BORN_OUPUT_PATTERN = /output\sto\s`(.+)'/;


const engraveSvg = async (source: string, {onProcStart, onMidiRead, onSvgRead}: {
	onProcStart?: () => void,
	onMidiRead?: (content: MIDI.MidiData) => void,
	onSvgRead?: (content: string) => void,
} = {}) => {
	const hash = genHashString();
	const sourceFilename = `${env.TEMP_DIR}engrave-${hash}.ly`;

	await asyncCall(fs.writeFile, sourceFilename, source);
	//console.log("ly source written:", sourceFilename);

	let midi = null;
	const svgs = [];

	let lastReady = null;

	const loadFile = async line => {
		await new Promise(resolve => lastReady = resolve);

		const [_, filename] = line.match(FILE_BORN_OUPUT_PATTERN);
		const [__, ext] = filename.match(/\.(\w+)$/);

		const filePath = path.resolve(env.TEMP_DIR, filename);
		//console.log("file output:", filePath, ext);

		switch (ext) {
		case env.MIDI_FILE_EXTEND: {
			const buffer = await asyncCall(fs.readFile, filePath);
			midi = MIDI.parseMidiData(buffer);

			onMidiRead && onMidiRead(midi);
		}

			break;
		case "svg": {
			const buffer = await asyncCall(fs.readFile, filePath);
			const svg = postProcessSvg(buffer.toString());
			svgs.push(svg);

			onSvgRead && onSvgRead(svg);
		}

			break;
		}
	};

	const loadProcs: Promise<void>[] = [];

	const checkFile = line => {
		if (lastReady) {
			lastReady();
			lastReady = null;
		}

		if (FILE_BORN_OUPUT_PATTERN.test(line))
			loadProcs.push(loadFile(line));
	};

	const proc = child_process.exec(`cd ${env.TEMP_DIR} && ${env.LILYPOND_DIR}lilypond -dbackend=svg .${sourceFilename}`);
	proc.childProcess.stdout.on("data", checkFile);
	proc.childProcess.stderr.on("data", checkFile);

	onProcStart && onProcStart();

	const result = await proc;

	lastReady && lastReady();

	await Promise.all(loadProcs);

	//console.log("svgs:", svgs.length);

	return {
		logs: result.stderr,
		svgs: svgs,
		midi,
	};
};


const engraveSvgWithStream = async (source: string, output: Stream) => {
	const hash = genHashString();
	const sourceFilename = `${env.TEMP_DIR}engrave-${hash}.ly`;

	await asyncCall(fs.writeFile, sourceFilename, source);

	let lastReady: () => void = null;
	let writing: Promise<void> = null;

	const loadFile = async line => {
		const [_, filename] = line.match(FILE_BORN_OUPUT_PATTERN);
		const [__, ext] = filename.match(/\.(\w+)$/);

		switch (ext) {
		case "svg": {
			await new Promise(resolve => lastReady = resolve);
			if (writing)
				await writing;
	
			let finishWriting;
			writing = new Promise(resolve => finishWriting = resolve);

			const filePath = path.resolve(env.TEMP_DIR, filename);
			const fileStream = fs.createReadStream(filePath);
			fileStream.pipe(output);

			fileStream.on("close", () => output.write("\n\n"));

			finishWriting();
			writing = null;
		}

			break;
		}
	};

	const checkFile = line => {
		if (lastReady) {
			lastReady();
			lastReady = null;
		}

		if (FILE_BORN_OUPUT_PATTERN.test(line))
			loadFile(line);
	};

	const proc = child_process.exec(`cd ${env.TEMP_DIR} && ${env.LILYPOND_DIR}lilypond -dbackend=svg .${sourceFilename}`);
	proc.childProcess.stdout.on("data", checkFile);
	proc.childProcess.stderr.on("data", checkFile);

	proc.then(() => lastReady && lastReady());

	return proc;
};



export {
	xml2ly,
	midi2ly,
	engraveSvg,
	engraveSvgWithStream,
	setEnvironment,
	LilyProcessOptions,
};
