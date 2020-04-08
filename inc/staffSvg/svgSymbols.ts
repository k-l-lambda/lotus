
import sha1 from "sha1";

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
	].map(simplifyPath)),
	pathFramesSymbol("SLUR UP", [
		"M1.6331 0.7750C2.7048 -0.1232 7.7198 -0.1232 8.7915 0.7750L8.7915 0.7750C7.7198 0.0055 2.7048 0.0055 1.6331 0.7750z",
		"M1.2172 -3.2497C3.8915 -5.3756 29.8558 -8.0703 32.9096 -6.5389L32.9096 -6.5389C29.8641 -7.9902 3.8998 -5.2954 1.2172 -3.2497z",
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
	conditionSymbol("OCTAVE CLOSE LINE", elem => elem.identity.type === "line" && elem.identity.height === 0.8
		&& elem.identity.width === 0 && elem.identity["stroke-dasharray"] === "1.0,0.0" && elem.identity["stroke-width"] < 0.1),

	pathFrameSymbol("DOT", "M c     s -  -s- - - -s-  - z"),

	conditionSymbol("LINE", elem => elem.identity.type === "line"),

	conditionSymbol("NULL LARGE_RECT", elem => elem.identity.type === "rect" && (elem.identity.height > 1) && elem.identity.width >= 7 && elem.rx <= 0 && elem.ry <= 0),
	conditionSymbol("NULL COPYRIGHT", elem => elem.identity.type === "text" && /www\.lilypond\.org/.test(elem.identity.text)),
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

	postSymbolProcess("SLUR", (elem, result) => {
		const captures = elem.identity.d.match(/M[\d.-]+ ([\d.-]+).*L([\d.-]+) ([\d.-]+)/);
		if (captures) {
			const [_, sy, ex, ey] = captures;
			result.start = {x: 0, y: Number(sy)};
			result.target = {x: Number(ex), y: Number(ey)};

			//console.log("slur:", result);
		}
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
