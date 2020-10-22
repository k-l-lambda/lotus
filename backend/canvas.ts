
//import {loadImage, createCanvas} from "canvas";
import {PNGStream} from "canvas";

const {loadImage, createCanvas}: any = process.env.MOBILE_MODE ? require("canvas") : {};



const svgToPng = async (sourceURL: string|Buffer): Promise<PNGStream> => {
	if (process.env.MOBILE_MODE)
		return;

	const image = await loadImage(sourceURL);

	const canvas = createCanvas(image.width, image.height);
	const ctx = canvas.getContext("2d");
	ctx.drawImage(image, 0, 0, image.width, image.height);

	return canvas.createPNGStream();
};



export {
	svgToPng,
};
