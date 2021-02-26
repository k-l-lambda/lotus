
import {svgToElements} from "./svgParser";
import tokenizeElements, {StaffAttributes, HashTable} from "./tokenizeElements";
import organizeTokens from "./organizeTokens";
import LogRecorder from "../logRecorder";
import StaffToken from "./staffToken";
import SheetDocument from "./sheetDocument";
import * as StaffNotation from "./staffNotation";
import TextSource from "../textSource";
import * as domUtils from "../domUtils";
import LilyDocument from "../lilyParser/lilyDocument";
import {LilyDocumentAttribute, LilyDocumentAttributeReadOnly} from "../lilyParser/lilyDocument";
import {Scheme, SchemePair} from "../lilyParser/lilyTerms";
import {SheetPage, SheetSystem, SheetStaff, SheetMeasure} from "./sheetDocument";
import Glyph from "./glyph";



interface SvgPageParserOptions {
	lilyDocument?: LilyDocument;
	logger?: LogRecorder;
	attributes?: StaffAttributes;
	tieLocations?: {[key: string]: boolean};

	DOMParser?: any;
};


const parseSvgPage = (dom, source: string | TextSource, {
	lilyDocument,
	logger = new LogRecorder(),
	attributes,
	tieLocations,
	...options
}: SvgPageParserOptions = {}) => {
	if (!(source instanceof TextSource))
		source = new TextSource(source);

	const elem = svgToElements(dom, {logger, ...options});
	logger.append("parseSvgPage.elem", elem);

	if (!elem)
		return {structure: null, hashTable: {}};

	if (!attributes && lilyDocument)
		attributes = lilyDocument.globalAttributes({readonly: true}) as LilyDocumentAttributeReadOnly;

	const {tokens, hashTable} = tokenizeElements(elem.children, attributes, logger);

	const [x, y, width, height] = elem.viewBox.match(/[\d-.]+/g).map(Number);
	const viewBox = {x, y, width, height};

	// mark tie symbol on tokens
	if (tieLocations) {
		const tieTokens = tokens.filter(token => {
			if (token.sourcePosition) {
				const {line, start} = token.sourcePosition;
				return tieLocations[`${line}:${start}`];
			}
		});
		tieTokens.forEach(token => {
			//token.addSymbol("TIE");
			token.tied = true;
		});
		//logger.append("tieTokens:", tieTokens.map(token => token.href));
	}

	return {
		structure: organizeTokens(tokens, source, {logger, viewBox, width: elem.width, height: elem.height}),
		hashTable,
	};
};


const createSheetDocumentFromSvgs = (svgs: string[], ly: string, lilyDocument: LilyDocument, {logger, DOMParser}: {logger?: LogRecorder, DOMParser?: any} = {}): {
	doc: SheetDocument,
	hashTable: {[key: string]: object},
} => {
	const attributes = lilyDocument.globalAttributes({readonly: true}) as LilyDocumentAttributeReadOnly;

	const source = new TextSource(ly);
	const tieLocations = lilyDocument.getTiedNoteLocations2().reduce((table, loc) => ((table[`${loc[0]}:${loc[1]}`] = true), table), {});
	//logger.append("tieLocations:", Object.keys(tieLocations));

	const pages = svgs.map(svg => parseSvgPage(svg, source, {DOMParser, logger, attributes, tieLocations}));
	const doc = new SheetDocument({
		pages: pages.map(page => page.structure),
	});
	const hashTable = pages.reduce((sum, page) => ({...sum, ...page.hashTable}), {});

	postProcessSheetDocument(doc, lilyDocument);

	return {
		doc,
		hashTable,
	};
};


const postProcessSheetDocument = (sheet: SheetDocument, lilyDocument: LilyDocument) => {
	// align token id
	const interpreter = lilyDocument.interpret();
	const lilyNotation = interpreter.getNotation();
	if (lilyNotation)
		sheet.alignTokensWithNotation(lilyNotation);

	const attributes = lilyDocument.globalAttributes({readonly: true}) as LilyDocumentAttributeReadOnly;

	const schemeOption = scm => scm.findAll(SchemePair).reduce((table, item) => (table[item.left] = item.right, table), {});

	const verticalCrop = attributes["LotusOption.verticalCrop"] as Scheme;
	if (verticalCrop && verticalCrop.exp){
		const options = schemeOption(verticalCrop);
		//console.debug("options:", options);
		sheet.fitPageViewbox({verticalCrop: true, ...options});
	}

	const fitPageViewbox = attributes["LotusOption.fitPageViewbox"] as Scheme;
	if (fitPageViewbox && fitPageViewbox.exp)
		sheet.fitPageViewbox(schemeOption(fitPageViewbox));
};


const turnRawSvgWithSheetDocument = (svgText: string, page: SheetPage, {DOMParser, XMLSerializer}): string => {
	const dom = new DOMParser().parseFromString(svgText, "text/xml");

	const svg: any = dom.childNodes[0];
	svg.setAttribute("width", page.width);
	svg.setAttribute("height", page.height);
	svg.setAttribute("viewBox", `${page.viewBox.x} ${page.viewBox.y} ${page.viewBox.width} ${page.viewBox.height}`);

	const ids = page.systems.reduce((ids, system) => {
		system.staves.forEach(staff => staff.measures.forEach(measure =>
			ids.push(...measure.tokens.filter(token => token.is("NOTEHEAD")).map(token => token.href.replace(/:\d+$/, "")))));

		return ids;
	}, []);

	domUtils.traverse(dom, node => {
		switch (node.tagName) {
		case "a":
			const capture = node.getAttribute("xlink:href").match(/\d+:\d+:\d+$/);
			const id = capture && capture[0].replace(/:\d+$/, "");
			if (id && ids.includes(id))
				node.setAttribute("style", "color:transparent;");

			break;
		case "text":
			// remove lilypond engraving signature
			if (/www\.lilypond\.org/.test(node.textContent)) 
				node.parentNode.removeChild(node);

			break;
		}
	});

	return new XMLSerializer().serializeToString(dom);
};



export {
	svgToElements,
	tokenizeElements,
	organizeTokens,
	parseSvgPage,
	postProcessSheetDocument,
	turnRawSvgWithSheetDocument,
	createSheetDocumentFromSvgs,
	StaffToken,
	SheetDocument,
	SheetPage,
	SheetSystem,
	SheetStaff,
	SheetMeasure,
	StaffNotation,
	StaffAttributes,
	HashTable,
	LilyDocumentAttribute,
	LilyDocumentAttributeReadOnly,
	Glyph,
};
