
import {Writable} from "stream";
import {MusicNotation} from "@k-l-lambda/web-widgets";
import {DOMParser} from "xmldom";

import {LilyDocument, docLocationSet} from "../inc/lilyParser";
import {engraveSvg} from "./lilyCommands";
import {SingleLock} from "../inc/mutex";
import * as staffSvg from "../inc/staffSvg";
import * as LilyNotation from "../inc/lilyNotation";
import LogRecorder from "../inc/logRecorder";



type StaffArguments = {attributes: staffSvg.StaffAttributes, tieLocations?: Set<string>, briefChordLocations?: Set<string>, lyricLocations?: Set<string>};


interface EngraverOptions {
	streamSeparator: string;

	includeFolders: string[];
	withMIDI: boolean;
	withNotation: boolean;
	withLilyDoc: boolean;
	withLilyNotation: boolean;
	logger: LogRecorder;

	lilyNotation: LilyNotation.Notation;
	staffArgs: StaffArguments;
};


interface GrammarParser {
	parse (source: string): any;
};


const STREAM_SEPARATOR = "\n\n\n\n";


const advancedEngrave = async (source: string, lilyParser: GrammarParser, output: Writable, options: Partial<EngraverOptions> = {}) => {
	const {streamSeparator = STREAM_SEPARATOR} = options;

	const outputJSON = data => setImmediate(() => {
		output.write(JSON.stringify(data));
		output.write(streamSeparator);
	});

	const t0 = Date.now();

	const notatioinGen = new SingleLock<LilyNotation.Notation>(true);
	const argsGen = new SingleLock<StaffArguments>(true);

	const hashKeys = new Set<string>();

	const engraving = await engraveSvg(source, {
		includeFolders: options.includeFolders,

		// do some work during lilypond process running to save time
		onProcStart: () => {
			//console.log("tp.0:", Date.now() - t0);
			if (options.staffArgs)
				argsGen.release(options.staffArgs);

			if (!options.withLilyNotation && !options.withLilyDoc && options.staffArgs)
				return;

			const lilyDocument = new LilyDocument(lilyParser.parse(source));

			if (!options.lilyNotation) {
				const interpreter = lilyDocument.interpret();
				options.lilyNotation = interpreter.getNotation();

				notatioinGen.release(options.lilyNotation);
				//console.log("tp.1:", Date.now() - t0);
			}

			if (options.withLilyDoc)
				outputJSON({lilyDocument: lilyDocument.root});

			if (!options.staffArgs) {
				const attributes = lilyDocument.globalAttributes({readonly: true}) as staffSvg.StaffAttributes;

				const tieLocations = docLocationSet(lilyDocument.getTiedNoteLocations2());
				const briefChordLocations = docLocationSet(lilyDocument.getBriefChordLocations());
				const lyricLocations = docLocationSet(lilyDocument.getLyricLocations());

				//console.log("tp.2:", Date.now() - t0);

				options.staffArgs = {attributes, tieLocations, briefChordLocations, lyricLocations};
				argsGen.release(options.staffArgs);
				//console.log("tp.3:", Date.now() - t0);
			}
		},
		onMidiRead: async midi => {
			//console.log("tm.0:", Date.now() - t0);
			if (options.withMIDI)
				outputJSON({midi});

			if (options.withNotation && midi) {
				const midiNotation = MusicNotation.Notation.parseMidi(midi);
				outputJSON({midiNotation});
			}

			if (options.withLilyNotation && midi) {
				const lilyNotation = options.lilyNotation || await notatioinGen.wait();
				//console.log("tm.2:", Date.now() - t0);
				await LilyNotation.matchWithExactMIDI(lilyNotation, midi);
				//console.log("tm.3:", Date.now() - t0);

				outputJSON({lilyNotation});
			}

			//console.log("tm.4:", Date.now() - t0);
		},
		onSvgRead: async (index, svg) => {
			//console.log("ts.0:", index, Date.now() - t0);
			const args = options.staffArgs || await argsGen.wait();
			//console.log("ts.1:", index, Date.now() - t0);
			const page = staffSvg.parseSvgPage(svg, source, {DOMParser, logger: options.logger, ...args});

			// select incremental keys to send
			const hashTable = {};
			Object.entries(page.hashTable).forEach(([key, elem]) => {
				if (!hashKeys.has(key))
					hashTable[key] = elem;
			});

			// rectify page data by lilyNotation
			const lilyNotation = options.lilyNotation || await notatioinGen.wait();
			//console.log("ts.2:", index, Date.now() - t0);
			if (lilyNotation) {
				const sheetDocument = new staffSvg.SheetDocument({pages: [page.structure]}, {initialize: false});

				sheetDocument.alignTokensWithNotation(options.lilyNotation, {partial: true});
				sheetDocument.updateMatchedTokens(options.lilyNotation.idSet);
			}

			outputJSON({
				page: index,
				structure: page.structure,
				hashTable,
			});

			Object.keys(hashTable).forEach(key => hashKeys.add(key));

			//console.log("ts.3:", index, Date.now() - t0);
		},
	});

	const tn = Date.now();
	//console.log("tn:", tn - t0);

	options.logger.append("advancedEngraver.profile.engraving", {cost: tn - t0});

	await new Promise(resolve => setImmediate(resolve));

	output.write(JSON.stringify({
		logs: engraving.logs,
		logger: options.logger,
		errorLevel: engraving.errorLevel,
	}));
};



export {
	advancedEngrave,
};
