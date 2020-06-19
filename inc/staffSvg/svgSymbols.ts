
import sha1 from "sha1";

import {NOTEHEAD_BASE_SCALE, POS_PRECISION, roundNumber} from "./utils";
import pathSymbols from "./path-symbols.json";



const identityHash = obj => {
	const identityArray = Object.entries(obj).sort(([k1], [k2]) => k1 > k2 ? 1 : -1);
	return sha1(JSON.stringify(identityArray));
};


const identitySymbol = (symbol, obj) => {
	const hash = identityHash(obj);

	return elem => {
		if (elem.hash === hash)
			return {symbol};
	};
};


/*const pathSymbol = (symbol, d) => elem => {
	if (elem.identity.d === d)
		return {symbol};
};*/


const simplifyPath = d => d.replace(/\s+/g, " ").replace(/\d/g, "");


const pointsSize = points => points.split(" ").length;


const pathFrameSymbol = (symbol, frame) => elem => {
	if (elem.identity.type === "path" && simplifyPath(elem.identity.d) === frame)
		return {symbol};
};


const pathFramesSymbol = (symbol, frames) => elem => {
	if (elem.identity.type === "path" && frames.includes(simplifyPath(elem.identity.d)))
		return {symbol};
};


const elemScale = (elem, scale: number) => elem.identity.scale
	&& (Math.abs(elem.identity.scale.x) === scale)
	&& (Math.abs(elem.identity.scale.y) === scale);


/*const pathFramesScaleSymbol = (symbol, frames, scale) => elem => {
	if (elem.identity.type === "path"
		&& frames.includes(simplifyPath(elem.identity.d))
		&& elemScale(elem, scale))
		return {symbol};
};*/


const conditionSymbol = (symbol, condition, fields: (any) => object = () => ({})) => elem => {
	if (condition(elem))
		return {symbol, ...fields(elem)};
};


