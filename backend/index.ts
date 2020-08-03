
import formidable from "formidable";
import {DOMParser} from "xmldom";

import * as lilyCommands from "./lilyCommands";
import * as staffSvg from "../inc/staffSvg";
import loadLilyParser from "./loadLilyParserNode";
import {LilyDocument} from "../inc/lilyParser";
import LogRecorder from "../inc/logRecorder";
import * as ScoreMaker from "./scoreMaker";



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


const service = {
	"/musicxml2ly": {
		post: (req, res) => formidableHandle("musicxml2ly", req, res,
			({xml, options}) => lilyCommands.xml2ly(xml, options && JSON.parse(options))),
	},


	"/midi2ly": {
		post: (req, res) => formidableHandle("midi2ly", req, res,
			({options}, {midi}) => lilyCommands.midi2ly(midi, options && JSON.parse(options))),
	},


	"/engrave": {
		post: (req, res) => formidableHandle("engrave", req, res,
			async ({source, tokenize = false, log = false}) => {
				const result = await lilyCommands.engraveSvg(source, {includeFolders: ["../ly"]});
				if (!tokenize)
					return JSON.stringify(result);

				const lilyParser = await loadLilyParser();
				const lilyDocument = new LilyDocument(lilyParser.parse(source));
				//const attributes = lilyDocument.globalAttributes({readonly: true});
				//console.log("attributes:", attributes);

				lilyDocument.interpret();

				const logger = new LogRecorder({enabled: log});

				const {doc, hashTable} = staffSvg.createSheetDocumentFromSvgs(result.svgs, source, lilyDocument, {logger, DOMParser});

				return JSON.stringify({
					...result,
					doc,
					hashTable,
					logger,
				});
			}),
	},
};


const setEnvironment = env => lilyCommands.setEnvironment(env);



export {
	setEnvironment,
	service,
	lilyCommands,
	ScoreMaker,
};
