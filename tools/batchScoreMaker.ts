
import fs from "fs";
import {argv} from "yargs";
import YAML from "yaml";
import {MIDI} from "@k-l-lambda/web-widgets";

import "../env.js";
import * as ScoreMaker from "../backend/scoreMaker";
import walkDir from "../backend/walkDir";
import loadLilyParser from "../backend/loadLilyParserNode";
import {emptyCache} from "../backend/lilyCommands";
import asyncCall from "../inc/asyncCall";
import LogRecorder from "../inc/logRecorder";
import * as statStorage from "../tools/statStorage";



const main = async () => {
	//console.log("argv:", argv);

	const t0 = Date.now();

	const logStream = fs.createWriteStream("batchScoreMaker.log");
	const log = (...messages) => {
		console.log(...messages);
		logStream.write(messages.join(" ") + "\n", "utf-8");
	};

	log(`[${new Date(t0)}]	start.`);

	const lilyParser = await loadLilyParser();

	const lilyFiles: Set<string> = new Set();

	const flushCacheInterval = argv.flushCacheInterval ? Number(argv.flushCacheInterval) : 60;

	if (argv.inputXmlDir) {
		const counting = {
			success: 0,
			failure: 0,
			skip: 0,
		};

		const issues = [];

		const markup = argv.xmlMarkup ? fs.readFileSync(argv.xmlMarkup).toString() : null;

		// TODO: set xml options according to argv
		const xmlOptions = {};

		const xmlFiles = walkDir(argv.inputXmlDir, /\.xml$/, {recursive: true});
		log(`${xmlFiles.length} XML files.`);

		for (const xmlPath of xmlFiles) {
			//console.log("xmlPath:", xmlPath);
			const lyPath = xmlPath.replace(/\.\w+$/, ".ly");
			//const filename = lyPath.split("/").pop();

			if (argv.skipExist) {
				if (fs.existsSync(lyPath)) {
					lilyFiles.add(lyPath);
					++counting.skip;
					continue;
				}
			}

			try {
				const xml = fs.readFileSync(xmlPath);
				const ly = await ScoreMaker.xmlBufferToLy(xml, xmlOptions);
				const markupLy = markup ? await ScoreMaker.markupLily(ly, markup, lilyParser) : ly;

				if (!argv.noLyWrite && !argv.noWrite) {
					asyncCall(fs.writeFile, lyPath, markupLy).then(() => console.log("wrote:", lyPath));
					lilyFiles.add(lyPath);
				}

				++counting.success;
			}
			catch (err) {
				console.error(err);
				console.warn("Error when converting xml:", xmlPath);

				issues.push(xmlPath);

				++counting.failure;

				if (argv.pauseOnError) {
					console.log("Paused on error, any key to continue.");
					await new Promise(resolve => process.stdin.once("data", data => resolve(data)));
				}
			}

			// flush cache directory every 100 files
			if ((counting.success + counting.failure) % flushCacheInterval === 0)
				await emptyCache();
		}

		if (issues.length) {
			log("Issues:");
			log(YAML.stringify(issues));
		}

		log("XML to ly finished, success:", counting.success, "failure:", counting.failure, "skip:", counting.skip);
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

	const t1 = Date.now();

	let processedCount = 0;

	if (argv.inputLyDir || argv.bundleScore) {
		const counting = {
			success: 0,
			perfect: 0,
			failure: 0,
			skip: 0,
		};

		const issues = [];

		let index = 0;

		const markup = argv.markup ? fs.readFileSync(argv.markup).toString() : null;

		const qualityThreshold = argv.qualityThreshold ? Number(argv.qualityThreshold) : 0;

		log(`${lilyFiles.size} lilypond files.`);

		for (const lyPath of lilyFiles) {
			//console.log("lyPath:", lyPath);

			const scorePath = lyPath.replace(/\.\w+$/, ".score.json");

			if (argv.skipExist) {
				if (fs.existsSync(scorePath)) {
					++counting.skip;
					continue;
				}
			}

			try {
				const logger = new LogRecorder({enabled: true});

				const originalLy = fs.readFileSync(lyPath).toString();
				const ly = markup ? await ScoreMaker.markupLily(originalLy, markup, lilyParser) : originalLy;

				let midi = null;
				const midiPath = midiFiles.get(lyPath);
				if (midiPath) {
					const buffer = await asyncCall(fs.readFile, midiPath);
					midi = MIDI.parseMidiData(buffer);

					console.log("midi loaded:", midiPath);
				}

				const score = await ScoreMaker.makeScore(ly, lilyParser, {midi, logger});

				const matchStat = logger.records.reverse().find(record => record.desc === "makeScore.match");
				if (!matchStat)
					throw new Error("No matchStat in logger");

				statStorage.appendData(lyPath, {scoreMaker: matchStat.data.coverage});

				if (matchStat.data.coverage < 1) {
					console.log("imperfect matching:", lyPath, matchStat.data.coverage);

					issues.push({
						lyPath,
						coverage: matchStat.data.coverage,
						omitC: matchStat.data.omitC,
						omitS: matchStat.data.omitS,
					});
				}
				else
					++counting.perfect;

				if (!argv.noWrite && matchStat.data.coverage >= qualityThreshold)
					asyncCall(fs.writeFile, scorePath, JSON.stringify(score)).then(() => console.log("wrote:", scorePath));

				++counting.success;
			}
			catch (err) {
				console.error(err);
				console.warn("Error when making score", scorePath);

				statStorage.appendData(lyPath, {scoreMaker: 0});

				issues.push({
					lyPath,
					coverage: -1,
				});

				++counting.failure;

				if (argv.pauseOnError) {
					console.log("Paused on error, any key to continue.");
					await new Promise(resolve => process.stdin.once("data", data => resolve(data)));
				}
			}

			console.log("Making progress:", ++index, "/", lilyFiles.size);

			// flush cache directory every 100 files
			if ((counting.success + counting.failure) % flushCacheInterval === 0)
				await emptyCache();
		}

		issues.sort((i1, i2) => i1.coverage - i2.coverage);
		//console.log("issues:", issues);

		if (issues.length) {
			log("Issues:");
			log(YAML.stringify(issues));
		}
		else
			log("No issues.");

		log("Score making finished, perfect:", counting.perfect, ", success:", counting.success, "failure:", counting.failure, "skip:", counting.skip);

		processedCount = lilyFiles.size - counting.skip;
	}

	const tx = Date.now();
	const costTotal = ((tx - t0) * 1e-3).toFixed();
	const costAverage = processedCount && ((tx - t1) / processedCount);

	log(`[${new Date(tx)}]	done.`);
	log(`${costTotal}s cost.`);

	if (costAverage)
		log(`${(costAverage * 1e-3).toFixed(1)}s per file.`);
};



main();
