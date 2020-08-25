
import fs from "fs";
import * as diff from "diff";



const target = {
	text: null,

	init (value) {
		this.text = value;
		console.log("target:", this.text);
	},

	increment (patch) {
		this.text = diff.applyPatch(this.text, patch);
		console.log("target:", this.text);
	},
};


const main = filename => {
	let oldContent = fs.readFileSync(filename).toString();
	target.init(oldContent);

	fs.watchFile(filename, (curr, prev) => {
		console.debug("changed:", prev.mtime, curr.mtime);

		const content = fs.readFileSync(filename).toString();
		//const differ = diff.diffChars(oldContent, content);
		const patch = diff.createPatch(filename, oldContent, content);
		//console.log("patch:", patch);
		target.increment(patch);

		oldContent = content;
	});
};



const argv = JSON.parse(process.env.npm_config_argv);

main(argv.original[2]);



// keep inspector connected
setTimeout(() => console.log("done."), 1e+8);
