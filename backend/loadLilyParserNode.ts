
import fs from "fs";

import {Parser} from "../inc/jisonWrapper";
import asyncCall from "../inc/asyncCall";



let parser = null;



export default async function load () {
	if (!parser) {
		const grammar = (await asyncCall(fs.readFile, "./inc/lilyParser/lilypond.jison")).toString();

		//console.log("grammar:", grammar);

		parser = new Parser(grammar);
	}

	return parser;
};
