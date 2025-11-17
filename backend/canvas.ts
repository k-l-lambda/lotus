
//import {loadImage, createCanvas} from "canvas";
//import type {PNGStream} from "canvas";



const svgToPng = async (sourceURL: string|Buffer): Promise<any> => {
	if (process.env.MOBILE_MODE)
		return Promise.reject(new Error("svgToPng is not supported in mobile mode."));

	// @ts-ignore - canvas is optional dependency, loaded dynamically
	const {loadImage, createCanvas} = await import("canvas");

	const image = await loadImage(sourceURL);

	const canvas = createCanvas(image.width, image.height);
	const ctx = canvas.getContext("2d");
	ctx.drawImage(image, 0, 0, image.width, image.height);

	return canvas.createPNGStream();
};



export {
	svgToPng,
};
