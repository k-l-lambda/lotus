
import fs from "fs";
import path from "path";
import yargs from "yargs";

import "../env.js";
import walkDir from "../backend/walkDir";
import loadLilyParser from "../backend/loadLilyParserNode";
import {LilyDocument, LilyTerms} from "../inc/lilyParser";
import * as measureLayout from "../inc/measureLayout";
import {MusicTrack} from "../inc/lilyParser/lilyInterpreter";



interface Arguments {
	_: string[];

	markups?: string;
};

const argv = yargs.argv as Arguments;


const main = async () => {
	//console.log("argv:", argv);

	const inputDir = argv._[0];
	if (!inputDir) {
		console.warn("input directory is required.");
		return;
	}

	const t0 = Date.now();

	const lilyParser = await loadLilyParser();

	const cost = Date.now() - t0;
	console.log("lilyParser loaded, cost:", `${cost * 1e-3}s`);

	const markups = (argv.markups || "").split(",").filter(Boolean);

	const lyFiles = walkDir(inputDir, /\.ly$/, {recursive: true});

	console.log(lyFiles.length, "ly files found.");

	let index = 0;
	for (const lyPath of lyFiles) {
		try {
			const originalLy = fs.readFileSync(lyPath).toString();
			const lilyDocument = new LilyDocument(lilyParser.parse(originalLy));

			let changes = 0;
			for (const markup of markups) {
				switch (markup) {
				case "redivide-interpret": {
					const interpreter = lilyDocument.interpret();
					lilyDocument.root.forEachTopTerm(LilyTerms.Assignment, assign => {
						if (assign.value && typeof assign.value === "object" && assign.value.isMusic) {
							const key = assign.key.toString();
							const track = interpreter.layoutMusic.musicTracks.find(track => track.contextDict.Voice === key);
							if (track) {
								const block = assign.value.findFirst(LilyTerms.MusicBlock);
								block.redivide({measureHeads: track.measureHeads});

								++changes;
							}
						}
					});
				}

					break;
				case "merge-single-volta": {
					const interpreter = lilyDocument.interpret();
					const layout = interpreter.layoutMusic.mainTrack.block.measureLayout;
					let index = 1;
					for (; index < layout.seq.length - 1; ++index) {
						const found = !(layout.seq[index - 1] instanceof measureLayout.SingleMLayout)
							&& layout.seq[index] instanceof measureLayout.SingleMLayout
							&& layout.seq[index + 1] instanceof measureLayout.VoltaMLayout;

						if (found)
							break;
					}

					if (index < layout.seq.length - 1) {
						const [single] = layout.seq.splice(index, 1);
						const volta = layout.seq[index] as measureLayout.VoltaMLayout;
						volta.body.unshift(single);

						const tracks = lilyDocument.root.sections.filter(section =>
							section instanceof LilyTerms.Assignment && section.value instanceof LilyTerms.Relative && section.value.measureLayout)
							.map(assignment => (assignment as any).value.args)
							.map(args => MusicTrack.fromBlockAnchor(args[1], args[0]));
						tracks.forEach(track => track.applyMeasureLayout(layout));

						++changes;
					}
				}

					break;
				default: {
					const result = lilyDocument[markup]();

					if (typeof result === "number")
						changes += result;
					else
						++changes;
				}
				}
			}

			if (changes) {
				const ly = lilyDocument.toString();

				await fs.promises.writeFile(lyPath, ly);
			}

			const filePath = path.relative(inputDir, lyPath);
			console.log(changes ? "\x1b[32m" : "\x1b[0m", `${++index}\t${filePath}\t${changes}`);
		}
		catch (err) {
			console.warn("markup failed:", lyPath, err);
		}
	}

	console.log("Done.");
};



main();
