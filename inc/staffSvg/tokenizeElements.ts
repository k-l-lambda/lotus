
import _ from "lodash";

import {POS_PRECISION, SIZE_PRECISION, STROKE_PRECISION, roundNumber, sizeToStrokeWidth1, sizeToStrokeWidth2} from "./utils";
import {identityHash, symbolize} from "./svgSymbols";
import StaffToken from "./staffToken";
import LogRecorder from "../logRecorder";



interface Position
{
	x: number;
	y: number;
};

interface Transform
{
	translate?: Position;
	scale?: Position;
};

type ElementValue = string | number | Transform | Position;

interface StaffFields {
	href: string;
	transform: Transform;
	x: number;
	y: number;
	rx: number;
	ry: number;
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	width: number;
	height: number;
	sw: number;
	sw2: number;
	scale: Position;
	["stroke-width"]: number;
};

export interface StaffElement extends Partial<StaffFields> {
	type: string,
	[key: string]: ElementValue,
};

export type HashTable = {[key: string]: StaffElement};

interface StaffElementData extends Partial<StaffFields> {
	hash?: string;
	identity: StaffElement;
};


export interface StaffAttributes
{
	staffSize: number;
};


const normalizeElement = (elem: StaffElement, attributes: StaffAttributes): StaffElementData => {
	const data: StaffElementData = {x: null, y: null, identity: {type: elem.type}};

	const basicSW1 = sizeToStrokeWidth1(attributes.staffSize);
	const basicSW2 = sizeToStrokeWidth2(attributes.staffSize);

	switch (elem.type) {
	case "a":
	case "style":
		return null;
	case "text":
		data.x = elem.transform.translate.x;
		data.y = elem.transform.translate.y;
		data.href = elem.href;
		data.identity.text = elem.text;
		data.identity.color = elem.color;
		data.identity["font-size"] = elem["font-size"];
		data.identity["font-weight"] = elem["font-weight"];
		data.identity["font-style"] = elem["font-style"];
		data.identity["text-anchor"] = elem["text-anchor"];

		break;
	case "line":
		data.x = elem.x1 + elem.transform.translate.x;
		data.y = elem.y1 + elem.transform.translate.y;
		data.identity.width = roundNumber((elem.x2 - elem.x1) * elem.transform.scale.x, SIZE_PRECISION);
		data.identity.height = roundNumber((elem.y2 - elem.y1) * elem.transform.scale.y, SIZE_PRECISION);
		data.identity["stroke-width"] = elem["stroke-width"];
		data.identity["stroke-dasharray"] = elem["stroke-dasharray"];

		if (data.identity.width === 0 && data.identity.height === 0)
			return null;

		break;
	case "rect":
		if (!elem.transform) {
			data.x = elem.x;
			data.y = elem.y;
			data.identity.width = elem.width;
			data.identity.height = elem.height;
			data.identity.rw = roundNumber(elem.width, SIZE_PRECISION);
			data.identity.rh = roundNumber(elem.height, SIZE_PRECISION);
		}
		else {
			data.x = elem.x + elem.transform.translate.x;
			data.y = elem.y + elem.transform.translate.y;
			data.identity.width = elem.width;
			data.identity.height = elem.height;
			data.identity.rw = roundNumber(elem.width * elem.transform.scale.x, SIZE_PRECISION);
			data.identity.rh = roundNumber(elem.height * elem.transform.scale.y, SIZE_PRECISION);
		}

		break;
	case "path":
		data.x = elem.transform.translate.x;
		data.y = elem.transform.translate.y;
		data.href = elem.href;
		data.identity.scale = elem.transform.scale;
		data.identity.d = elem.d;
		data.identity["stroke-width"] = elem["stroke-width"];

		break;
	case "polygon":
		data.x = elem.transform.translate.x;
		data.y = elem.transform.translate.y;
		data.href = elem.href;
		data.identity.scale = elem.transform.scale;
		//data.identity.points = elem.points.split(" ").map(x => roundNumber(Number(x), POS_PRECISION)).join(" ");
		data.identity.points = elem.points;
		data.identity["stroke-width"] = elem["stroke-width"];

		break;
	default:
		console.warn("unexpected element type:", elem.type, elem);
		return null;
	}

	// round position
	data.rx = roundNumber(data.x, POS_PRECISION);
	data.ry = roundNumber(data.y, POS_PRECISION);

	if (data.identity) {
		if (data.identity["stroke-width"])
			data.sw = roundNumber(data.identity["stroke-width"] / basicSW1, STROKE_PRECISION);
		else if (data.identity.width && data.identity.height) {
			const strokeWidth = Math.min(data.identity.width, data.identity.height);
			if (strokeWidth < 2) {
				data.sw = roundNumber(strokeWidth / basicSW1, STROKE_PRECISION);

				if (data.identity.height < data.identity.width)
					data.sw2 = roundNumber(strokeWidth / basicSW2, STROKE_PRECISION);
			}
		}
	}

	data.hash = identityHash(data.identity);

	return data;
};


// TODO: consider split arc linking line into 2 parts
const tokenizeElements = (elements: StaffElement[], attributes: StaffAttributes, logger: LogRecorder): {
	tokens: StaffToken[],
	hashTable: HashTable,
} => {
	const es = elements.map(e => normalizeElement(e, attributes)).filter(e => e);

	//logger.append("tokenizeElements", {elementCount: es.length});

	const hashTable = {};
	for (const elem of es) 
		hashTable[elem.hash] = elem.identity;

	const tokens = es.map(elem => {
		const {x, y, rx, ry, sw, href, hash} = elem;

		return new StaffToken({
			x, y, rx, ry, sw, href, hash,
			...symbolize(elem),
		});
	});

	const nonsymbolTokens = tokens
		.filter(token => !token.symbol)
		.map(token => ({
			..._.pick(token, ["x", "y", "rx", "ry", "sw", "href"]),
			identity: hashTable[token.hash],
		}));
	if (nonsymbolTokens.length)
		logger.append("tokenizeElements.nonsymbolTokens", nonsymbolTokens);

	return {tokens, hashTable};
};



export default tokenizeElements;
