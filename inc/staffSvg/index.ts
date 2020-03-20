
import {svgToElements} from "./svgParser";
import tokenizeElements from "./tokenizeElements";
import structureTokens from "./structureTokens";



const parseSvgPage = (dom, options) => {
	const elem = svgToElements(dom, options);
	const {tokens} = tokenizeElements(elem.children);

	return structureTokens(tokens);
};



export {
	svgToElements,
	tokenizeElements,
	structureTokens,
	parseSvgPage,
};
