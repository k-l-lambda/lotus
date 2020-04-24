
import sha1 from "sha1";
import fs from "fs";

import * as lilyParser from "../inc/lilyParser";



const parse = (grammar, source) => {
	const parser = lilyParser.createParser(grammar);

	return new lilyParser.LilyDocment(parser.parse(source));
};


const validate = (grammar, sourceFile) => {
	const source = fs.readFileSync(sourceFile).toString();
	const doc0 = parse(grammar, source);
	const json0 = JSON.stringify(doc0);
	const hash0 = sha1(json0);

	const source1 = doc0.toString();
	const doc1 = parse(grammar, source1);
	const json1 = JSON.stringify(doc1);
	const hash1 = sha1(json1);

	console.log("hash:", hash0, hash1);

	if (hash0 !== hash1) {
		let pos = 0;
		for (; pos < json0.length; ++pos) {
			if (json0[pos] !== json1[pos])
				break;
		}

		console.log("doc0:", json0.substr(Math.max(0, pos - 30), 80));
		console.log("doc1:", json1.substr(Math.max(0, pos - 30), 80));
	}

	return hash0 === hash1;
};


const main = sourceFile => {
	const grammar = fs.readFileSync("./inc/lilyParser/lilypond.jison").toString();

	const result = validate(grammar, sourceFile);
	console.log("result:", result);
};


const argv = JSON.parse(process.env.npm_config_argv);

main(argv.original[2]);



// keep inspector connected
//setTimeout(() => console.log("done."), 1e+8);
