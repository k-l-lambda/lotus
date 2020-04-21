
import fs from "fs";
import path from "path";

import * as lilyParser from "../inc/lilyParser";



const parse = sourceFile => {
	const grammar = fs.readFileSync("./inc/lilyParser/lilypond.jison").toString();
	const source = fs.readFileSync(sourceFile).toString();

	const parser = lilyParser.createParser(grammar);

	return parser.parse(source);
};


const main = sourceList => {
	for (const source of sourceList) {
		console.log("Parsing", source, "...");

		const result = parse(source);
		console.log("result:", result);
	}

	console.log("Done.");
};


const argv = JSON.parse(process.env.npm_config_argv);

const sourceList = argv.original.length > 2 ? argv.original.slice(2) : [
	"test-1.ly",
	"test-2.ly",
	"test-3.1.ly",
	"test-3.2.ly",
	"test-3.3.ly",
].map(filename => path.resolve("./tests/ly", filename));

main(sourceList);



// keep inspector connected
setTimeout(() => console.log("done."), 1e+8);
