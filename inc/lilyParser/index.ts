
import jison from "jison";

import LilyDocment from "./lilyDocument";



const createParser = grammar => jison.Parser(grammar);


const hookJisonPrint = (print = () => {}) => jison.print = print;



export {
	createParser,
	hookJisonPrint,
	LilyDocment,
};
