
import "../env.js";

import * as fs from "fs";
import {DOMParser} from "xmldom";

import * as lilyCommands from "../backend/lilyCommands";
import asyncCall from "../inc/asyncCall";



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
		for (let i = 0; i < nodes.length; ++i) {
			const node = nodes[i];
			if (targetIndex >= 0) {
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
							targetIndex = index;
						else {
							path = node.childNodes[0];
							break;
						}
					}
				}
			}
		}

		symbols.push({
			symbol,
			d: path.getAttribute("d"),
		});
	});

	return symbols;
};


const enumerate = async (templateFile = "./tools/assets/path-symbols.ly", defineFile = "./tools/assets/path-symbol-define.txt") => {
	const definitionBuffer = await asyncCall(fs.readFile, defineFile);
	const definition = definitionBuffer.toString().split("\n").map(line => line.split(",")).filter(fields => fields.length === 3)
		.map(([symbol, id, index]) => ({symbol, id, index: Number(index)}));
	//console.log("definition:", definition);

	const template = await asyncCall(fs.readFile, templateFile);
	const nodes = await testEngrave(template, 20);
	//console.log("nodes:", nodes);

	const symbols = extractSymbols(definition, nodes);
	console.log("symbols:", symbols);
};



enumerate();



// keep inspector connected
setTimeout(() => console.log("done."), 1e+8);
