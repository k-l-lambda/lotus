
import fs from "fs";
import {argv} from "yargs";

import "../env.js";
import loadLilyParser from "../backend/loadLilyParserNode";
import walkDir from "../backend/walkDir";
import {LilyDocument} from "../inc/lilyParser";



const main = async () => {
	const lilyParser = await loadLilyParser();

	const inputDir = argv._ && argv._[0];
	if (inputDir) {
		const lyFiles = walkDir(inputDir, /\.ly$/, {recursive: true});

		const varialbles = new Set();

		for (const lyFile of lyFiles) {
			console.log("Checking:", lyFile);

			const ly = fs.readFileSync(lyFile).toString();
			const doc = new LilyDocument(lilyParser.parse(ly));

			const vs = doc.getVariables();
			//console.log("varialbles:", varialbles);
			for (const v of vs)
				varialbles.add(v);
		}

		console.log("varialbles:", varialbles);
	}

	console.log("Done.");
};



main();
