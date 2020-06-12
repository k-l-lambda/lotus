
import fs from "fs";

import {markupLily} from "../backend/scoreMaker";
import loadLilyParser from "../backend/loadLilyParserNode";



const main = async (...args) => {
	const lilyParser = await loadLilyParser();

	const source = fs.readFileSync(args[0]).toString();
	const markup = fs.readFileSync(args[1]).toString();

	const result = markupLily(source, markup, lilyParser);
	//console.log("result:", result);
	fs.writeFileSync("./footages/markupTest.ly", result);

	console.log("Done.");
};



const argv = JSON.parse(process.env.npm_config_argv);

main(...argv.original.slice(2));



// keep inspector connected
setTimeout(() => console.log("done."), 1e+8);
