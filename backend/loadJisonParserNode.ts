
import fs from "fs";

import {Parser} from "../inc/jisonWrapper";



const parsers = new Map<string, Parser>();



export default async function load (jison): Promise<Parser> {
	if (!parsers.get(jison)) {
		const grammar = (await fs.promises.readFile(jison)).toString();

		//console.log("grammar:", grammar);

		parsers.set(jison, new Parser(grammar)) ;
	}

	return parsers.get(jison);
};
