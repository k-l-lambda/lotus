
import * as formidable from "formidable";
import {DOMParser} from "xmldom";

import * as lilyCommands from "./lilyCommands";
import * as staffSvg from "../inc/staffSvg";



const formidableHandle = (name, req, res, handle) =>
	new formidable.IncomingForm().parse(req, async (err, fields, files) => {
		try {
			if (err)
				throw err;

			const result = await handle(fields, files);

			const resultObj = (typeof result === "string" || result instanceof Buffer) ? {body: result} : result;

			res.writeHead(resultObj.body ? 200 : 404, resultObj.header);
			res.write(resultObj.body);
			res.end();
		}
		catch (error) {
			console.error(`${name} error:`, error);

			res.writeHead(500);
			res.write(error.toString());
			res.end();
		}
	});



export default {
	"/musicxml2ly": {
		post: (req, res) => formidableHandle("musicxml2ly", req, res,
			({xml}) => lilyCommands.xml2ly(xml)),
	},


	"/engrave": {
		post: (req, res) => formidableHandle("engrave", req, res,
			async ({source, tokenize = false}) => {
				const result = await lilyCommands.engraveSvg(source);
				if (!tokenize)
					return JSON.stringify(result);

				const pages = result.svgs.map(svg => staffSvg.parseSvgPage(svg, {DOMParser}));
				const structure = {
					pages: pages.map(page => page.structure),
				};
				const hashTable = pages.reduce((sum, item) => ({...sum, ...item.hashTable}), {});

				return JSON.stringify({
					...result,
					structure,
					hashTable,
				});
			}),
	},
};
