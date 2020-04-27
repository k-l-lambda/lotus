
import fs from "fs";
import path from "path";



const walkDir = (dir, pattern) => {
	const list = fs.readdirSync(dir);
	//console.log("files:", files);

	const files = list.map(filename => {
		const file = path.resolve(dir, filename);
		const stat = fs.statSync(file);

		return {file, filename, stat};
	}).filter(({filename, stat}) => !stat.isDirectory() && (!pattern || pattern.test(filename)))
		.map(({file}) => file);

	return files;
};



export default walkDir;
