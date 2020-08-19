
import fs from "fs";
import {argv} from "yargs";
import JSZip from "jszip";
import {MusicNotation, Matcher, MIDI, MidiUtils} from "@k-l-lambda/web-widgets";

import "../env.js";

import {makeMIDI} from "../backend/scoreMaker";
import {emptyCache} from "../backend/lilyCommands";
import loadLilyParser from "../backend/loadLilyParserNode";
import {LilyDocument} from "../inc/lilyParser";
import walkDir from "../backend/walkDir";



const checkFile = async filename => {
	const source = fs.readFileSync(filename).toString();

	const lilyParser = await loadLilyParser();

	const midi = await makeMIDI(source, lilyParser, {unfoldRepeats: false});
	const midiNotation = MusicNotation.Notation.parseMidi(midi);

	const lilyDocument = new LilyDocument(lilyParser.parse(source));
	const interperter = lilyDocument.interpret();
	const lilyNotation = interperter.getNotation();

	const notes = lilyNotation.notes.filter(note => !note.tied && !note.overlapped).map(note => ({
		start: note.startTick,
		pitch: note.pitch,
		duration: note.endTick - note.startTick,
		velocity: 127,
	}));
	const criterion = new MusicNotation.Notation({
		meta: {},
		tempos: [],
		channels: [notes],
		endTime: notes[notes.length - 1].start + notes[notes.length - 1].duration,
	});

	midiNotation.notes.forEach(note => {
		note.start = note.startTick * 480 / 384;
	});

	Matcher.genNotationContext(criterion);
	Matcher.genNotationContext(midiNotation);
	console.debug("notations:", criterion, midiNotation);

	for (const note of midiNotation.notes)
		Matcher.makeMatchNodes(note, criterion);

	const navigator = await Matcher.runNavigation(criterion, midiNotation);
	const path = navigator.path();
	console.debug("path:", path);

	const cis = new Set(Array(criterion.notes.length).keys());
	path.forEach(ci => cis.delete(ci));

	const omitC = cis.size;
	const omitS = path.filter(ci => ci < 0).length;

	console.log(filename, ":", omitC, omitS);

	return {
		midi,
		midiNotation,
		lilyNotation,
		criterion,
		path,
		omitC,
		omitS,
	};
};


const main = async () => {
	const inputDir = argv._[0];
	const lyFiles = walkDir(inputDir, /\.ly$/, {recursive: true});

	let i = 0;
	for (const lyFile of lyFiles) {
		try {
			const result = await checkFile(lyFile);
			if (argv.dumpOnError && result.omitC + result.omitS > 0) {
				const pack = new JSZip();

				const buffer = MidiUtils.encodeToMIDI(result.criterion, {startTime: 0});
				pack.file("criterion.midi", buffer);

				const buffer2 = MIDI.encodeMidiFile(result.midi);
				pack.file("sample.midi", buffer2);

				pack
					.generateNodeStream({streamFiles: true})
					.pipe(fs.createWriteStream("./lilyNotationMatch-dump.zip"))
					.on("finish", function () {
						console.log("dump Done.");
					});
				return;
			}
		}
		catch (err) {
			console.warn("checkFile error:", err);
		}

		if (++i % 100 === 0)
			await emptyCache();
	}

	console.log("Done.");
};



main();



// keep inspector connected
setTimeout(() => console.log("done."), 1e+8);
