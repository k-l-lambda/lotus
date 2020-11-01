
import fs from "fs";

import loadJisonParser from "../backend/loadJisonParserNode";
import loadLilyParserNode from "../backend/loadLilyParserNode";
import walkDir from "../backend/walkDir";
import {LilyDocument} from "../inc/lilyParser";
import {LiteralString} from "../inc/lilyParser/lilyTerms";



const parse = (lilyParser, measuresParser, sourceFile) => {
	const source = fs.readFileSync(sourceFile).toString();

	const doc = new LilyDocument(lilyParser.parse(source));
	const interpreter = doc.interpret();
	const layout1 = interpreter.layoutMusic.musicTracks[0].block.measureLayout;

	const sourceI = (interpreter.variableTable.get("measureLayoutI") as LiteralString).toString();
	const sourceS = (interpreter.variableTable.get("measureLayoutS") as LiteralString).toString();

	const layout2i = measuresParser.parse(sourceI);

	console.log("layout1:", layout1);
	console.log("layout2i:", layout2i);

	return true;
};


const main = async sourceList => {
	if (sourceList.length === 1) {
		const stat = fs.statSync(sourceList[0]);
		if (stat.isDirectory()) {
			sourceList = walkDir(sourceList[0], /\.ly$/);
			console.log("directory walk, files count:", sourceList.length);
		}
	}

	const measuresParser = await loadJisonParser("./jison/measureLayout.jison");
	const lilyParser = await loadLilyParserNode();

	const failures = [];

	for (const source of sourceList) {
		console.log("Parsing", source, "...");

		try {
			const result = parse(lilyParser, measuresParser, source);
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