const symbolRules = [
	pathFramesSymbol("NOTE NOTEHEAD CROSS", [
		"M163 31l125 101c2 2 5 3 8 3s6 -1 8 -3l18 -14c3 -2 4 -6 4 -10s-1 -8 -4 -10l-121 -98l121 -98c3 -2 4 -6 4 -10s-1 -8 -4 -10l-18 -14c-2 -2 -5 -3 -8 -3s-6 1 -8 3l-125 101l-125 -101c-2 -2 -5 -3 -8 -3s-6 1 -8 3l-17 14c-3 2 -5 6 -5 10s2 8 5 10l120 98l-120 98		c-3 2 -5 6 -5 10s2 8 5 10l17 14c2 2 5 3 8 3s6 -1 8 -3z",
	].map(simplifyPath)),

	pathFramesSymbol("NOTE REST", [
		"M510 -22h-645c-12 0 -21 10 -21 22s9 22 21 22h135v126c0 4 4 8 8 8h359c4 0 8 -4 8 -8v-126h135c12 0 21 -10 21 -22s-9 -22 -21 -22z",
	].map(simplifyPath)),

	pathFramesSymbol("TR", [
		"M-300 227c0 -23 18 -32 41 -32c40 0 72 14 104 28l5 28c-23 17 -50 29 -82 29c-33 0 -68 -17 -68 -53zM-26 103c0 -61 -47 -113 -98 -113c-39 0 -56 43 -56 90c0 14 1 28 4 41l16 78c-32 -13 -63 -25 -103 -25c-34 0 -59 17 -59 49c0 50 47 78 94 78c31 0 59 -10 83 -25		l47 234c6 -3 13 -5 20 -5c22 0 48 16 68 35l-54 -268l66 36c26 14 51 21 74 21c29 0 53 -11 64 -30c17 21 44 32 70 32c35 0 67 -20 67 -66c0 -44 -27 -89 -64 -89c-25 0 -37 22 -37 48c0 41 28 63 59 63h4c-8 14 -23 21 -38 21c-25 0 -51 -16 -57 -45l-53 -269		c-11 7 -25 10 -39 10s-29 -3 -43 -10l54 269v6c0 16 -13 27 -30 27c-7 0 -15 -2 -23 -6l-79 -44l-7 -35c27 -31 50 -66 50 -108zM-84 39c23 0 36 33 36 61c0 31 -15 57 -34 81l-6 -30c-4 -18 -12 -54 -12 -81c0 -18 4 -31 16 -31z",
	].map(simplifyPath)),

	conditionSymbol("MEASURE_SEPARATOR", elem => elem.identity.type === "rect"
		&& elem.sw === 0.19 && (elem.identity.rh === 4.05 || elem.identity.rh === 4)),
	conditionSymbol("MEASURE_SEPARATOR BOLD", elem => elem.identity.type === "rect"
		&& elem.sw === 0.6 && (elem.identity.rh === 4.05 || elem.identity.rh === 4)),

	pathFramesSymbol("BRACE", [
		"M- -c - - - - -c -  -  -c - - - - -c-  -  - c     c  -  - c-  -  - s   c     c  -  - c      c   -  -c- - - - - -c -  -  -c - - - - -c -  -  -z",
		"M- -c - - - - -c -  -  -c - - - - -c-  -  - c     c  -  - vvc     c  -  - c     c   -  - c- - - - - -c -  -  -c - - - - -c -  -  -z",
		"M- -c - - - - -c -  -  -c - - - - -c-  -  - c     c  -  - c  -  - s   c     c  -  - c      c   -  -c- - - - - -c -  -  -c - - - - -c -  -  -z",
		"M- -c - - - - -c -  -  -c - - - - -c-  -  - c     c  -  - c-  -  - s   c     c  -  - c     c   -  -c- - - - - -c -  -  -c - - - - -c -  -  -z",
	]),
	pathFramesSymbol("BRACE", [
		"M-15 -495c0 -261 -102 -516 -102 -762c0 -135 30 -258 129 -357c3 -3 3 -9 3 -12c0 -9 -6 -15 -15 -15c-3 0 -9 0 -12 3c-132 132 -177 312 -177 498c0 267 108 525 108 777c0 135 -33 258 -129 357c-3 3 -3 3 -3 6s0 3 3 6c96 99 129 222 129 357		c0 252 -108 510 -108 777c0 186 45 366 177 498c3 3 9 3 12 3c9 0 15 -6 15 -15c0 -3 0 -9 -3 -12c-99 -99 -129 -222 -129 -357c0 -246 102 -501 102 -762c0 -186 -48 -363 -174 -495c126 -132 174 -309 174 -495z",
		"M-15 -537c0 -285 -111 -561 -111 -831c0 -147 36 -282 138 -390c3 -3 6 -9 6 -12c0 -9 -9 -18 -18 -18c-3 0 -9 3 -12 6c-138 147 -186 339 -186 540c0 291 114 570 114 846c0 144 -33 279 -135 387c-3 3 -3 6 -3 9s0 6 3 9c102 108 135 243 135 387		c0 276 -114 555 -114 846c0 201 48 393 186 540c3 3 9 6 12 6c9 0 18 -9 18 -18c0 -3 -3 -9 -6 -12c-102 -108 -138 -243 -138 -390c0 -270 111 -546 111 -831c0 -198 -45 -390 -180 -537c135 -147 180 -339 180 -537z",
	].map(simplifyPath)),

	pathFramesSymbol("SLUR DOWN", [
		"M1.5028 -0.8074C2.4307 0.0391 5.9413 0.0391 6.8692 -0.8074L6.8692 -0.8074C5.9413 -0.0896 2.4307 -0.0896 1.5028 -0.8074z",
		"M1.5806 -0.0000C2.6617 0.9012 7.7937 0.9012 8.8748 -0.0000L8.8748 -0.0000C7.7937 0.7724 2.6617 0.7724 1.5806 -0.0000z",
	].map(simplifyPath)),
	pathFramesSymbol("SLUR UP", [
		"M1.6331 0.7750C2.7048 -0.1232 7.7198 -0.1232 8.7915 0.7750L8.7915 0.7750C7.7198 0.0055 2.7048 0.0055 1.6331 0.7750z",
		"M1.2172 -3.2497C3.8915 -5.3756 29.8558 -8.0703 32.9096 -6.5389L32.9096 -6.5389C29.8641 -7.9902 3.8998 -5.2954 1.2172 -3.2497z",
		"M0.8860 0.2500C1.9483 -0.6211 6.8471 -0.6211 7.9093 0.2500L7.9093 0.2500C6.8471 -0.5405 1.9483 -0.5405 0.8860 0.2500z",
	].map(simplifyPath)),
	pathFramesSymbol("SLUR",[
		"M. -.C. -. . -. . -.C. -. . -. . -.z",
		"M. .C. . . . . .C. . . . . .z",
	]),

	conditionSymbol("STAVES_CONNECTION",
		elem => elem.identity.type === "rect" && elem.sw === 0.16 && elem.identity.height >= 10,
		elem => ({height: elem.identity.height})),

	conditionSymbol("VERTICAL_LINE", elem => elem.identity.type === "rect"
		&& (elem.sw === 0.19 || elem.sw === 0.6) && elem.identity.height >= 1),

	conditionSymbol("NOTE_STEM", elem => elem.identity.type === "rect"
		&& elem.sw === 0.13 && elem.identity.height >= 1),

	conditionSymbol("NOTETAIL JOINT", elem => elem.identity.type === "polygon" && pointsSize(elem.identity.points) === 8),

	conditionSymbol("STAFF_LINE", elem => elem.identity.type === "line" && elem.identity.height === 0 && elem.identity.width > 2 && elem.sw === 0.1 && !elem.identity["stroke-dasharray"]),

	conditionSymbol("ADDITIONAL_LINE", elem => elem.identity.type === "rect" && elem.sw2 === 0.2 && elem.identity.rw >= 1.25 && elem.identity.rw < 5),

	conditionSymbol("OCTAVE A", elem => elem.identity.type === "text" && /8va/.test(elem.identity.text)),
	conditionSymbol("OCTAVE B", elem => elem.identity.type === "text" && /8vb/.test(elem.identity.text)),
	identitySymbol("OCTAVE CLOSE LINE", {
		type: "line",
		width: 0,
		height: 1.25,
		"stroke-width": 0.0924,
		"stroke-dasharray": "0.362351432995067,0.537648567004933",
	}),
	conditionSymbol("OCTAVE CLOSE LINE", elem => elem.identity.type === "line" && Math.abs(elem.identity.height) === 0.8
		&& elem.identity.width === 0 && elem.identity["stroke-dasharray"] === "1.0,0.0" && elem.identity["stroke-width"] < 0.2),

	pathFrameSymbol("DOT", "M c     s -  -s- - - -s-  - z"),

	conditionSymbol("LINE", elem => elem.identity.type === "line"),

	conditionSymbol("NULL LARGE_RECT", elem => elem.identity.type === "rect" && (elem.identity.height > 1) && elem.identity.width >= 2 && elem.rx <= 0 && elem.ry <= 0),
	conditionSymbol("NULL ENGRAVER_SIG", elem => elem.identity.type === "text" && /www\.lilypond\.org/.test(elem.identity.text)),

	conditionSymbol("TEXT", elem => elem.identity.type === "text"),
];


