
import {svgToElements} from "./svgParser";
import tokenizeElements from "./tokenizeElements";
import structureTokens from "./structureTokens";



const parseSvgPage = (dom, options) => {
	const elem = svgToElements(dom, options);
	//console.log("elem:", elem);
	const {tokens, hashTable} = tokenizeElements(elem.children);

	const [x, y, width, height] = elem.viewBox.match(/[\d-.]+/g).map(Number);
	const viewBox = {x, y, width, height};

	return {
		structure: structureTokens(tokens, viewBox),
		hashTable,
		
	};
};



export {
	svgToElements,
	tokenizeElements,
	structureTokens,
	parseSvgPage,
};
