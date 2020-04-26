
import fs from "fs";

import * as lilyParser from "../inc/lilyParser";
import asyncCall from "../inc/asyncCall";



let parser = null;



export default async function load () {
	if (!parser) {
		const grammar = (await asyncCall(fs.readFile, "./inc/lilyParser/lilypond.jison")).toString();

		//console.log("grammar:", grammar);

		// mute jison logs during grammar loading
		lilyParser.hookJisonPrint();

		parser = lilyParser.createParser(grammar);
		if (!parser)
			console.error("lily parser create failed.");

		lilyParser.hookJisonPrint((...args) => console.log("[JISON]", ...args));
	}

	return parser;
};
