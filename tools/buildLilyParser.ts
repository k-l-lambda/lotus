
import fs from "fs";

import loadLilyParser from "../backend/loadLilyParserNode";



const main = async (target = "./lib/lilyParser.js") => {
	const lilyParser = await loadLilyParser();
	const code = lilyParser.generate();

	if (target)
		fs.writeFileSync(target, code);
	else
		console.log("code:", code);

	console.log("Done.");
};



main();
