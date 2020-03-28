
import * as _ from "lodash";

import {TOKEN_PRECISION, roundNumber} from "./utils";
import {identityHash, symbolize} from "./svgSymbols";
import StaffToken from "./staffToken";



const normalizeElement = elem => {
	const data : any = {x: null, y: null, identity: {type: elem.type}};

	switch (elem.type) {
	case "a":
	case "style":
		return null;
	case "text":
		data.x = elem.transform.translate.x;
		data.y = elem.transform.translate.y;
		data.href = elem.href;
		data.identity.text = elem.text;
		data.identity["font-size"] = elem["font-size"];

		break;
	case "line":
		data.x = elem.x1 + elem.transform.translate.x;
		data.y = elem.y1 + elem.transform.translate.y;
		data.identity.width = roundNumber((elem.x2 - elem.x1) * elem.transform.scale.x, TOKEN_PRECISION);
		data.identity.height = roundNumber((elem.y2 - elem.y1) * elem.transform.scale.y, TOKEN_PRECISION);
		data.identity["stroke-width"] = elem["stroke-width"];
		data.identity["stroke-dasharray"] = elem["stroke-dasharray"];

		if (data.identity.width === 0 && data.identity.height === 0)
			return null;

		break;
	case "rect":
		if (!elem.transform) {
			data.x = elem.x;
			data.y = elem.y;
			data.identity.width = roundNumber(elem.width, TOKEN_PRECISION, 0.1);
			data.identity.height = roundNumber(elem.height, TOKEN_PRECISION, 0.1);
		}
		else {
			data.x = elem.x + elem.transform.translate.x;
			data.y = elem.y + elem.transform.translate.y;
			data.identity.width = roundNumber(elem.width * elem.transform.scale.x, TOKEN_PRECISION, 0.1);
			data.identity.height = roundNumber(elem.height * elem.transform.scale.y, TOKEN_PRECISION, 0.1);
		}

		break;
	case "path":
		data.x = elem.transform.translate.x;
		data.y = elem.transform.translate.y;
		data.href = elem.href;
		data.identity.scale = elem.transform.scale;
		data.identity.d = elem.d;

		break;
	case "polygon":
		data.x = elem.transform.translate.x;
		data.y = elem.transform.translate.y;
		data.href = elem.href;
		data.identity.scale = elem.transform.scale;
		//data.identity.points = elem.points.split(" ").map(x => roundNumber(Number(x), TOKEN_PRECISION)).join(" ");
		data.identity.points = elem.points;
		data.identity["stroke-width"] = elem["stroke-width"];

		break;
	default:
		console.warn("unexpected element type:", elem.type, elem);
		return null;
	}

	// round position
	data.rx = roundNumber(data.x, TOKEN_PRECISION);
	data.ry = roundNumber(data.y, TOKEN_PRECISION);

	data.hash = identityHash(data.identity);

	return data;
};


// TODO: consider split arc linking line into 2 parts
const tokenizeElements = (elements, logger) => {
	const es = elements.map(normalizeElement).filter(e => e);

	logger.append("tokenizeElements", {elementCount: es.length});

	const hashTable = {};
	for (const elem of es) 
		hashTable[elem.hash] = elem.identity;

	const tokens = es.map(elem => {
		const {x, y, rx, ry, href, hash} = elem;
		return new StaffToken({
			x, y, rx, ry, href, hash,
			...symbolize(elem),
		});
	});

	logger.append("tokenizeElements.nonsymbolTokens", tokens
		.filter(token => !token.symbol)
		.map(token => ({
			..._.pick(token, ["x", "y", "rx", "ry", "href"]),
			identity: hashTable[token.hash],
		})));

	return {tokens, hashTable};
};



export default tokenizeElements;
