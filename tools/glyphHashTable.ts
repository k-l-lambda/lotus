
import fs from "fs";
import {DOMParser} from "xmldom";
import sha1 from "sha1";

import * as domUtils from "../inc/domUtils";



type Dict = {[key: string]: string};


const NORMAL_SCALE = 0.004;
const MINOR_SCALE = 0.0028;
const TINY_SCALE = 0.0022;


const processFontSvg = (text: string, table: Dict) => {
	const doc = new DOMParser().parseFromString(text, "text/xml");
	//console.log("doc:", doc);

	domUtils.traverse(doc, node => {
		switch (node.tagName) {
		case "glyph": {
			//console.log("glyph:", node);
			const name = node.getAttribute("glyph-name");
			const d = node.getAttribute("d");
			const unicode = node.getAttribute("unicode");

			const scales = [NORMAL_SCALE];
			if (/^noteheads/.test(name))
				scales.push(MINOR_SCALE);
			if (/^\d$/.test(unicode))
				scales.push(TINY_SCALE);

			scales.forEach(scale => {
				const hash = sha1(JSON.stringify([["d",d],["scale",{x:scale,y:-scale}],["stroke-width",null],["type","path"]]));

				if (!table[hash] || name < table[hash])
					table[hash] = name;
			});
		}

			break;
		}
	});
};


const main = () => {
	const table = {};

	[
		"emmentaler-11.svg",
		"emmentaler-13.svg",
		"emmentaler-14.svg",
		"emmentaler-16.svg",
		"emmentaler-18.svg",
		"emmentaler-20.svg",
		"emmentaler-23.svg",
		"emmentaler-26.svg",
		"ly2.21/emmentaler-11.svg",
		"ly2.21/emmentaler-13.svg",
		"ly2.21/emmentaler-14.svg",
		"ly2.21/emmentaler-16.svg",
		"ly2.21/emmentaler-18.svg",
		"ly2.21/emmentaler-20.svg",
		"ly2.21/emmentaler-23.svg",
		"ly2.21/emmentaler-26.svg",
	].map(filename => {
		const svg = fs.readFileSync("./footages/" + filename).toString();
		processFontSvg(svg, table);
	});

	//console.log("table:", table);

	fs.writeFileSync("./glyph-hash.json", JSON.stringify(table));
};



main();
