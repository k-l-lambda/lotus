
import fs from "fs";
import {argv} from "yargs";

import "../env.js";
import * as ScoreMaker from "../backend/scoreMaker";
import walkDir from "../backend/walkDir";
import asyncCall from "../inc/asyncCall";



const main = async () => {
	//console.log("argv:", argv);

	/*const xml = fs.readFileSync(args[0]).toString();
	const markup = args[1] && fs.readFileSync(args[1]).toString();
	
	const ly = await ScoreMaker.xmlToLyWithMarkup(xml, undefined, markup);
	console.log("result:", ly);*/

	const markup = argv.markup ? fs.readFileSync(argv.markup).toString() : null;

	const lilyFiles = [];

	if (argv.inputXmlDir) {
		const counting = {
			success: 0,
			failure: 0,
		};

		const xmlOptions = {};

		const xmlFiles = walkDir(argv.inputXmlDir, /\.xml$/, {recursive: true});
		for (const xmlPath of xmlFiles) {
			//console.log("xmlPath:", xmlPath);
			const lyPath = xmlPath.replace(/\.\w+$/, ".ly");
			//const filename = lyPath.split("/").pop();

			try {
				const xml = fs.readFileSync(xmlPath).toString();
				const ly = await ScoreMaker.xmlToLyWithMarkup(xml, xmlOptions, markup);
	
				if (!argv.noLyWrite) {
					asyncCall(fs.writeFile, lyPath, ly).then(() => console.log(lyPath, "wrote."));
					lilyFiles.push(lyPath);
				}

				++counting.success;
			}
			catch (err) {
				console.error(err);
				console.warn("Error when converting", xmlPath);

				++counting.failure;
			}
		}

		console.log("XML to ly finished, success:", counting.success, "failure:", counting.failure);
	}

	// TODO:
};



main();
