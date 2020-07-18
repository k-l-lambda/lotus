
import jison from "jison";

import LilyDocument from "./lilyDocument";
import {termDictionary, getDurationSubdivider} from "./lilyTerms";

import * as measures from "./measures";
import {createPianoRhythm} from "./pianoRhythm";



const createParser = grammar => jison.Parser(grammar);


const hookJisonPrint = (print = () => {}) => jison.print = print;


const replaceSourceToken = (source: string, token: string): string => {
	let placeholder = "";

	if (token.length < 4)
		placeholder = Array(token.length).fill(" ").join("");
	else
		placeholder = "%{" + Array(token.length - 4).fill("-").join("") + "%}";

	let result = source;
	while (result.includes(token))
		result = result.replace(token, placeholder);

	return result;
};


const LilyTerms = termDictionary;



export {
	createParser,
	hookJisonPrint,
	replaceSourceToken,
	LilyDocument,
	LilyTerms,
	getDurationSubdivider,
	measures,
	createPianoRhythm,
};
