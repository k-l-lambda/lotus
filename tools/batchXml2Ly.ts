
import "../env.js";

import child_process from "child-process-promise";

import walkDir from "../backend/walkDir";
//import {xml2ly} from "../backend/lilyCommands";



const LILYPOND_DIR = process.env.LILYPOND_DIR;


const main = directory => {
	const files = walkDir(directory, /\.xml$/);
	//console.log("files:", files);

	files.forEach(file => {
		//const filename = file.split("/").pop();
		console.log("process:", file);

		child_process.exec(`cd ${directory} && ${LILYPOND_DIR}musicxml2ly ${file}`);
	});
};



const argv = JSON.parse(process.env.npm_config_argv);
//console.log("argv:", argv);

main(argv.original[2]);
