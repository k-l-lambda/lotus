
import fs from "fs";

import loadJisonParser from "../backend/loadJisonParserNode";
import loadLilyParserNode from "../backend/loadLilyParserNode";
import walkDir from "../backend/walkDir";



const parse = (parser, sourceFile) => {
	const source = fs.readFileSync(sourceFile).toString();

	return parser.parse(source);

	// TODO:
	void(loadJisonParser);
};


const main = async sourceList => {
	if (sourceList.length === 1) {
		const stat = fs.statSync(sourceList[0]);
		if (stat.isDirectory()) {
			sourceList = walkDir(sourceList[0], /\.ly$/);
			console.log("directory walk, files count:", sourceList.length);
		}
	}

	const parser = await loadLilyParserNode();

	const failures = [];

	for (const source of sourceList) {
		console.log("Parsing", source, "...");

		try {
			const result = parse(parser, source);
			console.log("result:", result);
		}
		catch (error) {
			console.warn("failed:", source, error);
			failures.push({source, error});
		}
	}

	console.log("Failures:", failures);
	console.log(`Success: ${sourceList.length - failures.length}/${sourceList.length}`);

	console.log("Done.");
};


const argv = JSON.parse(process.env.npm_config_argv);

const sourceList = argv.original.length > 2 ? argv.original.slice(2) : ["./tests/ly/measures"];

main(sourceList);



// keep inspector connected
setTimeout(() => console.log("done."), 1e+8);
