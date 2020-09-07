
import fs from "fs";
import {argv} from "yargs";
import JSZip from "jszip";
import YAML from "yaml";
import {MIDI, MidiUtils} from "@k-l-lambda/web-widgets";

import "../env.js";

import {makeMIDI} from "../backend/scoreMaker";
import {emptyCache} from "../backend/lilyCommands";
import loadLilyParser from "../backend/loadLilyParserNode";
import {LilyDocument} from "../inc/lilyParser";
import walkDir from "../backend/walkDir";
import * as LilyNotation from "../inc/lilyNotation";
import * as statStorage from "../backend/statStorage";



const checkFile = async filename => {
	const source = fs.readFileSync(filename).toString();

	const lilyParser = await loadLilyParser();

	const midi = await makeMIDI(source, lilyParser, {unfoldRepeats: false});
	//const midiNotation = MusicNotation.Notation.parseMidi(midi);

	const lilyDocument = new LilyDocument(lilyParser.parse(source));
	const interpreter = lilyDocument.interpret();
	const lilyNotation = interpreter.getNotation();
	//console.debug("lilyNotation:", lilyNotation);

	const {path, criterion, sample: midiNotation} = await LilyNotation.matchWithMIDI(lilyNotation, midi);
	LilyNotation.fuzzyMatchNotations(path, criterion, midiNotation, {pitchToleranceMax: 0});

	const cis = new Set(Array(criterion.notes.length).keys());
	path.forEach(ci => cis.delete(ci));

	const omitC = cis.size;
	const omitS = path.filter(ci => ci < 0).length;

	const coverage = ((criterion.notes.length - omitC) / criterion.notes.length)
		* ((midiNotation.notes.length - omitS) / midiNotation.notes.length);

	const tickFactor = 480 / midiNotation.ticksPerBeat;

	const offsetTicks = path.reduce((total, ci, si) => {
		if (ci < 0)
			return total;

		const cn = criterion.notes[ci];
		const sn = midiNotation.notes[si];
		const offset = cn.startTick - sn.startTick * tickFactor;

		return total + offset;
	}, 0);
	const averageTickOffset = offsetTicks / midiNotation.notes.length;

	console.log(filename, ":", omitC, omitS, averageTickOffset);
	/*if (omitC || omitS) {
		console.debug("path:", path);
		if (omitC > 0)
			console.debug("cis:", cis, Array.from(cis).map(ci => criterion.notes[ci]).map(note => ({id: note.id, start: note.start, pitch: note.pitch})));
		if (omitS > 0) {
			const sis = path
				.map((ci, si) => [si, ci])
				// eslint-disable-next-line
				.filter(([_, ci]) => ci < 0)
				.map(([si]) => si);
			console.debug("sis:", sis, sis.map(si => midiNotation.notes[si]).map(note => ({start: note.start, pitch: note.pitch})));
		}
	}*/

	return {
		midi,
		midiNotation,
		lilyNotation,
		criterion,
		path,
		omitC,
		omitS,
		coverage,
		averageTickOffset,
	};
};


const main = async () => {
	const inputDir = argv._[0];
	const lyFiles = walkDir(inputDir, /\.ly$/, {recursive: true});

	const timeStr = new Date(Date.now() - new Date().getTimezoneOffset() * 60e+3).toISOString()
		.replace(/:[\w.]+$/, "").replace(/[-:]/g, "");
	const logStream = fs.createWriteStream(`./logs/lilyNotationMatch-${timeStr}.log`);
	const log = (...messages) => {
		console.log(...messages);
		logStream.write(messages.join(" ") + "\n", "utf-8");
	};

	log(`[${new Date()}]	start.`);

	const counting = {
		perfect: 0,
		success: 0,
		failure: 0,
	};
	const issues = [];

	let i = 0;
	for (const lyFile of lyFiles) {
		try {
			const result = await checkFile(lyFile);
			if (argv.dumpOnError && (result.omitC + result.omitS > 0 || result.averageTickOffset)) {
				const pack = new JSZip();

				const buffer = MidiUtils.encodeToMIDI(result.criterion, {startTime: 0});
				pack.file("criterion.midi", buffer);

				const buffer2 = MIDI.encodeMidiFile(result.midi);
				pack.file("sample.midi", buffer2);

				pack
					.generateNodeStream({streamFiles: true})
					.pipe(fs.createWriteStream("./footages/lilyNotationMatch-dump.zip"))
					.on("finish", function () {
						console.log("dump Done.", counting);
					});
				return;
			}

			statStorage.appendData(lyFile, {notationMatch: result.coverage});

			if (result.coverage < 1) {
				issues.push({
					lyFile,
					omitC: result.omitC,
					omitS: result.omitS,
					coverage: result.coverage,
				});
			}
			else
				++counting.perfect;

			++counting.success;
		}
		catch (err) {
			console.warn("checkFile error:", err);
			++counting.failure;

			statStorage.appendData(lyFile, {notationMatch: 0});

			issues.push({
				lyFile,
				coverage: null,
			});
		}

		if (++i % 100 === 0)
			await emptyCache();
	}

	if (issues.length) {
		issues.sort((i1, i2) => i1.coverage - i2.coverage);

		log("Issues:");
		log(YAML.stringify(issues));
	}

	log("Finished, perfect:", counting.perfect, "success:", counting.success, "failure:", counting.failure);
	log(`[${new Date()}]	done.`);
};



main();



// keep inspector connected
setTimeout(() => console.log("done."), 1e+8);
