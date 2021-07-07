
import fs from "fs";

import "../env.js";

import walkDir from "../backend/walkDir";
import loadLilyParser from "../backend/loadLilyParserNode";
import * as lilyParser from "../inc/lilyParser";
import * as tonote from "../inc/tonote";



const parseLy = (parser, sourceFile) => {
	const source = fs.readFileSync(sourceFile).toString();

	return new lilyParser.LilyDocument(parser.parse(source));
};


const convertMelodies = async (directory: string, outputPath: string) => {
	const parser = await loadLilyParser();

	const output = fs.createWriteStream(outputPath, {flags: "a"});

	const files = walkDir(directory, /\.ly$/, {recursive: true});
	//console.log("files:", files);

	files.forEach(file => {
		//const filename = file.split("/").pop();
		console.log("process:", file);

		try {
			const doc = parseLy(parser, file);
			const song = tonote.blockizeLily(doc);
			const melody = tonote.melodySeriesFromSong(song);
	
			//console.log("melody:", melody);
	
			output.write(melody.join(" "));
			output.write("\n");
		}
		catch (err) {
			console.warn("failed to convert file:", err);
		}
	});
};



const argv = JSON.parse(process.env.npm_config_argv);
//console.log("argv:", argv);

convertMelodies(argv.original[2], argv.original[3]);
