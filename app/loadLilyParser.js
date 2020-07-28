
import * as lilyParser from "../inc/lilyParser";



let parser = null;



export default async function load () {
	if (!parser) {
		const t0 = performance.now();

		const {default: grammarURL} = await import("../inc/lilyParser/lilypond.jison");
		const grammar = await (await fetch(grammarURL)).text();
		//console.log("grammar:", grammar);

		const t1 = performance.now();

		// mute jison logs during grammar loading
		lilyParser.hookJisonPrint();

		parser = lilyParser.createParser(grammar);
		if (!parser)
			console.error("lily parser create failed.");

		lilyParser.hookJisonPrint((...args) => console.log("[JISON]", ...args));

		const t2 = performance.now();
		console.debug("lilyParser loading cost:", t1 - t0, t2 - t1);
	}

	return parser;
};
