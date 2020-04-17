
import fs from "fs";

import * as lilyParser from "../inc/lilyParser";



const parse = (sourceFile = "./tests/ly/test.ly") => {
	const grammar = fs.readFileSync("./inc/lilyParser/lilypond.jison").toString();
	const source = fs.readFileSync(sourceFile).toString();
	
	const parser = lilyParser.createParser(grammar);
	
	return parser.parse(source);
};


const argv = JSON.parse(process.env.npm_config_argv);

const result = parse(argv.original[2]);
console.log("result:", result);



// keep inspector connected
setTimeout(() => console.log("done."), 1e+8);
