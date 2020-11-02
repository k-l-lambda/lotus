
import {Writable} from "stream";
import {MusicNotation} from "@k-l-lambda/web-widgets";
import {DOMParser} from "xmldom";

import {LilyDocument} from "../inc/lilyParser";
import {engraveSvg} from "./lilyCommands";
import {LilyDocumentAttributeReadOnly} from "../inc/lilyParser/lilyDocument";
import {SingleLock} from "../inc/mutex";
import * as staffSvg from "../inc/staffSvg";
import LogRecorder from "../inc/logRecorder";



interface EngraverOptions {
	includeFolders: string[];
	withMIDI: boolean;
	withNotation: boolean;
	withLilyDoc: boolean;
	logger: LogRecorder;
};


interface GrammarParser {
	parse (source: string): any;
};


const STREAM_SEPARATOR = "\n\n\n\n";


const advancedEngrave = async (source: string, lilyParser: GrammarParser, output: Writable, options: Partial<EngraverOptions> = {}) => {
	const outputJSON = data => {
		output.write(JSON.stringify(data));
		output.write(STREAM_SEPARATOR);
	};

	type ParserArguments = {attributes: LilyDocumentAttributeReadOnly, tieLocations: {[key: string]: boolean}};

	const argsGen = new SingleLock<ParserArguments>(true);

	const hashKeys = new Set<string>();

	const engraving = await engraveSvg(source, {
		includeFolders: options.includeFolders,

		// do some work during lilypond process running to save time
		onProcStart: () => {
			//console.log("tp.0:", Date.now() - t0);
			const lilyDocument = new LilyDocument(lilyParser.parse(source));
			lilyDocument.interpret();

			const attributes = lilyDocument.globalAttributes({readonly: true}) as LilyDocumentAttributeReadOnly;

			const tieLocations = lilyDocument.getTiedNoteLocations2()
				.reduce((table, loc) => ((table[`${loc[0]}:${loc[1]}`] = true), table), {});

			if (options.withLilyDoc)
				outputJSON({lilyDocument: lilyDocument.root});

			argsGen.release({attributes, tieLocations});
		},
		onMidiRead: midi => {
			//console.log("tm.0:", Date.now() - t0);
			if (options.withMIDI)
				outputJSON({midi});

			if (options.withNotation && midi) {
				const midiNotation = MusicNotation.Notation.parseMidi(midi);
				outputJSON({midiNotation});
			}
			//console.log("tm.1:", Date.now() - t0);
		},
		onSvgRead: async (index, svg) => {
			//console.log("ts.0:", Date.now() - t0);
			const args = await argsGen.wait();
			const page = staffSvg.parseSvgPage(svg, source, {DOMParser, logger: options.logger, ...args});

			// select incremental keys to send
			const hashTable = {};
			Object.entries(page.hashTable).forEach(([key, elem]) => {
				if (!hashKeys.has(key))
					hashTable[key] = elem;
			});

			outputJSON({
				page: index,
				structure: page.structure,
				hashTable,
			});

			Object.keys(hashTable).forEach(key => hashKeys.add(key));

			//console.log("ts.1:", Date.now() - t0);
		},
	});

	outputJSON({
		logs: engraving.logs,
		logger: options.logger,
		errorLevel: engraving.errorLevel,
	});
};



export {
	advancedEngrave,
};
