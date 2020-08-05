
import jison from "jison";



export class Parser {
	parser: any;


	constructor (grammar) {
		// mute jison logs during grammar loading
		jison.print = () => {};

		this.parser = jison.Parser(grammar);

		jison.print = (...args) => console.log("[JISON]", ...args);
	}


	parse (source) {
		//console.log("parse:", source.length);
		return this.parser.parse(source);
	}
};
