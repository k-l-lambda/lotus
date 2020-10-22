
import fs from "fs";

import "../env.js";
import {engraveSvgWithStream, setEnvironment} from "../backend/lilyCommands";



setEnvironment(process.env);


const main = async (...args) => {
	const ly = fs.readFileSync(args[0]).toString();
	const result = await engraveSvgWithStream(ly, process.stdout);

	console.log("Done:", result);
};



const argv = JSON.parse(process.env.npm_config_argv);

main(...argv.original.slice(2));



// keep inspector connected
setTimeout(() => console.log("done."), 1e+8);
