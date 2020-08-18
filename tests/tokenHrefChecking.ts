
import fs from "fs";
import {DOMParser} from "xmldom";

import "../env.js";

import {engraveSvg} from "../backend/lilyCommands";
import loadLilyParser from "../backend/loadLilyParserNode";
import {LilyDocument} from "../inc/lilyParser";
import * as staffSvg from "../inc/staffSvg";
// eslint-disable-next-line
import {LilyDocumentAttributeReadOnly} from "../inc/lilyParser/lilyDocument.js";



const checkFile = async filename => {
	const source = fs.readFileSync(filename).toString();

	const lilyParser = await loadLilyParser();

	const engraving = await engraveSvg(source);

	const lilyDocument = new LilyDocument(lilyParser.parse(source));
	const attributes = lilyDocument.globalAttributes({readonly: true}) as LilyDocumentAttributeReadOnly;
	const pages = engraving.svgs.map(svg => staffSvg.parseSvgPage(svg, source, {DOMParser, attributes}).structure);
	const doc = new staffSvg.SheetDocument({pages});

	const noteheads = doc.getNoteHeads();
	const hrefs = noteheads.map(nh => nh.href);
	const hrefSet = new Set(hrefs);
	const hrefLocs = hrefs.map(href => href.match(/\d+/g));

	const interperter = lilyDocument.interpret();
	const notation = interperter.getNotation();

	const matched = [];
	const partialMatched = [];
	const crossed = [];
	const missed = [];

	notation.notes.forEach((note: any) => {
		if (hrefSet.has(note.id))
			matched.push(note.id);
		else {
			const [line, c1, c2] = note.id.match(/\d+/g);
			const loc = hrefLocs.find(loc => loc[0] === line && loc[1] === c1);
			if (loc)
				partialMatched.push([note.id, loc.join(":")]);
			else {
				const loc = hrefLocs.find(loc => loc[0] === line && loc[1] <= c2 && loc[2] >= c1);
				if (loc)
					crossed.push([note.id, loc.join(":")]);
				else
					missed.push(note.id);
			}
		}
	});

	console.log(`${filename}:`, `${matched.length} matched`, `${partialMatched.length} partial matched`);
	if (crossed.length)
		console.log("crossed:", crossed);
	if (missed.length)
		console.warn("missed:", missed);
};


const main = async (filename?: string) => {
	await checkFile(filename);
};



const argv = JSON.parse(process.env.npm_config_argv);
main(...argv.original.slice(2));



// keep inspector connected
setTimeout(() => console.log("done."), 1e+8);
