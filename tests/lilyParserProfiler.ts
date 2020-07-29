
import fs from "fs";
import child_process from "child-process-promise";

import * as lilyParser from "../inc/lilyParser";
import asyncCall from "../inc/asyncCall";



const testParserLoading = async (revision, times = 3) => {
	if (revision)
		child_process.spawn("git", ["checkout", revision, "./inc/lilyParser/lilypond.jison"]);

	const grammar = (await asyncCall(fs.readFile, "./inc/lilyParser/lilypond.jison")).toString();

	lilyParser.hookJisonPrint();

	const costs = [];

	try {
		for (let i = 0; i < times; ++i) {
			const t0 = Date.now();

			lilyParser.createParser(grammar);
	
			const cost = Date.now() - t0;
			costs.push(cost);
		}

		console.log("revision cost:", revision, Math.min(...costs), costs);
	}
	catch (_) {
		console.log("revison error:", revision);
	}
};



const main = async revisionList => {
	for (const revision of revisionList)
		await testParserLoading(revision);

	console.log("Done.");
};

main([null, "HEAD"]);



// keep inspector connected
setTimeout(() => console.log("done."), 1e+8);
