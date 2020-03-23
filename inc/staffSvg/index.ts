
import {svgToElements} from "./svgParser";
import tokenizeElements from "./tokenizeElements";
import structureTokens from "./structureTokens";



const parseSvgPage = (dom, options) => {
	const elem = svgToElements(dom, options);
	const {tokens, hashTable} = tokenizeElements(elem.children);

	return {
		structure: structureTokens(tokens),
		hashTable,
	};
};



export {
	svgToElements,
	tokenizeElements,
	structureTokens,
	parseSvgPage,
};
