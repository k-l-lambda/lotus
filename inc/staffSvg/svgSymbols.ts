
import * as sha1 from "sha1";



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


const pathSymbol = (symbol, d) => elem => {
	if (elem.identity.d === d)
		return {symbol};
};


const pathFrameSymbol = (symbol, frame) => elem => {
	if (elem.identity.type === "path" && elem.identity.d.replace(/[\d\n]/g, "") === frame)
		return {symbol};
};


const conditionSymbol = (symbol, condition) => elem => {
	if (condition(elem))
		return {symbol};
};


const symbolRules = [
	pathFrameSymbol("NOTE NOTEHEAD SOLID", "M c   -  -c - - - - -c- - - - - -c-  -  - c     c     z"),
	pathFrameSymbol("NOTE NOTEHEAD HALF", "M c  -  - c-  - - - -c- - - - - -s- - - -c- - - - - -c -  -  -c     c     s   c     zM c   -  -c - - - - - c- - - - - -c- - - - - -c-  -  - c     c     c     z"),
	pathFrameSymbol("NOTE NOTEHEAD HALF", "M c  -  - c-  - - - -c- - - - - -s- - - -c- - - - - -c -  -  -c     c     s   c     zM c   -  -c - - - - -c- - - - - -c- - - - - -c-  -  - c     c     c     z"),
	pathFrameSymbol("NOTE NOTEHEAD WHOLE", "M c-  - - - -c -  -  -c     c  -  - zM c - - - - -c- - - - - -s-  - c-  -  - s   c     s -  - c -  -  -z"),

	//pathSymbol("NOTE REST WHOLE", ),
	//pathSymbol("NOTE REST HALF", ),
	pathSymbol("NOTE REST QUARTER", "M-23 -114c0 27 11 41 38 41c34 0 82 -14 125 -34l-135 160c-7 9 -10 18 -10 26c0 33 49 64 86 97c25 22 39 53 39 84c0 24 -8 48 -25 68l-37 44c-3 3 -3 6 -3 9c0 8 7 15 15 15c4 0 8 -1 11 -5l151 -181c7 -9 10 -17 10 -25c0 -33 -49 -64 -86 -97 c-25 -22 -39 -54 -39 -85c0 -24 8 -47 25 -67l85 -102c3 -3 4 -6 4 -9c0 -8 -7 -15 -15 -15c-4 0 -8 1 -11 5c-18 22 -65 41 -100 41c-40 0 -53 -28 -53 -69c0 -35 12 -75 29 -95c6 -7 -6 -16 -12 -9c-46 54 -92 149 -92 203z"),
	pathSymbol("NOTE REST EIGHTH", "M74 -250l117 327c-34 -12 -70 -23 -106 -23c-46 0 -87 33 -87 79c0 39 32 72 72 72c25 0 48 -16 56 -40c10 -28 6 -59 35 -59c17 0 56 51 63 67c5 11 22 11 26 0l-125 -423c-7 -6 -16 -9 -25 -9s-19 3 -26 9z"),
	pathSymbol("NOTE REST SIXTEENTH", "M69 -500l100 327c-35 -12 -70 -23 -107 -23c-46 0 -87 33 -87 79c0 39 31 72 71 72c25 0 49 -16 57 -40c10 -28 6 -59 35 -59c17 0 56 52 61 69l46 152c-34 -12 -69 -23 -105 -23c-46 0 -87 33 -87 79c0 39 31 72 71 72c25 0 49 -16 57 -40c10 -28 6 -59 35 -59 c16 0 51 52 58 67c5 11 22 11 26 0l-180 -673c-7 -6 -17 -9 -26 -9s-18 3 -25 9z"),
	pathSymbol("NOTE REST THIRTYSECOND", "M56 -500l87 328c-36 -13 -73 -24 -111 -24c-46 0 -87 33 -87 79c0 39 32 72 72 72c25 0 49 -16 57 -40c10 -28 5 -59 34 -59c17 0 56 53 61 71l39 150c-35 -12 -70 -23 -107 -23c-46 0 -87 33 -87 79c0 39 32 72 72 72c25 0 48 -16 56 -40c10 -28 6 -59 35 -59 c16 0 53 52 57 69l40 151c-34 -12 -68 -22 -104 -22c-46 0 -87 33 -87 79c0 39 31 72 71 72c25 0 49 -16 57 -40c10 -28 6 -59 35 -59c16 0 47 52 53 67c5 12 22 11 26 0l-217 -923c-7 -6 -17 -9 -26 -9s-19 3 -26 9z"),
	//pathSymbol("NOTE REST SIXTYFOURTH", ),

	identitySymbol("MEASURE_SEPARATOR", {
		type: "rect",
		width: 0.25,
		height: 4,
	}),
	identitySymbol("MEASURE_SEPARATOR BOLD", {
		type: "rect",
		width: 0.5,
		height: 4,
	}),

	pathSymbol("CLEF TREBLE HEAD", "M267 -593l-1 -41h-5c-108 0 -196 88 -196 196c0 58 54 104 113 104c54 0 95 -48 95 -104c0 -52 -43 -95 -95 -95c-11 0 -23 3 -34 8c26 -40 69 -68 119 -68h4zM375 261c5 0 9 1 14 1c155 0 255 -128 255 -260c0 -76 -33 -154 -107 -209c-22 -17 -47 -28 -73 -36 c3 -35 5 -71 5 -107c0 -19 -1 -38 -2 -57c-7 -119 -87 -224 -201 -227l1 41c93 2 154 93 160 192c1 18 1 36 1 54c0 31 -1 63 -4 94c-29 -5 -58 -8 -89 -8c-188 0 -333 172 -333 373c0 177 132 307 249 441c-19 63 -35 125 -43 190c-6 51 -7 103 -7 155 c0 116 56 226 150 294c5 4 13 3 18 -1c70 -84 132 -245 132 -358c0 -143 -86 -255 -181 -364c20 -69 38 -138 55 -208zM460 -204c69 24 115 96 115 165c0 91 -68 182 -176 192c25 -117 47 -233 61 -357zM73 30c0 -136 130 -250 265 -250c28 0 55 2 82 6 c-14 127 -38 246 -64 366c-79 -9 -124 -62 -124 -120c0 -44 26 -91 82 -123c5 -4 6 -10 6 -15c0 -11 -9 -21 -21 -21c-3 0 -5 1 -8 2c-80 43 -117 114 -117 184c0 88 58 173 159 196c-14 59 -30 119 -46 177c-107 -121 -214 -242 -214 -402zM431 915c0 57 -4 80 -21 132 c-99 -49 -162 -150 -162 -260c0 -75 17 -135 35 -197c81 97 148 199 148 325z"),
	pathFrameSymbol("CLEF TREBLE HEAD", "M c     c   -  -c - - - - -c- - - - - -c -  -  -c -  - - -c- - - - - -c-  -  - c     c   -  -c - - - - -c-  -  - c -  -  -c     c     c     c  -  - c- - - - - -c-  -  - c     c-  -  - c-  -  - c     c     c -  -  -c - - - - -c -  -  -zM -c     c  -  - c -  -  -zM c -  -  -c     c-  -  - c- - - - - -c -  -  -c -  -  -c - - - - -c-  -  - c-  -  - c     c-  -  - c- - - - - -zM c- - - - - -c -  -  -c     c  -  - z"),
	pathSymbol("CLEF BASS HEAD", "M557 -125c0 28 23 52 51 52s52 -24 52 -52s-24 -52 -52 -52s-51 24 -51 52zM557 125c0 28 23 52 51 52s52 -24 52 -52s-24 -52 -52 -52s-51 24 -51 52zM232 262c171 0 293 -88 293 -250c0 -263 -264 -413 -517 -520c-3 -3 -5 -4 -8 -4c-6 0 -12 6 -12 12c0 3 1 5 4 8 c203 118 413 265 413 494c0 120 -64 236 -173 236c-77 0 -133 -55 -159 -129c13 6 25 10 39 10c55 0 100 -45 100 -100c0 -58 -44 -106 -100 -106c-60 0 -112 47 -112 106c0 132 102 243 232 243z"),
	pathSymbol("CLEF TREBLE SUB", "M517 1c0 -82 -56 -169 -141 -197c2 -28 3 -54 3 -82c0 -16 0 -32 -1 -48c-6 -98 -75 -185 -172 -185c-87 0 -158 72 -158 160c0 46 42 83 90 83c43 0 76 -38 76 -83c0 -42 -34 -76 -76 -76c-4 0 -8 0 -12 1c19 -27 49 -44 83 -44c75 0 123 72 128 150c1 15 2 29 2 44 c0 24 -1 46 -3 70c-22 -4 -45 -5 -68 -5c-151 0 -266 139 -266 301c0 144 101 253 192 366c-16 53 -29 106 -35 161c-4 42 -5 84 -5 127c0 93 42 182 115 240c5 4 13 5 18 0c57 -70 107 -203 107 -296c0 -115 -65 -208 -137 -298c17 -59 33 -119 47 -179c2 0 6 1 8 1 c125 0 205 -104 205 -211zM372 -155c50 20 83 75 83 126c0 69 -50 137 -130 148c19 -90 36 -179 47 -274zM61 20c0 -105 104 -190 210 -190c21 0 41 1 61 4c-11 99 -29 192 -49 285c-60 -8 -94 -49 -94 -93c0 -34 20 -71 64 -96c5 -4 7 -9 7 -14c0 -11 -9 -22 -21 -22 c-3 0 -6 1 -9 2c-65 35 -94 93 -94 150c0 71 46 140 127 160c-12 49 -24 97 -38 145c-82 -101 -164 -202 -164 -331zM321 863c-76 -44 -123 -125 -123 -213c0 -58 14 -106 28 -154c60 79 109 162 109 262c0 45 -3 64 -14 105z"),
	pathSymbol("CLEF BASS SUB", "M445 -100c0 23 19 41 42 41s41 -18 41 -41s-18 -41 -41 -41s-42 18 -42 41zM445 100c0 23 19 41 42 41s41 -18 41 -41s-18 -41 -41 -41s-42 18 -42 41zM180 212c140 0 240 -68 240 -199c0 -211 -210 -334 -412 -421c-3 -3 -5 -4 -8 -4c-6 0 -12 6 -12 12c0 3 1 5 4 8 c151 98 308 217 308 394c0 93 -38 186 -120 186c-54 0 -92 -39 -110 -92c6 2 13 3 20 3c44 0 80 -36 80 -80c0 -46 -35 -85 -80 -85c-48 0 -90 38 -90 85c0 104 78 193 180 193z"),

	pathFrameSymbol("BRACE", "M- -c - - - - -c -  -  -c - - - - -c-  -  - c     c  -  - c-  -  - s   c     c  -  - c      c   -  -c- - - - - -c -  -  -c - - - - -c -  -  -z"),
	pathFrameSymbol("BRACE", "M- -c - - - - -c -  -  -c - - - - -c-  -  - c     c  -  - vvc     c  -  - c     c   -  - c- - - - - -c -  -  -c - - - - -c -  -  -z"),
	pathFrameSymbol("BRACE", "M- -c - - - - -c -  -  -c - - - - -c-  -  - c     c  -  - c  -  - s   c     c  -  - c      c   -  -c- - - - - -c -  -  -c - - - - -c -  -  -z"),
	pathFrameSymbol("BRACE", "M- -c - - - - -c -  -  -c - - - - -c-  -  - c     c  -  - c-  -  - s   c     c  -  - c     c   -  -c- - - - - -c -  -  -c - - - - -c -  -  -z"),

	pathFrameSymbol("SLUR", "M. -.C. -. . -. . -.C. -. . -. . -.z"),
	pathFrameSymbol("SLUR", "M. .C. . . . . .C. . . . . .z"),

	conditionSymbol("STAVES_CONNECTION", elem => elem.identity.type === "rect"
		&& (elem.identity.width === 0.25 || elem.identity.width === 0.1) && elem.identity.height >= 12),

	conditionSymbol("VERTICAL_LINE", elem => elem.identity.type === "rect"
		&& (elem.identity.width === 0.25 || elem.identity.width === 0.1) && elem.identity.height >= 1),

	conditionSymbol("STAFF_LINE", elem => elem.identity.type === "line" && elem.identity.height === 0 && elem.identity.width > 10 && !elem.identity["stroke-dasharray"]),

	conditionSymbol("ADDITIONAL_LINE", elem => elem.identity.type === "rect" && elem.identity.height === 0.25 && elem.identity.width >= 1.75 && elem.identity.width <= 2),

	identitySymbol("TIME_SIG C", {
		type: "path",
		scale: {x: 0.004, y: -0.004},
		d: "M360 26c-50 0 -76 43 -76 76c0 39 27 78 73 78c5 0 11 -1 16 -2c-29 37 -74 60 -123 60c-106 0 -113 -73 -113 -185c0 -17 1 -35 1 -53s-1 -36 -1 -53c0 -112 7 -185 113 -185c81 0 142 69 161 151c1 6 6 9 11 9c6 0 12 -4 12 -11c0 -94 -106 -173 -184 -173 c-68 0 -137 21 -184 70c-49 51 -66 122 -66 192s17 141 66 192c47 49 116 70 184 70c87 0 162 -64 177 -150c1 -5 1 -9 1 -13c0 -40 -31 -73 -68 -73z",
	}),
	pathFrameSymbol("TIME_SIG C", "M c-  -  - c     c     -c-  -  - c-  - - - -c -  -  -s- - - -c -  -  -c     c     c   -  -c - - - - -c-  -  - c-  -  - s   c     c   -  -c -  -  -c - - - - -z"),
	identitySymbol("TIME_SIG 2", {
		type: "path",
		scale: {x: 0.004, y: -0.004},
		d: "M0 12c15 174 236 164 236 343c0 60 -21 123 -73 123c-25 0 -49 -14 -49 -37c0 -27 35 -41 35 -68c0 -38 -31 -69 -69 -69s-69 31 -69 69c0 75 72 127 152 127c96 0 186 -56 186 -145c0 -155 -156 -160 -253 -224c10 2 20 4 31 4c33 0 68 -11 103 -35 c22 -15 47 -24 68 -24s38 9 43 29c2 6 6 8 10 8c6 0 12 -4 12 -11c0 -65 -87 -102 -135 -102c-35 0 -70 14 -95 43c-13 16 -32 23 -49 23c-30 0 -59 -22 -62 -56c-1 -7 -6 -10 -11 -10c-6 0 -12 4 -11 12z",
	}),
	identitySymbol("TIME_SIG 3", {
		type: "path",
		scale: {x: 0.004, y: -0.004},
		d: "M148 478c-28 0 -58 -9 -58 -33c0 -22 36 -25 36 -47c0 -32 -25 -58 -57 -58s-58 26 -58 58c0 64 67 102 137 102c90 0 168 -33 168 -114c0 -43 -4 -83 -42 -101c-9 -4 -14 -13 -14 -21s5 -17 14 -21c41 -19 56 -57 56 -103c0 -91 -78 -140 -177 -140 c-78 0 -153 41 -153 112c0 36 30 66 66 66s65 -30 65 -66c0 -25 -40 -28 -40 -53c0 -26 32 -37 62 -37c49 0 64 61 64 118v7c0 58 -1 103 -52 103h-80c-9 0 -14 7 -14 14s5 14 14 14h80c52 0 52 48 52 108c0 55 -19 92 -69 92z",
	}),
	identitySymbol("TIME_SIG 4", {
		type: "path",
		scale: {x: 0.004, y: -0.004},
		d: "M198 113h113c0 -47 28 -91 71 -91c7 0 11 -5 11 -11s-4 -11 -11 -11c-43 0 -84 13 -127 13s-85 -13 -128 -13c-7 0 -11 5 -11 11s4 11 11 11c43 0 71 44 71 91zM206 312c22 14 44 28 59 49c11 15 17 33 25 50c4 10 21 6 21 -8v-250h71c9 0 14 -7 14 -14s-5 -14 -14 -14 h-71v-12h-113v12h-170c-22 0 -30 13 -30 22c0 2 1 5 2 6c81 94 141 207 141 331c0 10 8 19 16 16c22 -7 45 -13 69 -13s47 6 69 13c13 4 22 -9 16 -16l-283 -331h170v138c0 8 1 17 8 21z",
	}),
	identitySymbol("TIME_SIG 6", {
		type: "path",
		scale: {x: 0.004, y: -0.004},
		d: "M168 256c-54 0 -55 -49 -55 -112v-5v-5c0 -63 1 -112 55 -112c57 0 63 51 63 117s-6 117 -63 117zM113 264c18 7 36 14 55 14c100 0 169 -45 169 -139s-69 -139 -169 -139c-112 0 -168 125 -168 250c0 128 71 250 188 250c70 0 137 -38 137 -102c0 -36 -29 -66 -65 -66 s-66 30 -66 66c0 24 39 25 39 49c0 20 -22 31 -45 31c-68 0 -76 -68 -76 -145c0 -23 1 -46 1 -69z",
	}),
	identitySymbol("TIME_SIG 8", {
		type: "path",
		scale: {x: 0.004, y: -0.004},
		d: "M256 287c28 30 51 62 51 102c0 55 -57 89 -118 89c-48 0 -76 -37 -76 -73c0 -21 9 -42 30 -54zM284 270c55 -32 84 -78 84 -127c0 -73 -65 -143 -187 -143c-93 0 -181 53 -181 139c0 51 39 85 77 120c-42 28 -63 69 -63 108c0 67 61 133 175 133c81 0 160 -39 160 -111 c0 -47 -31 -85 -65 -119zM106 242c-33 -29 -64 -59 -64 -103c0 -69 66 -117 139 -117c55 0 87 43 87 84c0 25 -11 50 -36 64z",
	}),

	identitySymbol("ALTER FLAT", {
		type: "path",
		scale: {x: 0.004, y: -0.004},
		d: "M26 43l-1 -68v-11c0 -22 0 -44 3 -66c46 38 95 80 95 139c0 34 -14 68 -44 68c-31 0 -52 -29 -53 -62zM-14 -137l-12 598c8 5 17 6 26 6s18 -1 26 -6l-7 -348c25 20 57 32 90 32c52 0 91 -47 91 -101c0 -81 -88 -118 -150 -169c-15 -12 -22 -35 -42 -35 c-12 0 -22 10 -22 23z",
	}),
	identitySymbol("ALTER SHARP", {
		type: "path",
		scale: {x: 0.004, y: -0.004},
		d: "M216 -314c0 -10 -8 -18 -18 -18s-18 8 -18 18v148l-85 -31v-160c0 -10 -8 -18 -18 -18s-18 8 -18 18v148l-35 -13c-2 -1 -4 -1 -6 -1c-9 0 -18 8 -18 18v62c0 8 5 14 12 17l47 17v162l-35 -13c-2 -1 -4 -1 -6 -1c-9 0 -18 8 -18 18v63c0 8 5 14 12 17l47 17v160 c0 10 8 18 18 18s18 -8 18 -18v-148l85 31v160c0 10 8 18 18 18s18 -8 18 -18v-148l35 13c2 1 4 1 6 1c9 0 18 -8 18 -18v-62c0 -8 -5 -14 -12 -17l-47 -17v-162l35 13c2 1 4 1 6 1c9 0 18 -8 18 -18v-63c0 -8 -5 -14 -12 -17l-47 -17v-160zM95 66v-162l85 30v162z",
	}),
	identitySymbol("ALTER NATURAL", {
		type: "path",
		scale: {x: 0.004, y: -0.004},
		d: "M-7 375c7 4 16 6 24 6s17 -2 24 -6l-2 -179l108 19h3c9 0 17 -8 17 -17l7 -573c-7 -4 -16 -6 -24 -6s-17 2 -24 6l2 179l-108 -19h-3c-9 0 -17 8 -17 17zM132 113l-94 -16l-3 -210l94 16z",
	}),

	identitySymbol("OCTAVE A", {
		type: "text",
		text: "\n8va",
		"font-size": 2.2003,
	}),
	identitySymbol("OCTAVE B", {
		type: "text",
		text: "\n8vb",
		"font-size": 2.2003,
	}),
	identitySymbol("OCTAVE CLOSE", {
		type: "line",
		width: 0,
		height: 1.25,
		"stroke-width": 0.0924,
		"stroke-dasharray": "0.362351432995067,0.537648567004933",
	}),

	conditionSymbol("NULL LARGE_RECT", elem => elem.identity.type === "rect" && elem.identity.height === 2 && elem.identity.width >= 50 && elem.rx <= 0 && elem.ry <= 0),
	conditionSymbol("NULL COPYRIGHT", elem => elem.identity.type === "text" && /www\.lilypond\.org/.test(elem.identity.text)),
];


const symbolize = elem => {
	for (const rule of symbolRules) {
		const result = rule(elem);
		if (result)
			return result;
	}

	return {};
};



export {
	identityHash,
	symbolize,
};
