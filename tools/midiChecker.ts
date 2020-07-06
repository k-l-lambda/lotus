
import fs from "fs";
import {argv} from "yargs";
import YAML from "yaml";
import {MIDI, MusicNotation, Matcher} from "@k-l-lambda/web-widgets";

import "../env.js";
import * as ScoreMaker from "../backend/scoreMaker";
import loadLilyParser from "../backend/loadLilyParserNode";
import walkDir from "../backend/walkDir";



interface MatcherResult {
	coverage: number;
	omitC: number;
	omitS: number;
	path: number[];
};


const matchMIDI = async (criterion: MIDI.MidiData, sample: MIDI.MidiData): Promise<MatcherResult> => {
	const notationC = MusicNotation.Notation.parseMidi(criterion);
	const notationS = MusicNotation.Notation.parseMidi(sample);

	Matcher.genNotationContext(notationC);
	Matcher.genNotationContext(notationS);

	for (const note of notationS.notes)
		Matcher.makeMatchNodes(note, notationC);

	const navigator = await Matcher.runNavigation(notationC, notationS);
	const path = navigator.path();

	const cis = new Set(Array(notationC.notes.length).keys());
	path.forEach(ci => cis.delete(ci));

	const omitC = cis.size;
	const omitS = path.filter(ci => ci < 0).length;

	const coverage = ((notationC.notes.length - omitC) / notationC.notes.length)
		* ((notationS.notes.length - omitS) / notationS.notes.length);

	return {
		coverage,
		omitC,
		omitS,
		path,
	};
};


const main = async () => {
	const lilyParser = await loadLilyParser();

	const logStream = fs.createWriteStream("midiChecker.log");
	const log = (...messages) => {
		console.log(...messages);
		logStream.write(messages.join(" ") + "\n", "utf-8");
	};

	if (argv.inputLy) {
		const source = fs.readFileSync(argv.inputLy).toString();
		const midi = await ScoreMaker.makeMIDI(source, lilyParser, {fixNestedRepeat: argv.fixNestedRepeat});
		//console.log("midi:", midi);

		if (argv.outputMIDI) {
			const buffer = Buffer.from(MIDI.encodeMidiFile(midi));
			fs.writeFileSync(argv.outputMIDI, buffer);
		}
	}

	const inputDir = argv._ && argv._[0];
	if (inputDir) {
		const lyFiles = walkDir(inputDir, /\.ly$/, {recursive: true});

		const counting = {
			count: 0,
			perfect: 0,
			failure: 0,
			coverageSum: 0,
		};

		const issues = [];

		for (const lyFile of lyFiles) {
			const midiFile = lyFile.replace(/\.\w+$/, ".mid");
			if (fs.existsSync(midiFile)) {
				//console.log("pair:", lyFile, midiFile);
				try {
					const filename = lyFile.match(/[^/]+$/)[0];

					const ly = fs.readFileSync(lyFile).toString();
					const midiBuffer = fs.readFileSync(midiFile);
	
					const criterion = MIDI.parseMidiData(midiBuffer);
					const sample = await ScoreMaker.makeMIDI(ly, lilyParser, {fixNestedRepeat: argv.fixNestedRepeat});
	
					const result = await matchMIDI(criterion, sample);
	
					if (result.coverage === 1)
						++counting.perfect;
					else {
						issues.push({
							path: lyFile,
							coverage: result.coverage,
							omitC: result.omitC,
							omitS: result.omitS,
						});
					}
					counting.coverageSum += result.coverage;
	
					console.log("match:", result.coverage.toFixed(3), [result.omitC, result.omitS], filename);
				}
				catch (err) {
					++counting.failure;

					issues.push({
						path: lyFile,
						coverage: -1,
					});
				}

				++counting.count;
			}
		}

		issues.sort((i1, i2) => i1.coverage - i2.coverage);

		if (issues.length) {
			log("Issues:");
			log(YAML.stringify(issues));
		}
		else
			log("No issues.");

		log("MIDI checking finished, count:", counting.count, "perfect:", counting.perfect, "failure:", counting.failure, "coverage:", counting.coverageSum / counting.count);
	}

	console.log("Done.");
};



main();
