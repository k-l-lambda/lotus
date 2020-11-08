
import jisonWrapperWorker from "comlink-loader!../inc/jisonWrapper";



const parsers = new Map();



export default async function load (grammarModule) {
	if (!parsers.get(grammarModule)) {
		const t0 = performance.now();

		const {default: grammarURL} = await grammarModule;
		const grammar = await (await fetch(grammarURL)).text();
		//console.log("grammar:", grammar);

		const t1 = performance.now();

		const jisonWrapper = new jisonWrapperWorker();

		parsers.set(grammarModule, await new jisonWrapper.Parser(grammar));
		//console.log("parser:", parser, parser.parse);

		const t2 = performance.now();
		console.debug("Jison parser loading cost:", t1 - t0, t2 - t1);
	}

	return parsers.get(grammarModule);
};
