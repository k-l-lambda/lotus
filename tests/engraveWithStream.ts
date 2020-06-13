
import fs from "fs";

import "../env.js";
import {engraveSvgWithStream} from "../backend/lilyCommands";



const main = async (...args) => {
	const ly = fs.readFileSync(args[0]).toString();
	await engraveSvgWithStream(ly, process.stdout);
};



const argv = JSON.parse(process.env.npm_config_argv);

main(...argv.original.slice(2));



// keep inspector connected
setTimeout(() => console.log("done."), 1e+8);
