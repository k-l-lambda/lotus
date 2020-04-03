
import "../env.js";

import fs from "fs";
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
			node.childNodes = Array.from(node.childNodes)
				.filter((node: any) => ["path", "g"].includes(node.nodeName))
				.reduce((nodes: any[], node: any) => {
					if (node.nodeName === "g")
						nodes.push(...Array.from(node.childNodes).filter((node: any) => node.nodeName === "path"));
					else
						nodes.push(node);

					return nodes;
				}, []);
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

		if (!id)
			path = nodes[index];
		else {
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
							if (index > 0)
								targetIndex = index - 1;
							else {
								path = node.childNodes[-index];
								break;
							}
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
	return definitionBuffer.toString().split("\n")
		.filter(line => !/^#/.test(line))
		.map(line => line.split(","))
		.filter(fields => fields.length === 3)
		.map(([symbol, id, index]) => ({symbol, id, index: Number(index)}));
};


const enumerate = async (templateFile, defineFile, sizeRange = [0.5, 30, 0.5]) => {
	const definition = await loadDefinition(defineFile);

	const template = await asyncCall(fs.readFile, templateFile);

	const table = {};
	let lastTotal: any = 0;

	const libraryFileName = "./inc/staffSvg/path-symbols.json";
	const libaray = await asyncCall(fs.readFile, libraryFileName);
	if (libaray) {
		const data = JSON.parse(libaray);
		data.forEach(item => table[item.symbol] = new Set(item.ds));

		lastTotal = Object.values(table).reduce((sum: number, set: any) => sum + set.size, 0);
		console.log("Library size:", lastTotal);
	}
	//console.log("table:", table, lastTotal);

	for (let size = sizeRange[0]; size <= sizeRange[1]; size += sizeRange[2]) {
		const nodes = await testEngrave(template, size);
		const symbols = extractSymbols(definition, nodes);
		//console.log("symbols:", symbols);

		symbols.forEach(({symbol, d}) => {
			table[symbol] = table[symbol] || new Set();
			table[symbol].add(simplifyPath(d));
		});

		const total = Object.values(table).reduce((sum: number, set: any) => sum + set.size, 0);
		if (total > lastTotal) {
			console.log("enumerating:", size, total);
			lastTotal = total;
		}

		//if (size % 10 === 0)
		//	console.log("enumerating ", size);
	}

	const list = Object.entries(table).map(([symbol, set]: any[]) => ({symbol, ds: Array.from(set)}));
	console.log("list:", list);

	await asyncCall(fs.writeFile, libraryFileName, JSON.stringify(list));

	console.log("Enumeration done.");
};


const dumpSymbolTests = async (templateFile, defineFile, sizes = [1, 20, 100]) => {
	const definition = await loadDefinition(defineFile);

	const template = await asyncCall(fs.readFile, templateFile);

	for (const size of sizes) {
		const nodes = await testEngrave(template, size);
		//console.log("nodes:", nodes);
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


const main = async (templateFile = "./tools/assets/path-symbols.ly", defineFile = "./tools/assets/path-symbol-define.csv") => {
	dumpSymbolTests(templateFile, defineFile, [22.7288571429]);
	//enumerate(templateFile, defineFile);
};



main();



// keep inspector connected
setTimeout(() => console.log("done."), 1e+8);