pathSymbols.forEach(({symbol, ds}) => symbolRules.push(pathFramesSymbol(symbol, ds)));


const postSymbolProcess = (symbol, process) => (elem, result) => {
	const symbols = result.symbol && result.symbol.split(" ");
	if (symbols && symbols.includes(symbol))
		process(elem, result);
};


const postConditionSymbol = (symbol, condition, addSymbol) => (elem, result) => {
	const symbols = result.symbol && result.symbol.split(" ");
	if (symbols && symbols.includes(symbol) && condition(elem))
		result.symbol = [...symbols, addSymbol].join(" ");
};


const postSymbolRules = [
	postConditionSymbol("NUMBER", elem => elemScale(elem, 0.004), "TIME_SIG"),

	postConditionSymbol("CLOSE", elem => elem.identity.height > 0, "UP"),
	postConditionSymbol("CLOSE", elem => elem.identity.height < 0, "DOWN"),

	postSymbolProcess("SLUR", (elem, result) => {
		const captures = elem.identity.d.match(/M[\d.-]+ ([\d.-]+).*L([\d.-]+) ([\d.-]+)/);
		if (captures) {
			const [_, sy, ex, ey] = captures;
			result.start = {x: 0, y: Number(sy)};
			result.target = {x: Number(ex), y: Number(ey)};

			//console.log("slur:", result);
		}
	}),

	postSymbolProcess("NOTEHEAD", (elem, result) => {
		result.scale = elem.identity.scale.x / NOTEHEAD_BASE_SCALE;
	}),

	postSymbolProcess("TEXT", (elem, result) => {
		result.text = elem.identity.text;
	}),

	postSymbolProcess("NOTE_STEM", (elem, result) => {
		result.width = elem.identity.width;
		result.height = elem.identity.height;
	}),

	postSymbolProcess("ADDITIONAL_LINE", (elem, result) => {
		result.width = elem.identity.width;
		result.height = elem.identity.height;

		// correct ry by stroke width
		const cy = (elem.y + elem.identity.height / 2);
		result.ry = roundNumber(cy, POS_PRECISION);
	}),
];


const postSymbolize = (elem, result) => {
	for (const rule of postSymbolRules) 
		rule(elem, result);

	return result;
};


const symbolize = elem => {
	for (const rule of symbolRules) {
		const result = rule(elem);
		if (result)
			return postSymbolize(elem, result);
	}

	return {};
};



export {
	simplifyPath,
	identityHash,
	symbolize,
};
