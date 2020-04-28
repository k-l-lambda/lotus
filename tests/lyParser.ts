
import fs from "fs";
import path from "path";

//import * as lilyParser from "../inc/lilyParser";
import loadLilyParser from "../backend/loadLilyParserNode";
import walkDir from "../backend/walkDir";



const parse = (parser, sourceFile) => {
	const source = fs.readFileSync(sourceFile).toString();

	//const parser = lilyParser.createParser(grammar);

	return parser.parse(source);
};


const main = async sourceList => {
	if (sourceList.length === 1) {
		const stat = fs.statSync(sourceList[0]);
		if (stat.isDirectory()) {
			sourceList = walkDir(sourceList[0], /\.ly$/);
			console.log("directory walk, files count:", sourceList.length);
		}
	}

	//const grammar = fs.readFileSync("./inc/lilyParser/lilypond.jison").toString();
	const parser = await loadLilyParser();

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

const sourceList = argv.original.length > 2 ? argv.original.slice(2) : [
	"test-scm.ly",
	"test-1.ly",
	"test-2.ly",
	"test-3.1.ly",
	"test-3.2.ly",
	"test-3.3.ly",
	"test-3.4.ly",
	"test-3.5.ly",
	"test-3.6.ly",
	"test-3.7.ly",
	"test-4.1.ly",
	"test-4.2.ly",
	"test-5.ly",
].map(filename => path.resolve("./tests/ly", filename));

main(sourceList);



// keep inspector connected
setTimeout(() => console.log("done."), 1e+8);
