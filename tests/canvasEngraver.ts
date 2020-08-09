
import fs from "fs";
import {loadImage, createCanvas} from "canvas";

// eslint-disable-next-line
import {PNGStream} from "canvas";



const svgToPng = async (sourceFile): Promise<PNGStream> => {
	const image = await loadImage(sourceFile);

	const canvas = createCanvas(800, 800);
	const ctx = canvas.getContext("2d");
	ctx.drawImage(image, 0, 0, 800, 800);

	return canvas.createPNGStream();
};


const main = async input => {
	const out = fs.createWriteStream("./test.png");
	const stream = await svgToPng(input);
	stream.pipe(out);

	out.on("finish", () =>  console.log("Done."));
};


const argv = JSON.parse(process.env.npm_config_argv);
main(argv.original[2]);
