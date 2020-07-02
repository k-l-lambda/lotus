
import {svgToElements} from "./svgParser";
import tokenizeElements from "./tokenizeElements";
import organizeTokens from "./organizeTokens";
import LogRecorder from "../logRecorder";
import StaffToken from "./staffToken";
import SheetDocument from "./sheetDocument";
import * as StaffNotation from "./staffNotation";
import TextSource from "../textSource";
// eslint-disable-next-line
import LilyDocument from "../lilyParser/lilyDocument";



const parseSvgPage = (dom, source: string | TextSource, lilyDocument: LilyDocument, {logger = new LogRecorder(), attributes, ...options}) => {
	if (!(source instanceof TextSource))
		source = new TextSource(source);

	const elem = svgToElements(dom, {logger, ...options});
	logger.append("parseSvgPage.elem", elem);

	if (!elem)
		return {structure: null, hashTable: {}};

	if (!attributes && lilyDocument)
		attributes = lilyDocument.globalAttributes({readonly: true});

	const {tokens, hashTable} = tokenizeElements(elem.children, attributes, logger);

	const [x, y, width, height] = elem.viewBox.match(/[\d-.]+/g).map(Number);
	const viewBox = {x, y, width, height};

	// mark tie symbol on tokens
	const tieLocations = lilyDocument.getTiedNoteLocations(source).reduce((table, loc) => ((table[`${loc[0]}:${loc[1]}`] = true), table), {});
	tokens.forEach(token => {
		if (token.sourcePosition) {
			const {line, start} = token.sourcePosition;
			if (tieLocations[`${line}:${start}`])
				token.addSymbol("TIE");
		}
	});

	return {
		structure: organizeTokens(tokens, source, {logger, viewBox, width: elem.width, height: elem.height}),
		hashTable,
	};
};


const createSheetDocumentFromSvgs = (svgs: string[], ly: string, lilyDocument: LilyDocument, {logger, DOMParser}: {logger?: LogRecorder, DOMParser?: any} = {}): {
	doc: SheetDocument,
	hashTable: {[key: string]: object},
} => {
	const attributes = lilyDocument.globalAttributes({readonly: true});

	const source = new TextSource(ly);

	const pages = svgs.map(svg => parseSvgPage(svg, source, lilyDocument, {DOMParser, logger, attributes}));
	const doc = new SheetDocument({
		pages: pages.map(page => page.structure),
	});
	const hashTable = pages.reduce((sum, page) => ({...sum, ...page.hashTable}), {});

	return {
		doc,
		hashTable,
	};
};



export {
	svgToElements,
	tokenizeElements,
	organizeTokens,
	parseSvgPage,
	createSheetDocumentFromSvgs,
	StaffToken,
	SheetDocument,
	StaffNotation,
};
