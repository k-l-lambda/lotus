
import fs from "fs";
import path from "path";
import yargs from "yargs";

import "../env.js";
import walkDir from "../backend/walkDir";
import loadLilyParser from "../backend/loadLilyParserNode";
import {LilyDocument} from "../inc/lilyParser";



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

	const markups = argv.markups || ["removeInvalidExpressionsOnRests"];

	const lyFiles = walkDir(inputDir, /\.ly$/, {recursive: true});

	console.log(lyFiles.length, "ly files found.");

	let index = 0;
	for (const lyPath of lyFiles) {
		try {
			const originalLy = fs.readFileSync(lyPath).toString();
			const lilyDocument = new LilyDocument(lilyParser.parse(originalLy));

			let changes = 0;
			for (const markup of markups) 
				changes += lilyDocument[markup]();
			

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
