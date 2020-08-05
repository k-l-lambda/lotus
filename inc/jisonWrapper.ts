
import jison from "jison";



export class Parser {
	parser: any;


	constructor (grammar) {
		// mute jison logs during grammar loading
		const logs = [];
		jison.print = log => logs.push(log);

		this.parser = jison.Parser(grammar);
		if (!this.parser) {
			console.warn("jison logs:", logs);
			throw new Error("jison parser loading failed");
		}

		jison.print = (...args) => console.log("[JISON]", ...args);
	}


	parse (source) {
		//console.log("parse:", source.length);
		return this.parser.parse(source);
	}
};
