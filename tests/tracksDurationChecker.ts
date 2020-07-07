
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

		for (const lyFile of lyFiles) {
			console.log("Checking:", lyFile);

			const ly = fs.readFileSync(lyFile).toString();
			const doc = new LilyDocument(lilyParser.parse(ly));

			const durations = doc.musicTracks.map(track => track.durationMagnitude);
			const dset = new Set(durations);

			//console.log("durations:", durations, lyFile);
			if (!durations.length)
				console.warn("empty tracks!");
			else if (dset.size > 1)
				console.warn("inconsistent durations:", durations);
			else
				console.log(durations[0], "*", durations.length);
		}
	}

	console.log("Done.");
};



main();
