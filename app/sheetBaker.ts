
const bakeRawSvg = async (svg, matchedIds, canvas) => {
	// TODO: remove matched tokens, remove lilyond engraving signature

	const svgURL = "data:image/svg+xml," + encodeURIComponent(svg);
	const image: any = await new Promise(resolve => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.src = svgURL;
	});

	canvas.width = image.width;
	canvas.height = image.height;

	const context = canvas.getContext("2d");
	context.drawImage(image, 0, 0);

	const blob = await new Promise(resolve => canvas.toBlob(blob => resolve(blob), "image/png"));
	//console.log("blob:", blob);

	return URL.createObjectURL(blob);
};


const bakeRawSvgs = async (svgs: string[], matchedIds: Set<string>, canvas) => {
	const urls = [];
	for (const svg of svgs)
		urls.push(await bakeRawSvg(svg, matchedIds, canvas));

	return urls;
};



export {
	bakeRawSvgs,
};
