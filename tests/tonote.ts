
import fs from "fs";

import loadLilyParser from "../backend/loadLilyParserNode";
import * as lilyParser from "../inc/lilyParser";
import * as tonote from "../inc/tonote";
import {blockizeLily} from "../inc/tonote/blocker";



const main = async (sourceFile: string) => {
	console.log("tonote:", tonote);

	const parser = await loadLilyParser();

	const source = fs.readFileSync(sourceFile).toString();
	const doc = new lilyParser.LilyDocument(parser.parse(source));
	//const interpreter = doc.interpret();
	//console.log("interpreter:", interpreter);

	const song = blockizeLily(doc);
	console.log("song:", song);
};


const argv = JSON.parse(process.env.npm_config_argv);
main(argv.original[2]);



// keep inspector connected
setTimeout(() => console.log("done."), 1e+8);
