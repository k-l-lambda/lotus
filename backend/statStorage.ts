
import fs from "fs";
import path from "path";
import YAML from "yaml";

import asyncCall from "../inc/asyncCall";



const exists = async (path: string) => new Promise(resolve => fs.access(path, err => resolve(!err)));


const appendData = async (filePath: string, data: object) => {
	const dir = path.resolve(filePath, "..");
	const filename = path.relative(dir, filePath);
	const statPath = path.resolve(dir, ".lotus_stat.yaml");

	let stat = {};
	if (await exists(statPath)) {
		const buffer = await asyncCall(fs.readFile, statPath);
		stat = YAML.parse(buffer.toString()) || stat;
	}

	stat[filename] = stat[filename] || {};
	Object.assign(stat[filename], data);

	await asyncCall(fs.writeFile, statPath, YAML.stringify(stat));
};



export {
	appendData,
};
