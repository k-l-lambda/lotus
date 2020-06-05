
import {svgToElements} from "./svgParser";
import tokenizeElements from "./tokenizeElements";
import organizeTokens from "./organizeTokens";
import LogRecorder from "../logRecorder";
import StaffToken from "./staffToken";
import SheetDocument from "./sheetDocument";
import * as StaffNotation from "./staffNotation";



const parseSvgPage = (dom, ly, {logger = new LogRecorder(), attributes, ...options}) => {
	const elem = svgToElements(dom, {logger, ...options});
	logger.append("parseSvgPage.elem", elem);

	const {tokens, hashTable} = tokenizeElements(elem.children, attributes, logger);

	const [x, y, width, height] = elem.viewBox.match(/[\d-.]+/g).map(Number);
	const viewBox = {x, y, width, height};

	return {
		structure: organizeTokens(tokens, ly, {logger, viewBox, width: elem.width, height: elem.height}),
		hashTable,
	};
};


// eslint-disable-next-line
declare class LilyDocument {
	globalAttributes(options: {readonly?: boolean});
}


const createSheetDocumentFromSvgs = (svgs: string[], ly: string, lilyDocument: LilyDocument, {logger, DOMParser}: {logger?: LogRecorder, DOMParser?: any} = {}): {
	doc: SheetDocument,
	hashTable: {[key: string]: object},
} => {
	const attributes = lilyDocument.globalAttributes({readonly: true});

	const pages = svgs.map(svg => parseSvgPage(svg, ly, {DOMParser, logger, attributes}));
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
