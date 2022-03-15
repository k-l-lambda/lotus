
import fs from "fs";
import {argv} from "yargs";
import JSZip from "jszip";
import YAML from "yaml";
import {MIDI, MidiUtils} from "@k-l-lambda/music-widgets";

import "../env.js";

import {makeMIDI, makeArticulatedMIDI} from "../backend/scoreMaker";
import {emptyCache} from "../backend/lilyCommands";
import loadLilyParser from "../backend/loadLilyParserNode";
import {LilyDocument} from "../inc/lilyParser";
import walkDir from "../backend/walkDir";
import * as LilyNotation from "../inc/lilyNotation";
import * as statStorage from "../backend/statStorage";
import * as constants from "../backend/constants";



const checkFile = async (filename: string, {articulate = false, dumpOmit = false} = {}) => {
	const source = fs.readFileSync(filename).toString();

	const lilyParser = await loadLilyParser();
	const includeFolders = constants.LY_INCLUDE_FOLDERS;

	const midi = await (articulate ? makeArticulatedMIDI(source, lilyParser, {includeFolders}) : makeMIDI(source, lilyParser, {includeFolders}));
	//const midiNotation = MusicNotation.Notation.parseMidi(midi);

	const lilyDocument = new LilyDocument(lilyParser.parse(source));
	const interpreter = lilyDocument.interpret();
	const lilyNotation = interpreter.getNotation();
	//console.debug("lilyNotation:", lilyNotation);

	const {path, criterion, sample: midiNotation} = await LilyNotation.matchWithExactMIDI(lilyNotation, midi);
	//LilyNotation.fuzzyMatchNotations(path, criterion, midiNotation, {pitchToleranceMax: 0});

	const cis = new Set(Array(criterion.notes.length).keys());
	path.forEach(ci => cis.delete(ci));

	const omitC = cis.size;
	const omitS = path.filter(ci => ci < 0).length;

	const coverage = ((criterion.notes.length - omitC) / criterion.notes.length)
		* ((midiNotation.notes.length - omitS) / midiNotation.notes.length);

	const tickFactor = 480 / midiNotation.ticksPerBeat;

	const offsetTicks = path.map((ci, si) => {
		if (ci < 0)
			return null;

		const cn = criterion.notes[ci];
		const sn = midiNotation.notes[si];
		return cn.startTick - sn.startTick * tickFactor;
	});
	const offsetMap: {[key: number]: number} = offsetTicks.reduce((map, offset) => {
		if (Number.isFinite(offset)) {
			map[offset] = map[offset] || 0;
			++map[offset];
		}

		return map;
	}, {});
	const commonOffset = Number(Object.entries(offsetMap).sort((o1, o2) => o2[1] - o1[1])[0][0]);
	const totalOffset = offsetTicks.reduce((sum, offset) => sum + (offset - commonOffset), 0);
	//console.log("commonOffset:", offsetTicks, commonOffset, totalOffset, offsetMap);
	const averageTickOffset = totalOffset / midiNotation.notes.length;

	console.log(filename, ":", omitC, omitS, averageTickOffset);
	if (dumpOmit && (omitC || omitS)) {
		console.debug("path:", path);
		if (omitC > 0) {
			console.debug("cis:", cis, Array.from(cis).map(ci => criterion.notes[ci]).map(note =>
				({id: note.id, implicitType: (note as any).implicitType, startTick: note.startTick, endTick: note.endTick, pitch: note.pitch, channel: note.channel})));
		}

		if (omitS > 0) {
			const sis = path
				.map((ci, si) => [si, ci])
				// eslint-disable-next-line
				.filter(([_, ci]) => ci < 0)
				.map(([si]) => si);
			console.debug("sis:", sis, sis.map(si => midiNotation.notes[si]).map(note =>
				({startTick: note.startTick, pitch: note.pitch, channel: note.channel})));
		}
	}

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
		offsetMap,
		offsetTicks,
	};
};


const TICK_OFFSET_THRESHOLD = 16;


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
			const result = await checkFile(lyFile, {articulate: !!argv.articulate, dumpOmit: !!argv.dumpOmit});
			if (argv.breakOnLargeOffset && Math.abs(result.averageTickOffset) > TICK_OFFSET_THRESHOLD) {
				console.warn("Large averageTickOffset:", result.offsetMap);
				break;
			}
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

			if (result.coverage < 1 || (!argv.articulate && Math.abs(result.averageTickOffset) > 16)) {
				issues.push({
					lyFile,
					omitC: result.omitC,
					omitS: result.omitS,
					coverage: result.coverage,
					averageTickOffset: result.averageTickOffset,
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
