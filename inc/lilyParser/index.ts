

//import lilyGrammar from "./lilypond.jison";
//console.log("lilyGrammar:", lilyGrammar);

const jison = require("jison");



const createParser = grammar => new jison.Parser(grammar);



export {
	createParser,
};
