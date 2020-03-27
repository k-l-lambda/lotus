
import {svgToElements} from "./svgParser";
import tokenizeElements from "./tokenizeElements";
import organizeTokens from "./organizeTokens";
import LogRecorder from "../logRecorder";



const parseSvgPage = (dom, {logger = new LogRecorder(), ...options}) => {
	const elem = svgToElements(dom, {logger, ...options});
	//console.log("elem:", elem);
	const {tokens, hashTable} = tokenizeElements(elem.children, logger);

	const [x, y, width, height] = elem.viewBox.match(/[\d-.]+/g).map(Number);
	const viewBox = {x, y, width, height};

	return {
		structure: organizeTokens(tokens, {logger, viewBox, width: elem.width, height: elem.height}),
		hashTable,
	};
};



export {
	svgToElements,
	tokenizeElements,
	organizeTokens,
	parseSvgPage,
};
