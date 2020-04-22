

//import lilyGrammar from "./lilypond.jison";
//console.log("lilyGrammar:", lilyGrammar);

import jison from "jison";



const createParser = grammar => new jison.Parser(grammar);


const hookJisonPrint = (print = () => {}) => jison.print = print;



export {
	createParser,
	hookJisonPrint,
};
