
import fs from "fs";
import {MusicNotation, Matcher} from "@k-l-lambda/web-widgets";

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
	}));
	const criterion = new MusicNotation.Notation({meta: {}, tempos: [], channels: [notes]});

	midiNotation.notes.forEach(note => {
		note.start = note.startTick * 4 / 3;
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
};


const main = async (inputDir?: string) => {
	const lyFiles = walkDir(inputDir, /\.ly$/, {recursive: true});

	let i = 0;
	for (const lyFile of lyFiles) {
		try {
			await checkFile(lyFile);
		}
		catch (err) {
			console.warn("checkFile error:", err);
		}

		if (++i % 100 === 0)
			await emptyCache();
	}

	console.log("Done.");
};



const argv = JSON.parse(process.env.npm_config_argv);
main(...argv.original.slice(2));



// keep inspector connected
setTimeout(() => console.log("done."), 1e+8);
