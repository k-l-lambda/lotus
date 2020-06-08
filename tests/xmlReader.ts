
import fs from "fs";
import readline from "readline";



const main = path => {
	/*const reader = readline.createInterface({
		input: fs.createReadStream(path),
	});
	reader.on("line", line => {
		console.log("line:", line);
		reader.close();
		process.exit(0);
	});*/
	const stream = fs.createReadStream(path);
	stream.on("data",  chunk => {
		console.log("chunk:", chunk, chunk[0], chunk[1]);
		stream.close();

		const chunkClip = chunk.slice(0, 600);
		const utf8 = chunkClip.toString("utf8");
		const utf16 = chunkClip.toString("utf16le");

		console.log("utf8:", utf8);
		console.log("utf16:", utf16);
	});
};



const argv = JSON.parse(process.env.npm_config_argv);

main(argv.original[2]);
