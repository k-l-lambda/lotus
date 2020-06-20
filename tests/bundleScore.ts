
import fs from "fs";

import "../env.js";
import {makeScore} from "../backend/scoreMaker";
import loadLilyParser from "../backend/loadLilyParserNode";
import LogRecorder from "../inc/logRecorder";



const main = async (...args) => {
	const logger = new LogRecorder({enabled: true});

	const lilyParser = await loadLilyParser();

	const ly = fs.readFileSync(args[0]).toString();
	const t0 = Date.now();
	const result = await makeScore(ly, lilyParser, {logger});
	console.log("cost:", Date.now() - t0);
	//console.log("result:", result, logger);
	console.log("profiles:", logger.records.filter(r => /scoreMaker\.profile/.test(r.desc)));

	const outputPath = args[1];
	if (outputPath) {
		fs.writeFileSync(outputPath, JSON.stringify(result));
		console.log("Output done.");
	}
};



const argv = JSON.parse(process.env.npm_config_argv);

main(...argv.original.slice(2));



// keep inspector connected
setTimeout(() => console.log("done."), 1e+8);
