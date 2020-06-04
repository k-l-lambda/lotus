
import fs from "fs";

import {preprocessXml} from "../backend/lilyCommands";



const main = (...args) => {
	const xml = fs.readFileSync(args[0]).toString();
	const result = preprocessXml(xml);
	console.log("result:", result);
};



const argv = JSON.parse(process.env.npm_config_argv);

main(...argv.original.slice(2));



// keep inspector connected
setTimeout(() => console.log("done."), 1e+8);
