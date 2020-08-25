
import fs from "fs";



const main = filename => {
	fs.watchFile(filename, (curr, prev) => {
		console.log("changed:", prev.mtime, curr.mtime);
	});
};



const argv = JSON.parse(process.env.npm_config_argv);

main(argv.original[2]);



// keep inspector connected
setTimeout(() => console.log("done."), 1e+8);
