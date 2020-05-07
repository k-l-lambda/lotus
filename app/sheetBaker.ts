
const rasterizeSvg = async (svg, canvas) => {
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


const bakeRawSvg = (svg, matchedIds, canvas) => {
	const dom = new DOMParser().parseFromString(svg, "text/xml");
	const root: any = dom.childNodes[0];
	//console.log("dom:", dom.childNodes[0]);

	// remove lilypond engraving signature
	for (const node of root.childNodes) {
		if (node.tagName === "text") {
			if (/www\.lilypond\.org/.test(node.textContent)) {
				root.removeChild(node);
				break;
			}
		}
	}

	// TODO: remove matched tokens

	const doc = root.outerHTML;

	return rasterizeSvg(doc, canvas);
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
