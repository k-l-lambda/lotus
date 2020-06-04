
import fs from "fs";

import "../env.js";
import {markScore} from "../backend/scoreMaker";
import LogRecorder from "../inc/logRecorder";



const main = async (...args) => {
	const logger = new LogRecorder({enabled: true});

	const ly = fs.readFileSync(args[0]).toString();
	const result = await markScore(ly, {logger});
	console.log("result:", result, logger);

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
