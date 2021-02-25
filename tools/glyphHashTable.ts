
import fs from "fs";
import {DOMParser} from "xmldom";
import sha1 from "sha1";

import * as domUtils from "../inc/domUtils";



type Dict = {[key: string]: string};


const processFontSvg = (text: string, table: Dict) => {
	const doc = new DOMParser().parseFromString(text, "text/xml");
	//console.log("doc:", doc);

	domUtils.traverse(doc, node => {
		switch (node.tagName) {
		case "glyph": {
			//console.log("glyph:", node);
			const name = node.getAttribute("glyph-name");
			const d = node.getAttribute("d");
			const hash = sha1(`[["d","${d}"],["scale",{"x":0.004,"y":-0.004}],["stroke-width",null],["type","path"]]`);

			table[hash] = name;
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
	].map(filename => {
		const svg = fs.readFileSync("./footages/" + filename).toString();
		processFontSvg(svg, table);
	});

	//console.log("table:", table);

	fs.writeFileSync("./glyphHash.json", JSON.stringify(table));
};



main();
