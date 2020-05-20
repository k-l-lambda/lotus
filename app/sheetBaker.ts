
import Vue from "vue";

import SheetLive from "./components/sheet-live.vue";
import SheetSigns from "./components/sheet-signs.vue";



declare class SheetDocument {};


const SheetLiveComponent = Vue.extend(SheetLive);
const SheetSignsComponent = Vue.extend(SheetSigns);


const rasterizeSvg = async (svg, canvas) => {
	const svgURL = "data:image/svg+xml," + encodeURIComponent(svg);
	//console.log("svgURL:", svgURL);
	const image: any = await new Promise((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.onerror = event => {
			console.warn("Error when loading svg image:", svgURL);
			reject(event);
		};
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
	//console.log("dom:", root, matchedIds);

	for (const node of root.childNodes) {
		switch (node.tagName) {
		case "text":
			// remove lilypond engraving signature
			if (/www\.lilypond\.org/.test(node.textContent)) 
				root.removeChild(node);

			break;
		case "a":
			// remove matched tokens
			const href = node.getAttribute("xlink:href");
			const captures = href.match(/:(\d+:\d+:\d+)$/);
			if (captures) {
				const id = captures[1];
				if (matchedIds.has(id))
					root.removeChild(node);
			}

			break;
		}
	}

	const doc = root.outerHTML;

	return rasterizeSvg(doc, canvas);
};


const bakeRawSvgs = async (svgs: string[], matchedIds: Set<string>, canvas) => {
	const urls = [];
	for (const svg of svgs)
		urls.push(await bakeRawSvg(svg, matchedIds, canvas));

	return urls;
};


const replaceSigns = (node, signDict) => {
	for (const child of node.children) {
		if (child.tagName === "use") {
			const href = child.getAttribute("xlink:href");
			if (href) {
				const id = href.substr(1);
				const sign = signDict[id];
				if (sign) {
					const newSign = sign.cloneNode(true);
					newSign.classList.add(...child.classList);

					// append styles
					if (newSign.classList.contains("staff-line") || newSign.classList.contains("line") || newSign.classList.contains("slur"))
						newSign.children[0].setAttribute("stroke", "black");

					node.insertBefore(newSign, child);
					node.removeChild(child);
				}
			}
		}
		else
			replaceSigns(child, signDict);
	}
};


const bakeLiveSheetGen = async function* ({sheetDocument, signs, hashTable, matchedIds, canvas}: {
	sheetDocument: SheetDocument,
	signs?: any,
	hashTable?: {[key: string]: any},
	matchedIds: Set<string>,
	canvas: HTMLCanvasElement,
}) {
	console.assert(!!sheetDocument, "sheetDocument is null.");
	console.assert(!!matchedIds, "matchedIds is null.");
	console.assert(!!canvas, "canvas is null.");
	console.assert(signs || hashTable, "signs & hashTable is both null.");

	const sheet = new SheetLiveComponent({
		propsData: {
			doc: sheetDocument,
		},
	}).$mount(document.createElement("div"));

	if (!signs) {
		signs = new SheetSignsComponent({
			propsData: {
				hashTable,
			},
		}).$mount(document.createElement("div"));
		console.log("signs:", signs);
	}

	const defs = signs.$el.children[0];
	const signDict = [...defs.children].reduce((dict, sign) => ((dict[sign.id] = sign), dict), {});
	//console.log("defs:", defs);

	/*const style = document.createElement("stye");
	style.innerHTML = `
		.token .staff-line line, .token .line line, .token .slur path
		{
			stroke: black;
		}
	`;*/

	const svgDoms = [...sheet.$el.children];
	for (const svg of svgDoms) {
		// not working?
		//svg.insertBefore(style.cloneNode(true), svg.firstChild);

		// remove matched tokens
		matchedIds.forEach(id => {
			const token = svg.querySelector(`g[data-href='${id}']`);
			if (token)
				token.parentElement.removeChild(token);
		});

		replaceSigns(svg, signDict);
		//console.log("svg:", svg);

		yield await rasterizeSvg(svg.outerHTML, canvas);
	};
};


const bakeLiveSheet = async options => {
	const urls = [];

	for await (const url of bakeLiveSheetGen(options))
		urls.push(url);

	return urls;
};



export {
	bakeRawSvgs,
	bakeLiveSheetGen,
	bakeLiveSheet,
};
