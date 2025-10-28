
import {Parser as JisonParser} from "../inc/jisonWrapper";



const parsers = new Map();



export default async function load (grammarModule) {
	if (!parsers.get(grammarModule)) {
		const t0 = performance.now();

		const {default: grammarURL} = await grammarModule;
		const grammar = await (await fetch(grammarURL)).text();

		const t1 = performance.now();

		parsers.set(grammarModule, new JisonParser(grammar));

		const t2 = performance.now();
		console.debug("Jison parser loading cost:", t1 - t0, t2 - t1);
	}

	return parsers.get(grammarModule);
};
