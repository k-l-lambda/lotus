
import * as lilyParser from "../inc/lilyParser";



let parser = null;



export default async function load () {
	if (!parser) {
		const {default: grammarURL} = await import("../inc/lilyParser/lilypond.jison");
		const grammar = await (await fetch(grammarURL)).text();
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
