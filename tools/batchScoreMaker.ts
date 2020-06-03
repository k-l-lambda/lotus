
import fs from "fs";

import "../env.js";
import * as ScoreMaker from "../backend/scoreMaker";



const main = async (...args) => {
	//console.log("args:", args);

	const xml = fs.readFileSync(args[0]).toString();
	const markup = args[1] && fs.readFileSync(args[1]).toString();
	
	const ly = await ScoreMaker.xmlToLyWithMarkup(xml, undefined, markup);
	console.log("result:", ly);
};



const argv = JSON.parse(process.env.npm_config_argv);

main(...argv.original.slice(2));
