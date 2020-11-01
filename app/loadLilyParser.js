
import jisonWrapperWorker from "comlink-loader!../inc/jisonWrapper";



let parser = null;



export default async function load () {
	if (!parser) {
		const t0 = performance.now();

		const {default: grammarURL} = await import("../jison/lilypond.jison");
		const grammar = await (await fetch(grammarURL)).text();
		//console.log("grammar:", grammar);

		const t1 = performance.now();

		const jisonWrapper = new jisonWrapperWorker();

		parser = await new jisonWrapper.Parser(grammar);
		//console.log("parser:", parser, parser.parse);

		const t2 = performance.now();
		console.debug("lilyParser loading cost:", t1 - t0, t2 - t1);
	}

	return parser;
};
