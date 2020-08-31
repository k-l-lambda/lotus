
import {loadImage, createCanvas} from "canvas";
// eslint-disable-next-line
import {PNGStream} from "canvas";



const svgToPng = async (sourceURL: string|Buffer): Promise<PNGStream> => {
	const image = await loadImage(sourceURL);

	const canvas = createCanvas(image.width, image.height);
	const ctx = canvas.getContext("2d");
	ctx.drawImage(image, 0, 0, image.width, image.height);

	return canvas.createPNGStream();
};



export {
	svgToPng,
};
