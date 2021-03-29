
import fs from "fs";

import loadJisonParser from "../backend/loadJisonParserNode";



const build = async (jison: string, target?: string): Promise<void> => {
	const parser = await loadJisonParser(jison);
	const code = parser.generate();

	if (target)
		fs.writeFileSync(target, code);
	else
		console.log("code:", code);
};


const main = async () => {
	await build("./jison/lilypond.jison", "./lib/lilyParser.js");
	await build("./jison/measureLayout.jison", "./lib/measureLayoutParser.js");

	console.log("Done.");
};



main();
