
import fs from "fs";
import {argv} from "yargs";
import {MIDI} from "@k-l-lambda/web-widgets";

import "../env.js";
import * as ScoreMaker from "../backend/scoreMaker";
import walkDir from "../backend/walkDir";
import asyncCall from "../inc/asyncCall";
import LogRecorder from "../inc/logRecorder";



const main = async () => {
	//console.log("argv:", argv);

	const markup = argv.markup ? fs.readFileSync(argv.markup).toString() : null;

	const lilyFiles: Set<string> = new Set();

	if (argv.inputXmlDir) {
		const counting = {
			success: 0,
			failure: 0,
		};

		// TODO: set xml options according to argv
		const xmlOptions = {};

		const xmlFiles = walkDir(argv.inputXmlDir, /\.xml$/, {recursive: true});
		for (const xmlPath of xmlFiles) {
			//console.log("xmlPath:", xmlPath);
			const lyPath = xmlPath.replace(/\.\w+$/, ".ly");
			//const filename = lyPath.split("/").pop();

			try {
				const xml = fs.readFileSync(xmlPath).toString();
				const ly = await ScoreMaker.xmlToLyWithMarkup(xml, xmlOptions, markup);

				if (!argv.noLyWrite && !argv.noWrite) {
					asyncCall(fs.writeFile, lyPath, ly).then(() => console.log("wrote:", lyPath));
					lilyFiles.add(lyPath);
				}

				++counting.success;
			}
			catch (err) {
				console.error(err);
				console.warn("Error when converting xml", xmlPath);

				++counting.failure;
			}
		}

		console.log("XML to ly finished, success:", counting.success, "failure:", counting.failure);
	}

	if (argv.inputLyDir) {
		const lyFiles = walkDir(argv.inputLyDir, /\.ly$/, {recursive: true});
		lyFiles.forEach(path => lilyFiles.add(path));
	}

	const midiFiles = new Map();

	if (argv.midiSameFilename) {
		const midiFilePostfix = argv.midiExtendName || "midi";

		for (const lyPath of lilyFiles) {
			const midiPath = lyPath.replace(/\.\w+$/, "." + midiFilePostfix);
			if (fs.existsSync(midiPath)) 
				midiFiles.set(lyPath, midiPath);
			else
				console.warn("midi file not exist:", midiPath);
		}
	}

	if (argv.inputLyDir || argv.bundleScore) {
		const counting = {
			success: 0,
			perfect: 0,
			failure: 0,
		};

		const issues = [];

		for (const lyPath of lilyFiles) {
			//console.log("lyPath:", lyPath);

			const scorePath = lyPath.replace(/\.\w+$/, ".score.json");

			try {
				const logger = new LogRecorder({enabled: true});

				const ly = fs.readFileSync(lyPath).toString();

				let midi = null;
				const midiPath = midiFiles.get(lyPath);
				if (midiPath) {
					const buffer = await asyncCall(fs.readFile, midiPath);
					midi = MIDI.parseMidiData(buffer);

					console.log("midi loaded:", midiPath);
				}

				const score = await ScoreMaker.markScore(ly, {midi, logger});

				const matchStat = logger.records.reverse().find(record => record.desc === "markScore.match");
				console.assert(matchStat, "No matchStat in logger.");

				if (matchStat.data.coverage < 1) {
					console.log("imperfect matching:", lyPath, matchStat.data);

					issues.push({
						lyPath,
						coverage: matchStat.data.coverage,
						omitC: matchStat.data.omitC,
						omitS: matchStat.data.omitS,
					});
				}
				else
					++counting.perfect;

				if (!argv.noWrite)
					asyncCall(fs.writeFile, scorePath, JSON.stringify(score)).then(() => console.log("wrote:", scorePath));

				++counting.success;
			}
			catch (err) {
				console.error(err);
				console.warn("Error when making score", scorePath);

				issues.push({
					lyPath,
					coverage: -1,
				});

				++counting.failure;
			}
		}

		console.log("Score making finished, perfect:", counting.perfect, ", success:", counting.success, "failure:", counting.failure);

		issues.sort((i1, i2) => i1.coverage - i2.coverage);
		console.log("issues:", issues);
	}

	console.log("batchScoreMaker done.");
};



main();
