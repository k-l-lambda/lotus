
import fs from "fs";
import {DOMParser} from "xmldom";

import "../env.js";

import {engraveSvg, emptyCache} from "../backend/lilyCommands";
import loadLilyParser from "../backend/loadLilyParserNode";
import {LilyDocument} from "../inc/lilyParser";
import * as staffSvg from "../inc/staffSvg";
import walkDir from "../backend/walkDir";
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
	const hrefLocs = hrefs.map(href => href.match(/\d+/g).map(Number));

	const interpreter = lilyDocument.interpret();
	const notation = interpreter.getNotation();
	const notes = notation.toAbsoluteNotes();

	const matched = [];
	const partialMatched = [];
	//const crossed = [];
	const collided = [];
	const missed = [];

	notes.forEach(note => {
		if (hrefSet.has(note.id)) {
			matched.push(note.id);
			hrefSet.delete(note.id);
		}
		else {
			const [line, c1] = note.id.match(/\d+/g).map(Number);
			const loc = hrefLocs.find(loc => loc[0] === line && loc[1] === c1);
			if (loc) {
				const href = loc.join(":");
				partialMatched.push([note.id, href]);
				hrefSet.delete(href);
			}
			else {
				/*const loc = hrefLocs.find(loc => loc[0] === line && loc[1] <= c2 && loc[2] >= c1);
				if (loc)
					crossed.push([note.id, loc.join(":")]);
				else
					missed.push(note.id);*/
				const collidedNote = notes.find(n => n !== note && n.startTick === note.startTick && n.pitch === note.pitch);
				if (collidedNote)
					collided.push(note.id);
				else
					missed.push(note.id);
			}
		}
	});

	console.log(`${filename}:`, `${matched.length} matched`, `${partialMatched.length} partial matched`, `${collided.length} collided.`);
	//if (crossed.length)
	//	console.log("crossed:", crossed);
	if (missed.length)
		console.warn("missed:", missed);

	if (hrefSet.size)
		console.warn("omit:", Array.from(hrefSet));
};


const main = async (inputDir?: string) => {
	const lyFiles = walkDir(inputDir, /\.ly$/, {recursive: true});

	let i = 0;
	for (const lyFile of lyFiles) {
		try {
			await checkFile(lyFile);
		}
		catch (err) {
			console.warn("checkFile error:", err);
		}

		if (++i % 20 === 0)
			await emptyCache();
	}

	console.log("Done.");
};



const argv = JSON.parse(process.env.npm_config_argv);
main(...argv.original.slice(2));



// keep inspector connected
setTimeout(() => console.log("done."), 1e+8);
