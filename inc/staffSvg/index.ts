
import {svgToElements} from "./svgParser";
import tokenizeElements from "./tokenizeElements";
import organizeTokens from "./organizeTokens";
import LogRecorder from "../logRecorder";
import StaffToken from "./staffToken";
import SheetDocument from "./sheetDocument";
import {PitchContext, PitchContextTable} from "./staffNotation";
import {recoverJSON} from "../jsonRecovery";



const parseSvgPage = (dom, ly, {logger = new LogRecorder(), attributes, ...options}) => {
	const elem = svgToElements(dom, {logger, ...options});
	//console.log("elem:", elem);
	const {tokens, hashTable} = tokenizeElements(elem.children, attributes, logger);

	const [x, y, width, height] = elem.viewBox.match(/[\d-.]+/g).map(Number);
	const viewBox = {x, y, width, height};

	return {
		structure: organizeTokens(tokens, ly, {logger, viewBox, width: elem.width, height: elem.height}),
		hashTable,
	};
};


const recoverScoreJSON = text => recoverJSON(text, {StaffToken, SheetDocument});



export {
	svgToElements,
	tokenizeElements,
	organizeTokens,
	parseSvgPage,
	recoverScoreJSON,
	StaffToken,
	SheetDocument,
	PitchContext,
	PitchContextTable,
};
