
import "../env.js";

import * as fs from "fs";
import {DOMParser} from "xmldom";

import * as lilyCommands from "../backend/lilyCommands";
import asyncCall from "../inc/asyncCall";
import {simplifyPath} from "../inc/staffSvg/svgSymbols";



const testEngrave = async (template, size) => {
	const source = `#(set-global-staff-size ${size})${template}`;

	const result = await lilyCommands.engraveSvg(source);
	const dom = new DOMParser().parseFromString(result.svgs[0], "text/xml");

	const nodes = dom.childNodes[0].childNodes;

	return Array.from(nodes).reduce((list: any[], node: any) => {
		switch (node.nodeName) {
		case "a":
			node.childNodes = Array.from(node.childNodes).filter((node: any) => node.nodeName === "path");
			list.push (node);

			break;
		case "path":
			list.push (node);

			break;
		case "g":
			list.push(...Array.from(node.childNodes).filter((node: any) => node.nodeName === "path"));

			break;
		}

		return list;
	}, []);
};


const extractSymbols = (definition, nodes) => {
	const symbols = [];

	definition.forEach(({symbol, id, index}) => {
		let targetIndex = null;
		let path = null;
		for (const node of nodes) {
			if (Number.isFinite(targetIndex)) {
				if (node.nodeName === "path") {
					if (targetIndex > 0)
						--targetIndex;
					else {
						path = node;
						break;
					}
				}
			}
			else {
				if (node.nodeName === "a") {
					const nodeId = node.getAttribute("xlink:href").replace("textedit:", "");
					if (nodeId === id) {
						if (index)
							targetIndex = index - 1;
						else {
							path = node.childNodes[0];
							break;
						}
					}
				}
			}
		}

		if (!path)
			console.warn("no symbol found for", symbol, id, index);
		else {
			const d = path.getAttribute("d");
			//console.log("d:", symbol, id, index, d);
	
			symbols.push({
				symbol,
				d,
			});
		}
	});

	return symbols;
};


const loadDefinition = async file => {
	const definitionBuffer = await asyncCall(fs.readFile, file);
	return definitionBuffer.toString().split("\n").map(line => line.split(",")).filter(fields => fields.length === 3)
		.map(([symbol, id, index]) => ({symbol, id, index: Number(index)}));
};


const enumerate = async (templateFile, defineFile) => {
	const definition = await loadDefinition(defineFile);

	const template = await asyncCall(fs.readFile, templateFile);

	const table = {};

	for (let size = 1; size <= 200; ++size) {
		const nodes = await testEngrave(template, size);
		const symbols = extractSymbols(definition, nodes);
		//console.log("symbols:", symbols);

		symbols.forEach(({symbol, d}) => {
			table[symbol] = table[symbol] || new Set();
			table[symbol].add(simplifyPath(d));
		});

		if (size % 10 === 0)
			console.log("enumerating ", size);
	}

	const list = Object.entries(table).map(([symbol, set]: any[]) => ({symbol, ds: Array.from(set)}));
	console.log("list:", list);

	await asyncCall(fs.writeFile, "./tools/assets/path-symbols.json", JSON.stringify(list));

	console.log("Enumeration done.");
};


const dumpSymbolTests = async (templateFile, defineFile, sizes = [1, 20, 100]) => {
	const definition = await loadDefinition(defineFile);

	const template = await asyncCall(fs.readFile, templateFile);

	for (const size of sizes) {
		const nodes = await testEngrave(template, size);
		const symbols = extractSymbols(definition, nodes);

		const elems = symbols.map((symbol, i) => `<g transform="translate(1000, ${(i + 1) * 1000})">
			<text x="2000" font-size="600">${symbol.symbol}</text>
			<path transform="scale(0.6, -0.6)" d="${symbol.d}" />
		</g>`).join("\n");
		const doc = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 ${(symbols.length + 1) * 1000}">
			${elems}
		</svg>`;

		await asyncCall(fs.writeFile, `./temp/symbol-test-${size}.svg`, doc);
	};

	console.log("Dump done.");
};


const main = async (templateFile = "./tools/assets/path-symbols.ly", defineFile = "./tools/assets/path-symbol-define.txt") => {
	//dumpSymbolTests(templateFile, defineFile);
	enumerate(templateFile, defineFile);
};



main();



// keep inspector connected
setTimeout(() => console.log("done."), 1e+8);
