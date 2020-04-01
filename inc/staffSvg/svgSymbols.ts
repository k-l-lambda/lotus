
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


const simplifyPath = d => d.replace(/\s+/g, " ").replace(/\d/g, "");


const pathFrameSymbol = (symbol, frame) => elem => {
	if (elem.identity.type === "path" && simplifyPath(elem.identity.d) === frame)
		return {symbol};
};


/*const pathFrameScaleSymbol = (symbol, frame, scale) => elem => {
	if (elem.identity.type === "path" && simplifyPath(elem.identity.d) === frame
		&& (elem.identity.scale && elem.identity.scale.x === scale && elem.identity.scale.y === scale))
		return {symbol};
};*/


const pathFramesSymbol = (symbol, frames) => elem => {
	if (elem.identity.type === "path" && frames.includes(simplifyPath(elem.identity.d)))
		return {symbol};
};


const pathFramesScaleSymbol = (symbol, frames, scale) => elem => {
	if (elem.identity.type === "path" && frames.includes(simplifyPath(elem.identity.d))
		&& (elem.identity.scale && Math.abs(elem.identity.scale.x) === scale && Math.abs(elem.identity.scale.y) === scale))
		return {symbol};
};


const conditionSymbol = (symbol, condition, fields: (any) => object = () => ({})) => elem => {
	if (condition(elem))
		return {symbol, ...fields(elem)};
};


const symbolRules = [
	//pathFrameSymbol("NOTE NOTEHEAD SOLID", "M c   -  -c - - - - -c- - - - - -c-  -  - c     c     z"),
	pathFramesSymbol("NOTE NOTEHEAD SOLID", [
		"M202 144c66 0 125 -38 125 -109s-49 -120 -96 -148c-32 -19 -69 -31 -106 -31c-66 0 -125 38 -125 109s49 120 96 148c32 19 69 31 106 31z",
		"M218 136c55 0 108 -28 108 -89c0 -71 -55 -121 -102 -149c-35 -21 -75 -34 -116 -34c-55 0 -108 28 -108 89c0 71 55 121 102 149c35 21 75 34 116 34z",
	].map(simplifyPath)),
	pathFrameSymbol("NOTE NOTEHEAD HALF", "M c  -  - c-  - - - -c- - - - - -s- - - -c- - - - - -c -  -  -c     c     s   c     zM c   -  -c - - - - - c- - - - - -c- - - - - -c-  -  - c     c     c     z"),
	pathFrameSymbol("NOTE NOTEHEAD HALF", "M c  -  - c-  - - - -c- - - - - -s- - - -c- - - - - -c -  -  -c     c     s   c     zM c   -  -c - - - - -c- - - - - -c- - - - - -c-  -  - c     c     c     z"),
	pathFramesSymbol("NOTE NOTEHEAD HALF", [
		"M315 65c0 24 -21 41 -42 41c-4 0 -8 0 -12 -1c-31 -9 -77 -40 -114 -64s-84 -53 -104 -78c-7 -8 -11 -18 -11 -28c0 -24 21 -41 42 -41c4 0 8 0 12 1c31 9 78 40 115 64s84 53 104 78c7 8 10 18 10 28zM264 137c47 0 83 -21 83 -72c0 -19 -4 -37 -10 -56		c-12 -38 -32 -74 -65 -96c-54 -36 -113 -51 -188 -51c-47 0 -84 22 -84 73c0 19 5 37 11 56c12 38 31 74 64 96c54 36 114 50 189 50z",
		"M305 59c0 22 -19 38 -38 38c-4 0 -7 -1 -11 -2c-28 -8 -71 -35 -104 -57s-76 -50 -95 -72c-6 -7 -9 -16 -9 -25c0 -22 19 -38 38 -38c4 0 7 1 11 2c28 8 71 35 104 57s75 50 94 72c6 7 10 16 10 25zM337 109c11 -17 15 -35 15 -55c0 -64 -26 -125 -69 -154		c-50 -34 -106 -44 -172 -44c-38 0 -76 5 -96 35c-11 17 -15 35 -15 55c0 64 26 125 69 154c50 34 106 44 172 44c38 0 76 -5 96 -35z",
		"M308 61c0 22 -19 38 -39 38c-4 0 -8 -1 -12 -2c-29 -8 -72 -36 -106 -58s-78 -51 -97 -74c-6 -8 -10 -17 -10 -26c0 -22 19 -38 39 -38c4 0 7 1 11 2c29 8 73 36 107 58s78 51 97 74c6 8 10 17 10 26zM249 142c57 0 103 -23 103 -85c0 -64 -28 -125 -71 -154		c-52 -35 -109 -45 -178 -45c-57 0 -103 23 -103 85c0 64 28 125 71 154c52 35 109 45 178 45z",
	].map(simplifyPath)),
	pathFrameSymbol("NOTE NOTEHEAD WHOLE", "M c-  - - - -c -  -  -c     c  -  - zM c - - - - -c- - - - - -s-  - c-  -  - s   c     s -  - c -  -  -z"),

	pathFrameSymbol("NOTE REST WHOLE", simplifyPath("M367 -156h-359c-4 0 -8 4 -8 8v140c0 4 4 8 8 8h359c4 0 8 -4 8 -8v-140c0 -4 -4 -8 -8 -8z")),
	pathFramesSymbol("NOTE REST HALF", [
		"M367 0h-359c-4 0 -8 4 -8 8v140c0 4 4 8 8 8h359c4 0 8 -4 8 -8v-140c0 -4 -4 -8 -8 -8z",
	].map(simplifyPath)),
	pathFrameSymbol("NOTE REST QUARTER", simplifyPath("M-23 -114c0 27 11 41 38 41c34 0 82 -14 125 -34l-135 160c-7 9 -10 18 -10 26c0 33 49 64 86 97c25 22 39 53 39 84c0 24 -8 48 -25 68l-37 44c-3 3 -3 6 -3 9c0 8 7 15 15 15c4 0 8 -1 11 -5l151 -181c7 -9 10 -17 10 -25c0 -33 -49 -64 -86 -97 c-25 -22 -39 -54 -39 -85c0 -24 8 -47 25 -67l85 -102c3 -3 4 -6 4 -9c0 -8 -7 -15 -15 -15c-4 0 -8 1 -11 5c-18 22 -65 41 -100 41c-40 0 -53 -28 -53 -69c0 -35 12 -75 29 -95c6 -7 -6 -16 -12 -9c-46 54 -92 149 -92 203z")),
	pathFrameSymbol("NOTE REST EIGHTH", simplifyPath("M74 -250l117 327c-34 -12 -70 -23 -106 -23c-46 0 -87 33 -87 79c0 39 32 72 72 72c25 0 48 -16 56 -40c10 -28 6 -59 35 -59c17 0 56 51 63 67c5 11 22 11 26 0l-125 -423c-7 -6 -16 -9 -25 -9s-19 3 -26 9z")),
	pathFrameSymbol("NOTE REST SIXTEENTH", simplifyPath("M69 -500l100 327c-35 -12 -70 -23 -107 -23c-46 0 -87 33 -87 79c0 39 31 72 71 72c25 0 49 -16 57 -40c10 -28 6 -59 35 -59c17 0 56 52 61 69l46 152c-34 -12 -69 -23 -105 -23c-46 0 -87 33 -87 79c0 39 31 72 71 72c25 0 49 -16 57 -40c10 -28 6 -59 35 -59 c16 0 51 52 58 67c5 11 22 11 26 0l-180 -673c-7 -6 -17 -9 -26 -9s-18 3 -25 9z")),
	pathFrameSymbol("NOTE REST THIRTYSECOND", simplifyPath("M56 -500l87 328c-36 -13 -73 -24 -111 -24c-46 0 -87 33 -87 79c0 39 32 72 72 72c25 0 49 -16 57 -40c10 -28 5 -59 34 -59c17 0 56 53 61 71l39 150c-35 -12 -70 -23 -107 -23c-46 0 -87 33 -87 79c0 39 32 72 72 72c25 0 48 -16 56 -40c10 -28 6 -59 35 -59 c16 0 53 52 57 69l40 151c-34 -12 -68 -22 -104 -22c-46 0 -87 33 -87 79c0 39 31 72 71 72c25 0 49 -16 57 -40c10 -28 6 -59 35 -59c16 0 47 52 53 67c5 12 22 11 26 0l-217 -923c-7 -6 -17 -9 -26 -9s-19 3 -26 9z")),
	//pathSymbol("NOTE REST SIXTYFOURTH", ),

	conditionSymbol("MEASURE_SEPARATOR", elem => elem.identity.type === "rect"
		&& (elem.identity.rw === 0.2 || elem.identity.rw === 0.15) && elem.identity.rh === 4.05),
	conditionSymbol("MEASURE_SEPARATOR BOLD", elem => elem.identity.type === "rect"
		&& (elem.identity.rw === 0.6 || elem.identity.rw === 0.55 || elem.identity.rw === 0.45 || elem.identity.rw === 0.4 || elem.identity.rw === 0.75) && elem.identity.rh === 4.05),

	pathSymbol("CLEF TREBLE HEAD", "M267 -593l-1 -41h-5c-108 0 -196 88 -196 196c0 58 54 104 113 104c54 0 95 -48 95 -104c0 -52 -43 -95 -95 -95c-11 0 -23 3 -34 8c26 -40 69 -68 119 -68h4zM375 261c5 0 9 1 14 1c155 0 255 -128 255 -260c0 -76 -33 -154 -107 -209c-22 -17 -47 -28 -73 -36 c3 -35 5 -71 5 -107c0 -19 -1 -38 -2 -57c-7 -119 -87 -224 -201 -227l1 41c93 2 154 93 160 192c1 18 1 36 1 54c0 31 -1 63 -4 94c-29 -5 -58 -8 -89 -8c-188 0 -333 172 -333 373c0 177 132 307 249 441c-19 63 -35 125 -43 190c-6 51 -7 103 -7 155 c0 116 56 226 150 294c5 4 13 3 18 -1c70 -84 132 -245 132 -358c0 -143 -86 -255 -181 -364c20 -69 38 -138 55 -208zM460 -204c69 24 115 96 115 165c0 91 -68 182 -176 192c25 -117 47 -233 61 -357zM73 30c0 -136 130 -250 265 -250c28 0 55 2 82 6 c-14 127 -38 246 -64 366c-79 -9 -124 -62 -124 -120c0 -44 26 -91 82 -123c5 -4 6 -10 6 -15c0 -11 -9 -21 -21 -21c-3 0 -5 1 -8 2c-80 43 -117 114 -117 184c0 88 58 173 159 196c-14 59 -30 119 -46 177c-107 -121 -214 -242 -214 -402zM431 915c0 57 -4 80 -21 132 c-99 -49 -162 -150 -162 -260c0 -75 17 -135 35 -197c81 97 148 199 148 325z"),
	pathFramesSymbol("CLEF TREBLE", [
		"M267 -593l-1 -41h-5c-108 0 -196 88 -196 196c0 58 54 104 113 104c54 0 95 -48 95 -104c0 -52 -43 -95 -95 -95c-11 0 -23 3 -34 8c26 -40 69 -68 119 -68h4zM375 261c5 0 9 1 14 1c155 0 255 -128 255 -260c0 -76 -33 -154 -107 -209c-22 -17 -47 -28 -73 -36 c3 -35 5 -71 5 -107c0 -19 -1 -38 -2 -57c-7 -119 -87 -224 -201 -227l1 41c93 2 154 93 160 192c1 18 1 36 1 54c0 31 -1 63 -4 94c-29 -5 -58 -8 -89 -8c-188 0 -333 172 -333 373c0 177 132 307 249 441c-19 63 -35 125 -43 190c-6 51 -7 103 -7 155 c0 116 56 226 150 294c5 4 13 3 18 -1c70 -84 132 -245 132 -358c0 -143 -86 -255 -181 -364c20 -69 38 -138 55 -208zM460 -204c69 24 115 96 115 165c0 91 -68 182 -176 192c25 -117 47 -233 61 -357zM73 30c0 -136 130 -250 265 -250c28 0 55 2 82 6 c-14 127 -38 246 -64 366c-79 -9 -124 -62 -124 -120c0 -44 26 -91 82 -123c5 -4 6 -10 6 -15c0 -11 -9 -21 -21 -21c-3 0 -5 1 -8 2c-80 43 -117 114 -117 184c0 88 58 173 159 196c-14 59 -30 119 -46 177c-107 -121 -214 -242 -214 -402zM431 915c0 57 -4 80 -21 132 c-99 -49 -162 -150 -162 -260c0 -75 17 -135 35 -197c81 97 148 199 148 325z",
		"M374 260c5 0 10 1 15 1c154 0 254 -127 254 -259c0 -76 -33 -153 -107 -208c-22 -17 -47 -29 -73 -37c3 -36 5 -72 5 -108c0 -19 0 -37 -1 -56c-7 -120 -88 -226 -206 -226c-108 0 -195 87 -195 195c0 58 53 104 112 104c54 0 95 -48 95 -104c0 -52 -43 -95 -95 -95	c-12 0 -24 4 -35 9c26 -41 70 -70 121 -70c1 0 2 1 3 1c93 2 154 93 160 192c1 18 2 35 2 53c0 32 -2 64 -5 96c-29 -5 -58 -8 -89 -8c-188 0 -333 171 -333 372c0 178 133 306 251 440c-18 63 -35 126 -42 191c-6 51 -7 102 -7 154c0 116 55 226 150 295c5 4 11 4 16 0	c70 -84 132 -246 132 -359c0 -144 -87 -256 -183 -365c20 -69 39 -138 55 -208zM459 -205c69 24 117 96 117 166c0 92 -69 184 -179 193c25 -117 48 -235 62 -359zM71 31c0 -136 131 -251 267 -251c28 0 55 2 82 6c-15 128 -38 247 -64 367c-79 -9 -125 -62 -125 -121	c0 -44 26 -92 82 -124c4 -4 7 -9 7 -14c0 -11 -9 -21 -20 -21c-3 0 -6 1 -9 2c-80 43 -116 114 -116 184c0 88 57 173 158 196c-14 60 -30 119 -46 178c-108 -121 -216 -242 -216 -402zM411 1050c-99 -50 -161 -151 -161 -262c0 -76 15 -137 33 -200c82 97 149 198 149 325	c0 58 -4 84 -21 137z",
		"M267 -593l-1 -41h-5c-108 0 -196 88 -196 196c0 58 54 104 113 104c54 0 95 -48 95 -104c0 -52 -43 -95 -95 -95c-11 0 -23 3 -34 8c26 -40 69 -68 119 -68h4zM375 261c5 0 9 1 14 1c155 0 255 -128 255 -260c0 -76 -33 -154 -107 -209c-22 -17 -47 -28 -73 -36	c3 -35 5 -71 5 -107c0 -19 -1 -38 -2 -57c-7 -119 -87 -224 -201 -227l1 41c93 2 154 93 160 192c1 18 1 36 1 54c0 31 -1 63 -4 94c-29 -5 -58 -8 -89 -8c-188 0 -333 172 -333 373c0 177 132 307 249 441c-19 63 -35 125 -43 190c-6 51 -7 103 -7 155	c0 116 56 226 150 294c5 4 13 3 18 -1c70 -84 132 -245 132 -358c0 -143 -86 -255 -181 -364c20 -69 38 -138 55 -208zM460 -204c69 24 115 96 115 165c0 91 -68 182 -176 192c25 -117 47 -233 61 -357zM73 30c0 -136 130 -250 265 -250c28 0 55 2 82 6	c-14 127 -38 246 -64 366c-79 -9 -124 -62 -124 -120c0 -44 26 -91 82 -123c5 -4 6 -10 6 -15c0 -11 -9 -21 -21 -21c-3 0 -5 1 -8 2c-80 43 -117 114 -117 184c0 88 58 173 159 196c-14 59 -30 119 -46 177c-107 -121 -214 -242 -214 -402zM431 915c0 57 -4 80 -21 132	c-99 -49 -162 -150 -162 -260c0 -75 17 -135 35 -197c81 97 148 199 148 325z",
		"M379 264c3 0 7 1 10 1c157 0 258 -129 258 -263c0 -77 -33 -155 -108 -211c-22 -16 -46 -29 -72 -37c3 -33 4 -66 4 -99c0 -21 0 -41 -1 -62c-7 -121 -91 -229 -211 -229c-108 0 -196 88 -196 197c0 58 54 103 113 103c54 0 95 -47 95 -103c0 -52 -43 -95 -95 -95	c-9 0 -18 1 -27 4c25 -37 66 -61 113 -61h4c92 2 152 93 158 191c1 19 2 38 2 57c0 29 -1 58 -3 87c-29 -5 -58 -8 -88 -8c-189 0 -333 173 -333 376c0 177 129 308 244 443c-20 62 -40 124 -48 189c-7 52 -7 105 -7 158c0 114 54 221 147 288c-2 7 22 1 25 -1	c72 -83 135 -243 135 -356c0 -142 -84 -255 -176 -364c21 -68 40 -136 57 -205zM463 -201c65 24 110 94 110 161c0 88 -64 175 -167 188c24 -114 44 -227 57 -349zM77 25c0 -133 128 -243 261 -243c27 0 55 1 81 5c-13 126 -35 244 -60 362c-79 -8 -124 -60 -124 -118	c0 -43 25 -88 80 -120c5 -5 7 -11 7 -17c0 -12 -10 -23 -23 -23c-3 0 -7 1 -10 2c-81 43 -118 115 -118 186c0 89 60 177 163 200c-14 57 -30 113 -47 169c-105 -122 -210 -243 -210 -403zM403 1038c-99 -46 -161 -145 -161 -254c0 -71 21 -130 39 -188	c78 97 142 199 142 324c0 51 -4 72 -20 118z",
		"M266 -635h-6c-108 0 -195 88 -195 197c0 58 53 103 112 103c54 0 95 -47 95 -103c0 -52 -43 -95 -95 -95c-11 0 -21 2 -31 6c26 -39 68 -65 117 -65h4zM461 -203c68 24 113 95 113 164c0 90 -66 179 -173 190c24 -116 46 -231 60 -354zM74 28c0 -135 129 -247 264 -247	c28 0 55 2 82 6c-14 127 -37 245 -63 364c-79 -8 -124 -61 -124 -119c0 -44 25 -91 81 -123c5 -5 7 -10 7 -15c0 -11 -10 -22 -22 -22c-3 0 -6 1 -9 2c-80 43 -117 115 -117 185c0 88 58 174 160 197c-14 58 -29 117 -46 175c-107 -121 -213 -243 -213 -403zM335 -262	c-188 0 -333 172 -333 374c0 177 131 306 248 441c-19 62 -37 125 -45 190c-6 52 -7 104 -7 156c0 115 55 224 149 292c6 5 14 5 20 0c71 -84 133 -245 133 -358c0 -143 -86 -255 -180 -364c21 -68 39 -138 56 -207c4 0 9 1 13 1c155 0 256 -128 256 -261	c0 -76 -33 -154 -107 -210c-22 -17 -47 -28 -73 -36c3 -35 5 -70 5 -105c0 -19 -1 -39 -2 -58c-7 -119 -88 -225 -202 -228l1 43c93 2 153 92 159 191c1 18 2 37 2 55c0 31 -1 61 -4 92c-29 -5 -58 -8 -89 -8zM428 916c0 55 -4 79 -20 129c-99 -48 -162 -149 -162 -259	c0 -74 18 -133 36 -194c80 97 146 198 146 324z",
		"M335 -268c-190 0 -333 176 -333 380c0 176 125 308 237 445c-23 61 -46 123 -55 188c-8 53 -8 108 -8 162c0 111 53 216 143 281c5 4 12 6 18 6c7 0 13 -3 18 -7c74 -81 139 -242 139 -355c0 -140 -79 -252 -168 -361c23 -67 43 -134 60 -202h4c159 0 261 -131 261 -267		c0 -78 -33 -157 -109 -214c-21 -16 -45 -28 -70 -36c2 -30 3 -60 3 -90c0 -23 -1 -47 -2 -70c-8 -123 -93 -231 -215 -231c-109 0 -198 88 -198 198c0 58 53 103 112 103c54 0 95 -47 95 -103c0 -52 -43 -95 -95 -95c-6 0 -11 0 -16 1c25 -32 62 -52 105 -52		c94 0 154 90 160 187c1 21 2 42 2 63c0 25 -1 51 -2 76c-28 -5 -56 -7 -86 -7zM468 -197c61 25 101 92 101 155c0 84 -59 167 -154 184c23 -110 42 -220 53 -339zM338 -216c27 0 53 1 79 5c-11 124 -31 240 -55 355c-78 -6 -122 -58 -122 -114c0 -42 24 -86 77 -117		c6 -6 8 -12 8 -18c0 -14 -11 -27 -26 -27c-4 0 -7 0 -11 2c-82 44 -120 118 -120 190c0 91 60 180 166 203c-14 54 -29 108 -47 161c-102 -123 -204 -247 -204 -406c0 -129 125 -234 255 -234zM395 1026c-98 -43 -162 -140 -162 -247c0 -24 4 -45 10 -67		c10 -36 23 -71 35 -106c75 97 135 198 135 321c0 43 -3 61 -18 99z",
		"M335 -267c-189 0 -333 175 -333 379c0 176 126 308 239 444c-22 62 -42 124 -51 189c-7 53 -9 106 -9 160c0 112 54 218 145 284c5 3 11 5 16 5c6 0 11 -2 16 -6c73 -82 137 -243 137 -356c0 -141 -80 -253 -170 -362c22 -67 41 -135 58 -203h7c158 0 259 -130 259 -265		c0 -77 -33 -156 -108 -213c-22 -16 -46 -28 -71 -36c2 -31 4 -63 4 -94c0 -22 -1 -44 -2 -66c-7 -123 -93 -231 -214 -231c-109 0 -197 88 -197 197c0 58 53 104 112 104c54 0 95 -48 95 -104c0 -52 -43 -95 -95 -95c-7 0 -13 1 -20 3c25 -34 64 -56 108 -56		c94 0 155 91 161 189c1 20 2 41 2 61c0 27 -1 53 -3 80c-28 -5 -56 -8 -86 -8zM466 -199c63 25 105 94 105 158c0 85 -61 169 -159 185c23 -112 42 -223 54 -343zM338 -217c27 0 54 2 80 6c-12 125 -32 241 -57 357c-78 -7 -123 -59 -123 -116c0 -42 25 -87 78 -118		c6 -5 8 -12 8 -18c0 -13 -11 -25 -25 -25c-3 0 -7 0 -11 2c-82 44 -119 116 -119 188c0 91 60 180 165 203c-14 55 -30 109 -47 163c-103 -123 -206 -246 -206 -405c0 -130 126 -237 257 -237zM398 1030c-99 -44 -162 -141 -162 -249c0 -67 24 -125 43 -179		c76 97 138 199 138 322c0 46 -4 65 -19 106z",
		"M378 263c4 0 7 1 11 1c156 0 257 -129 257 -262c0 -76 -34 -154 -108 -210c-22 -17 -46 -29 -72 -37c3 -34 4 -68 4 -102c0 -20 0 -40 -1 -60c-7 -121 -90 -228 -209 -228c-108 0 -196 87 -196 196c0 58 53 104 112 104c54 0 95 -48 95 -104c0 -52 -43 -95 -95 -95		c-10 0 -20 2 -29 6c26 -38 68 -63 116 -63h3c93 2 153 92 159 190c1 19 2 37 2 56c0 30 -2 60 -4 90c-29 -5 -58 -8 -88 -8c-188 0 -333 173 -333 375c0 177 130 307 246 442c-20 62 -38 125 -46 190c-6 52 -7 104 -7 157c0 115 55 223 148 290c7 5 16 4 22 -1		c71 -83 134 -244 134 -357c0 -143 -85 -255 -178 -364c21 -68 40 -137 57 -206zM462 -202c67 24 111 94 111 162c0 89 -65 178 -170 190c24 -115 46 -230 59 -352zM75 26c0 -134 129 -245 263 -245c28 0 55 2 81 6c-14 126 -36 244 -61 363c-79 -8 -124 -61 -124 -119		c0 -43 25 -89 80 -121c5 -5 7 -11 7 -16c0 -12 -10 -23 -22 -23c-3 0 -6 1 -9 2c-81 43 -118 116 -118 186c0 89 58 175 161 198c-14 58 -29 116 -46 173c-106 -122 -212 -244 -212 -404zM244 785c0 -73 20 -132 38 -191c79 97 144 199 144 324c0 53 -4 76 -20 124		c-99 -47 -162 -148 -162 -257z",
		"M375 261c5 0 9 1 14 1c155 0 255 -128 255 -260c0 -76 -33 -154 -107 -209c-22 -17 -47 -28 -73 -36c3 -35 5 -71 5 -107c0 -19 -1 -38 -2 -57c-7 -120 -88 -227 -206 -227c-108 0 -196 88 -196 196c0 58 54 104 113 104c54 0 95 -48 95 -104c0 -52 -43 -95 -95 -95		c-11 0 -23 3 -34 8c26 -40 69 -68 119 -68c96 0 158 93 164 192c1 18 1 36 1 54c0 31 -1 63 -4 94c-29 -5 -58 -8 -89 -8c-188 0 -333 172 -333 373c0 177 132 307 249 441c-19 63 -35 125 -43 190c-6 51 -7 103 -7 155c0 116 56 226 150 294c3 2 5 3 8 3s7 -2 10 -4		c70 -84 132 -245 132 -358c0 -143 -86 -255 -181 -364c20 -69 38 -138 55 -208zM460 -204c69 24 115 96 115 165c0 91 -68 182 -176 192c25 -117 47 -233 61 -357zM73 30c0 -136 130 -250 265 -250c28 0 55 2 82 6c-14 127 -38 246 -64 366c-79 -9 -124 -62 -124 -120		c0 -44 26 -91 82 -123c5 -4 6 -10 6 -15c0 -11 -9 -21 -21 -21c-3 0 -5 1 -8 2c-80 43 -117 114 -117 184c0 88 58 173 159 196c-14 59 -30 119 -46 177c-107 -121 -214 -242 -214 -402zM410 1047c-99 -49 -162 -150 -162 -260c0 -75 17 -135 35 -197c81 97 148 199 148 325		c0 57 -4 80 -21 132z",
		"M517 1c0 -82 -56 -169 -141 -197c2 -28 3 -54 3 -82c0 -16 0 -32 -1 -48c-6 -98 -75 -185 -172 -185c-87 0 -158 72 -158 160c0 46 42 83 90 83c43 0 76 -38 76 -83c0 -42 -34 -76 -76 -76c-4 0 -8 0 -12 1c19 -27 49 -44 83 -44c75 0 123 72 128 150c1 15 2 29 2 44		c0 24 -1 46 -3 70c-22 -4 -45 -5 -68 -5c-151 0 -266 139 -266 301c0 144 101 253 192 366c-16 53 -29 106 -35 161c-4 42 -5 84 -5 127c0 93 42 182 115 240c3 2 6 3 9 3s6 -1 9 -3c57 -70 107 -203 107 -296c0 -115 -65 -208 -137 -298c17 -59 33 -119 47 -179		c2 0 6 1 8 1c125 0 205 -104 205 -211zM372 -155c50 20 83 75 83 126c0 69 -50 137 -130 148c19 -90 36 -179 47 -274zM61 20c0 -105 104 -190 210 -190c21 0 41 1 61 4c-11 99 -29 192 -49 285c-60 -8 -94 -49 -94 -93c0 -34 20 -71 64 -96c5 -4 7 -9 7 -14		c0 -11 -9 -22 -21 -22c-3 0 -6 1 -9 2c-65 35 -94 93 -94 150c0 71 46 140 127 160c-12 49 -24 97 -38 145c-82 -101 -164 -202 -164 -331zM321 863c-76 -44 -123 -125 -123 -213c0 -58 14 -106 28 -154c60 79 109 162 109 262c0 45 -3 64 -14 105z",
		"M379 264c3 0 7 1 10 1c157 0 258 -129 258 -263c0 -77 -33 -155 -108 -211c-22 -16 -46 -29 -72 -37c3 -33 4 -66 4 -99c0 -21 0 -41 -1 -62c-7 -121 -91 -229 -211 -229c-108 0 -196 88 -196 197c0 58 54 103 113 103c54 0 95 -47 95 -103c0 -52 -43 -95 -95 -95		c-9 0 -18 1 -27 4c25 -37 66 -61 113 -61c95 0 156 93 162 191c1 19 2 38 2 57c0 29 -1 58 -3 87c-29 -5 -58 -8 -88 -8c-189 0 -333 173 -333 376c0 177 129 308 244 443c-20 62 -40 124 -48 189c-7 52 -7 105 -7 158c0 114 54 221 147 288c4 3 8 4 12 4c5 0 9 -2 13 -5		c72 -83 135 -243 135 -356c0 -142 -84 -255 -176 -364c21 -68 40 -136 57 -205zM463 -201c65 24 110 94 110 161c0 88 -64 175 -167 188c24 -114 44 -227 57 -349zM77 25c0 -133 128 -243 261 -243c27 0 55 1 81 5c-13 126 -35 244 -60 362c-79 -8 -124 -60 -124 -118		c0 -43 25 -88 80 -120c5 -5 7 -11 7 -17c0 -12 -10 -23 -23 -23c-3 0 -7 1 -10 2c-81 43 -118 115 -118 186c0 89 60 177 163 200c-14 57 -30 113 -47 169c-105 -122 -210 -243 -210 -403zM403 1038c-99 -46 -161 -145 -161 -254c0 -71 21 -130 39 -188		c78 97 142 199 142 324c0 51 -4 72 -20 118z",
		"M376 262c4 0 9 1 13 1c155 0 256 -128 256 -261c0 -76 -33 -154 -107 -210c-22 -17 -47 -28 -73 -36c3 -35 5 -70 5 -105c0 -19 -1 -39 -2 -58c-7 -120 -90 -228 -208 -228c-108 0 -195 88 -195 197c0 58 53 103 112 103c54 0 95 -47 95 -103c0 -52 -43 -95 -95 -95		c-11 0 -21 2 -31 6c26 -39 68 -65 117 -65c96 0 157 92 163 191c1 18 2 37 2 55c0 31 -1 61 -4 92c-29 -5 -58 -8 -89 -8c-188 0 -333 172 -333 374c0 177 131 306 248 441c-19 62 -37 125 -45 190c-6 52 -7 104 -7 156c0 115 55 224 149 292c3 2 7 3 10 3c4 0 7 0 10 -3		c71 -84 133 -245 133 -358c0 -143 -86 -255 -180 -364c21 -68 39 -138 56 -207zM461 -203c68 24 113 95 113 164c0 90 -66 179 -173 190c24 -116 46 -231 60 -354zM74 28c0 -135 129 -247 264 -247c28 0 55 2 82 6c-14 127 -37 245 -63 364c-79 -8 -124 -61 -124 -119		c0 -44 25 -91 81 -123c5 -5 7 -10 7 -15c0 -11 -10 -22 -22 -22c-3 0 -6 1 -9 2c-80 43 -117 115 -117 185c0 88 58 174 160 197c-14 58 -29 117 -46 175c-107 -121 -213 -243 -213 -403zM408 1045c-99 -48 -162 -149 -162 -259c0 -74 18 -133 36 -194		c80 97 146 198 146 324c0 55 -4 79 -20 129z",
		"M378 263c4 0 7 1 11 1c156 0 257 -129 257 -262c0 -76 -34 -154 -108 -210c-22 -17 -46 -29 -72 -37c3 -34 4 -68 4 -102c0 -20 0 -40 -1 -60c-7 -121 -90 -228 -209 -228c-108 0 -196 87 -196 196c0 58 53 104 112 104c54 0 95 -48 95 -104c0 -52 -43 -95 -95 -95		c-10 0 -20 2 -29 6c26 -38 68 -63 116 -63c95 0 156 91 162 190c1 19 2 37 2 56c0 30 -2 60 -4 90c-29 -5 -58 -8 -88 -8c-188 0 -333 173 -333 375c0 177 130 307 246 442c-20 62 -38 125 -46 190c-6 52 -7 104 -7 157c0 115 55 223 148 290c3 2 7 3 11 3s8 -1 11 -4		c71 -83 134 -244 134 -357c0 -143 -85 -255 -178 -364c21 -68 40 -137 57 -206zM462 -202c67 24 111 94 111 162c0 89 -65 178 -170 190c24 -115 46 -230 59 -352zM75 26c0 -134 129 -245 263 -245c28 0 55 2 81 6c-14 126 -36 244 -61 363c-79 -8 -124 -61 -124 -119		c0 -43 25 -89 80 -121c5 -5 7 -11 7 -16c0 -12 -10 -23 -22 -23c-3 0 -6 1 -9 2c-81 43 -118 116 -118 186c0 89 58 175 161 198c-14 58 -29 116 -46 173c-106 -122 -212 -244 -212 -404zM406 1042c-99 -47 -162 -148 -162 -257c0 -73 20 -132 38 -191		c79 97 144 199 144 324c0 53 -4 76 -20 124z",
		"M519 1c0 -82 -56 -169 -141 -198c2 -26 3 -53 3 -79c0 -17 -1 -33 -2 -50c-6 -99 -76 -187 -174 -187c-88 0 -158 72 -158 161c0 46 42 83 90 83c43 0 76 -38 76 -83c0 -42 -34 -76 -76 -76h-9c19 -25 47 -41 80 -41c75 0 123 72 128 149c1 15 1 31 1 46c0 22 0 44 -2 66		c-22 -4 -44 -5 -67 -5c-152 0 -266 140 -266 303c0 144 99 253 189 367c-17 52 -32 105 -38 160c-5 43 -5 86 -5 129c0 92 41 179 113 237c3 3 7 4 11 4s9 -1 12 -4c58 -69 108 -202 108 -295c0 -114 -62 -207 -133 -297c18 -59 34 -118 48 -178c2 0 3 1 5 1		c126 0 207 -105 207 -213zM374 -154c49 20 80 74 80 124c0 67 -48 134 -125 146c18 -88 35 -176 45 -270zM64 17c0 -103 102 -186 207 -186c20 0 40 1 60 4c-11 98 -28 190 -47 282c-59 -7 -93 -48 -93 -92c0 -34 20 -69 63 -93c5 -5 7 -11 7 -16c0 -12 -10 -23 -22 -23		c-3 0 -7 1 -10 2c-65 35 -95 94 -95 151c0 72 47 142 129 162c-11 47 -24 94 -38 141c-81 -101 -161 -203 -161 -332zM317 857c-76 -43 -122 -123 -122 -210c0 -55 16 -101 30 -146c58 79 105 161 105 260c0 41 -3 58 -13 96z",
		"M374 260c5 0 10 1 15 1c154 0 254 -127 254 -259c0 -76 -33 -153 -107 -208c-22 -17 -47 -29 -73 -37c3 -36 5 -72 5 -108c0 -19 0 -37 -1 -56c-7 -120 -88 -226 -206 -226c-108 0 -195 87 -195 195c0 58 53 104 112 104c54 0 95 -48 95 -104c0 -52 -43 -95 -95 -95		c-12 0 -24 4 -35 9c26 -41 70 -70 121 -70c96 0 157 93 163 193c1 18 2 35 2 53c0 32 -2 64 -5 96c-29 -5 -58 -8 -89 -8c-188 0 -333 171 -333 372c0 178 133 306 251 440c-18 63 -35 126 -42 191c-6 51 -7 102 -7 154c0 116 55 226 150 295c2 2 5 3 8 3s6 -1 8 -3		c70 -84 132 -246 132 -359c0 -144 -87 -256 -183 -365c20 -69 39 -138 55 -208zM459 -205c69 24 117 96 117 166c0 92 -69 184 -179 193c25 -117 48 -235 62 -359zM71 31c0 -136 131 -251 267 -251c28 0 55 2 82 6c-15 128 -38 247 -64 367c-79 -9 -125 -62 -125 -121		c0 -44 26 -92 82 -124c4 -4 7 -9 7 -14c0 -11 -9 -21 -20 -21c-3 0 -6 1 -9 2c-80 43 -116 114 -116 184c0 88 57 173 158 196c-14 60 -30 119 -46 178c-108 -121 -216 -242 -216 -402zM411 1050c-99 -50 -161 -151 -161 -262c0 -76 15 -137 33 -200c82 97 149 198 149 325		c0 58 -4 84 -21 137z",
	].map(simplifyPath)),
	pathSymbol("CLEF BASS HEAD", "M557 -125c0 28 23 52 51 52s52 -24 52 -52s-24 -52 -52 -52s-51 24 -51 52zM557 125c0 28 23 52 51 52s52 -24 52 -52s-24 -52 -52 -52s-51 24 -51 52zM232 262c171 0 293 -88 293 -250c0 -263 -264 -413 -517 -520c-3 -3 -5 -4 -8 -4c-6 0 -12 6 -12 12c0 3 1 5 4 8 c203 118 413 265 413 494c0 120 -64 236 -173 236c-77 0 -133 -55 -159 -129c13 6 25 10 39 10c55 0 100 -45 100 -100c0 -58 -44 -106 -100 -106c-60 0 -112 47 -112 106c0 132 102 243 232 243z"),
	pathFrameSymbol("CLEF BASS", simplifyPath("M557 -125c0 28 23 52 51 52s52 -24 52 -52s-24 -52 -52 -52s-51 24 -51 52zM557 125c0 28 23 52 51 52s52 -24 52 -52s-24 -52 -52 -52s-51 24 -51 52zM232 262c171 0 293 -88 293 -250c0 -263 -264 -413 -517 -520c-3 -3 -5 -4 -8 -4c-6 0 -12 6 -12 12c0 3 1 5 4 8	c203 118 413 265 413 494c0 120 -64 236 -173 236c-77 0 -133 -55 -159 -129c13 6 25 10 39 10c55 0 100 -45 100 -100c0 -58 -44 -106 -100 -106c-60 0 -112 47 -112 106c0 132 102 243 232 243z")),
	pathSymbol("CLEF TREBLE SUB", "M517 1c0 -82 -56 -169 -141 -197c2 -28 3 -54 3 -82c0 -16 0 -32 -1 -48c-6 -98 -75 -185 -172 -185c-87 0 -158 72 -158 160c0 46 42 83 90 83c43 0 76 -38 76 -83c0 -42 -34 -76 -76 -76c-4 0 -8 0 -12 1c19 -27 49 -44 83 -44c75 0 123 72 128 150c1 15 2 29 2 44 c0 24 -1 46 -3 70c-22 -4 -45 -5 -68 -5c-151 0 -266 139 -266 301c0 144 101 253 192 366c-16 53 -29 106 -35 161c-4 42 -5 84 -5 127c0 93 42 182 115 240c5 4 13 5 18 0c57 -70 107 -203 107 -296c0 -115 -65 -208 -137 -298c17 -59 33 -119 47 -179c2 0 6 1 8 1 c125 0 205 -104 205 -211zM372 -155c50 20 83 75 83 126c0 69 -50 137 -130 148c19 -90 36 -179 47 -274zM61 20c0 -105 104 -190 210 -190c21 0 41 1 61 4c-11 99 -29 192 -49 285c-60 -8 -94 -49 -94 -93c0 -34 20 -71 64 -96c5 -4 7 -9 7 -14c0 -11 -9 -22 -21 -22 c-3 0 -6 1 -9 2c-65 35 -94 93 -94 150c0 71 46 140 127 160c-12 49 -24 97 -38 145c-82 -101 -164 -202 -164 -331zM321 863c-76 -44 -123 -125 -123 -213c0 -58 14 -106 28 -154c60 79 109 162 109 262c0 45 -3 64 -14 105z"),
	pathSymbol("CLEF BASS SUB", "M445 -100c0 23 19 41 42 41s41 -18 41 -41s-18 -41 -41 -41s-42 18 -42 41zM445 100c0 23 19 41 42 41s41 -18 41 -41s-18 -41 -41 -41s-42 18 -42 41zM180 212c140 0 240 -68 240 -199c0 -211 -210 -334 -412 -421c-3 -3 -5 -4 -8 -4c-6 0 -12 6 -12 12c0 3 1 5 4 8 c151 98 308 217 308 394c0 93 -38 186 -120 186c-54 0 -92 -39 -110 -92c6 2 13 3 20 3c44 0 80 -36 80 -80c0 -46 -35 -85 -80 -85c-48 0 -90 38 -90 85c0 104 78 193 180 193z"),

	pathFrameSymbol("BRACE", "M- -c - - - - -c -  -  -c - - - - -c-  -  - c     c  -  - c-  -  - s   c     c  -  - c      c   -  -c- - - - - -c -  -  -c - - - - -c -  -  -z"),
	pathFrameSymbol("BRACE", "M- -c - - - - -c -  -  -c - - - - -c-  -  - c     c  -  - vvc     c  -  - c     c   -  - c- - - - - -c -  -  -c - - - - -c -  -  -z"),
	pathFrameSymbol("BRACE", "M- -c - - - - -c -  -  -c - - - - -c-  -  - c     c  -  - c  -  - s   c     c  -  - c      c   -  -c- - - - - -c -  -  -c - - - - -c -  -  -z"),
	pathFrameSymbol("BRACE", "M- -c - - - - -c -  -  -c - - - - -c-  -  - c     c  -  - c-  -  - s   c     c  -  - c     c   -  -c- - - - - -c -  -  -c - - - - -c -  -  -z"),

	pathFrameSymbol("SLUR", "M. -.C. -. . -. . -.C. -. . -. . -.z"),
	pathFrameSymbol("SLUR", "M. .C. . . . . .C. . . . . .z"),

	conditionSymbol("STAVES_CONNECTION",
		elem => elem.identity.type === "rect" && (elem.identity.rw === 0.25 || elem.identity.rw === 0.15 || elem.identity.rw === 0.1) && elem.identity.height >= 12,
		elem => ({height: elem.identity.height})),

	conditionSymbol("VERTICAL_LINE", elem => elem.identity.type === "rect"
		&& (elem.identity.rw === 0.15 || elem.identity.rw === 0.45 || elem.identity.rw === 0.4 || elem.identity.rw === 0.55 || elem.identity.rw === 0.6 || elem.identity.rw === 0.75 || elem.identity.rw === 0.1) && elem.identity.height >= 1),

	conditionSymbol("STAFF_LINE", elem => elem.identity.type === "line" && elem.identity.height === 0 && elem.identity.width > 10 && !elem.identity["stroke-dasharray"]),

	conditionSymbol("ADDITIONAL_LINE", elem => elem.identity.type === "rect" && elem.identity.rh === 0.2 && elem.identity.rw >= 1.75 && elem.identity.rw <= 2),

	// TODO: limit scale of NUMBER as TIME_SIG
	pathFrameSymbol("NUMBER 3", "M c-  - - - -c -  -  -c - - - - -s-  - c     c   -  -c - - - - -c- - - - - -s -  -c -  -  -c - - - - -c-  -  - c     s -  -c - - - - -c -  -  -c     vc  -  - h-c-  -  - s   hc     vc  -  - z"),
	pathFrameSymbol("NUMBER 4", "M c     c     c     c   -  -v-hc   -  -s- - - -h-v-c -  -  -c   -  -s- - - -c-  -  - s- - - -c-  -  - s   c     vh-c-  -  - c     c     c     c -  -  -s   c     c   -  -c -  - - -l- -hvc     z"),

	pathFramesScaleSymbol("TIME_SIG C", [
		"M360 26c-50 0 -76 43 -76 76c0 39 27 78 73 78c5 0 11 -1 16 -2c-29 37 -74 60 -123 60c-106 0 -113 -73 -113 -185c0 -17 1 -35 1 -53s-1 -36 -1 -53c0 -112 7 -185 113 -185c81 0 142 69 161 151c1 6 6 9 11 9c6 0 12 -4 12 -11c0 -94 -106 -173 -184 -173 c-68 0 -137 21 -184 70c-49 51 -66 122 -66 192s17 141 66 192c47 49 116 70 184 70c87 0 162 -64 177 -150c1 -5 1 -9 1 -13c0 -40 -31 -73 -68 -73z",
		"M360 25c-51 0 -76 43 -76 77c0 39 28 78 74 78c6 0 13 0 18 -1c-29 37 -76 60 -126 60c-106 0 -113 -73 -113 -185c0 -17 1 -35 1 -54s-1 -37 -1 -54c0 -112 7 -185 113 -185c82 0 145 68 164 151c1 6 6 9 10 9c6 0 11 -4 11 -11c0 -94 -107 -171 -185 -171		c-68 0 -137 20 -184 69c-49 51 -66 122 -66 192s17 141 66 192c47 49 116 69 184 69c88 0 163 -62 178 -148c1 -5 2 -9 2 -14c0 -40 -32 -74 -70 -74z",
		"M359 27c-49 0 -75 42 -75 75c0 38 27 77 72 77c4 0 9 0 14 -1c-28 37 -72 59 -120 59c-106 0 -113 -73 -113 -186v-51v-51c0 -113 7 -187 113 -187c80 0 139 70 158 151c2 7 7 10 12 10c6 0 13 -4 13 -12c0 -94 -105 -174 -183 -174c-68 0 -137 21 -184 70		c-49 51 -66 122 -66 193s17 142 66 193c47 49 116 69 184 69c87 0 160 -63 175 -149c1 -5 1 -10 1 -14c0 -40 -30 -72 -67 -72z",
		"M352 35c-45 0 -68 38 -68 68c0 35 25 69 65 70c-23 35 -57 58 -99 58c-108 0 -113 -77 -113 -195c0 -12 1 -24 1 -36s-1 -24 -1 -36c0 -118 5 -195 113 -195c73 0 120 71 137 147c2 10 10 15 18 15c10 0 19 -8 19 -19v-4c-21 -93 -83 -177 -174 -177		c-69 0 -137 21 -184 71c-49 53 -66 126 -66 198s17 145 66 198c47 50 115 71 184 71c84 0 147 -72 162 -157c1 -4 1 -8 1 -12c0 -36 -28 -65 -61 -65z",
		"M353 33c-46 0 -69 40 -69 70c0 36 25 71 67 71h3c-24 35 -61 59 -104 59c-107 0 -113 -76 -113 -193c0 -13 1 -26 1 -40s-1 -27 -1 -40c0 -117 6 -193 113 -193c75 0 124 71 142 148c2 9 9 14 16 14c9 0 18 -7 18 -17v-4c-21 -93 -85 -175 -176 -175		c-69 0 -137 21 -184 71c-49 52 -66 124 -66 196s17 144 66 196c47 50 115 71 184 71c84 0 150 -70 165 -155c1 -4 1 -8 1 -12c0 -37 -29 -67 -63 -67z",
	].map(simplifyPath), 0.004),
	pathFramesScaleSymbol("TIME_SIG 2", [
		"M0 12c15 174 236 164 236 343c0 60 -21 123 -73 123c-25 0 -49 -14 -49 -37c0 -27 35 -41 35 -68c0 -38 -31 -69 -69 -69s-69 31 -69 69c0 75 72 127 152 127c96 0 186 -56 186 -145c0 -155 -156 -160 -253 -224c10 2 20 4 31 4c33 0 68 -11 103 -35 c22 -15 47 -24 68 -24s38 9 43 29c2 6 6 8 10 8c6 0 12 -4 12 -11c0 -65 -87 -102 -135 -102c-35 0 -70 14 -95 43c-13 16 -32 23 -49 23c-30 0 -59 -22 -62 -56c-1 -7 -6 -10 -11 -10c-6 0 -12 4 -11 12z",
		"M0 12c15 174 236 164 236 343c0 60 -21 123 -73 123c-25 0 -49 -14 -49 -37c0 -27 35 -41 35 -68c0 -38 -31 -69 -69 -69s-69 31 -69 69c0 75 72 127 152 127c96 0 186 -56 186 -145c0 -155 -156 -160 -253 -224c10 2 20 4 31 4c33 0 68 -11 103 -35 c22 -15 47 -24 68 -24s38 9 43 29c2 6 6 8 10 8c6 0 12 -4 12 -11c0 -65 -87 -102 -135 -102c-35 0 -70 14 -95 43c-13 16 -32 23 -49 23c-30 0 -59 -22 -62 -56c-1 -7 -6 -10 -11 -10c-6 0 -12 4 -11 12z",
	].map(simplifyPath), 0.004),
	pathFramesScaleSymbol("TIME_SIG 3", [
		"M148 478c-28 0 -58 -9 -58 -33c0 -22 36 -25 36 -47c0 -32 -25 -58 -57 -58s-58 26 -58 58c0 64 67 102 137 102c90 0 168 -33 168 -114c0 -43 -4 -83 -42 -101c-9 -4 -14 -13 -14 -21s5 -17 14 -21c41 -19 56 -57 56 -103c0 -91 -78 -140 -177 -140 c-78 0 -153 41 -153 112c0 36 30 66 66 66s65 -30 65 -66c0 -25 -40 -28 -40 -53c0 -26 32 -37 62 -37c49 0 64 61 64 118v7c0 58 -1 103 -52 103h-80c-9 0 -14 7 -14 14s5 14 14 14h80c52 0 52 48 52 108c0 55 -19 92 -69 92z",
		"M153 474c-30 0 -63 -8 -63 -34c0 -21 35 -25 35 -46c0 -31 -25 -56 -56 -56s-56 25 -56 56c0 66 68 106 140 106c92 0 171 -32 171 -114c0 -42 -6 -79 -43 -96c-10 -5 -15 -15 -15 -25s5 -19 15 -24c41 -19 58 -56 58 -101c0 -93 -81 -140 -182 -140		c-80 0 -157 43 -157 116c0 35 29 64 64 64s64 -29 64 -64c0 -24 -39 -29 -39 -53c0 -29 35 -37 68 -37c47 0 59 59 59 114v28c0 47 -2 81 -46 81h-77c-11 0 -16 8 -16 16s5 16 16 16h77c44 0 46 37 46 86v19c0 53 -15 88 -63 88z",
		"M147 479c-28 0 -58 -9 -58 -33c0 -22 36 -25 36 -47c0 -32 -25 -57 -57 -57s-57 25 -57 57c0 63 66 101 136 101c90 0 165 -35 165 -115c0 -44 -3 -83 -41 -101c-8 -4 -13 -12 -13 -20s5 -16 13 -20c41 -19 55 -58 55 -104c0 -91 -77 -140 -175 -140		c-77 0 -151 41 -151 111c0 36 29 65 65 65s65 -29 65 -65c0 -25 -40 -28 -40 -53c0 -26 31 -37 61 -37c50 0 66 61 66 119c0 62 -1 110 -54 110h-82c-9 0 -13 7 -13 14s4 13 13 13h82c52 0 54 47 54 108c0 56 -18 94 -70 94z",
		"M150 477c-29 0 -59 -8 -59 -33c0 -22 36 -25 36 -47c0 -32 -26 -58 -58 -58s-57 26 -57 58c0 65 67 103 138 103c91 0 169 -33 169 -114c0 -43 -4 -82 -42 -100c-9 -4 -14 -12 -14 -21s5 -18 14 -22c41 -19 56 -57 56 -103c0 -92 -79 -140 -179 -140		c-79 0 -154 42 -154 113c0 36 30 66 66 66s65 -30 65 -66c0 -25 -40 -28 -40 -53c0 -27 32 -37 63 -37c49 0 63 61 63 117v16c0 54 -2 94 -50 94h-80c-10 0 -14 8 -14 15s4 14 14 14h80c49 0 50 43 50 99v8c0 54 -18 91 -67 91z",
	].map(simplifyPath), 0.004),
	pathFramesScaleSymbol("TIME_SIG 4", [
		"M198 113h113c0 -47 28 -91 71 -91c7 0 11 -5 11 -11s-4 -11 -11 -11c-43 0 -84 13 -127 13s-85 -13 -128 -13c-7 0 -11 5 -11 11s4 11 11 11c43 0 71 44 71 91zM206 312c22 14 44 28 59 49c11 15 17 33 25 50c4 10 21 6 21 -8v-250h71c9 0 14 -7 14 -14s-5 -14 -14 -14 h-71v-12h-113v12h-170c-22 0 -30 13 -30 22c0 2 1 5 2 6c81 94 141 207 141 331c0 10 8 19 16 16c22 -7 45 -13 69 -13s47 6 69 13c13 4 22 -9 16 -16l-283 -331h170v138c0 8 1 17 8 21z",
		"M201 296c23 15 46 29 62 51c12 16 20 35 28 52c2 4 6 6 10 6c7 0 14 -5 14 -15v-233h76c11 0 16 -8 16 -16s-5 -16 -16 -16h-76v-2c0 -50 30 -97 77 -97c9 0 12 -7 12 -13s-3 -13 -12 -13c-46 0 -92 13 -138 13s-93 -13 -139 -13c-9 0 -12 7 -12 13s3 13 12 13		c47 0 77 47 77 97v2h-160c-26 0 -34 15 -34 25c0 3 1 6 2 7c79 91 131 205 131 325c0 11 8 21 18 18c24 -7 49 -13 74 -13s50 6 74 13c2 1 3 1 5 1c9 0 15 -7 15 -13c0 -2 0 -4 -2 -6l-283 -325h160v115c0 9 1 19 9 24z",
		"M201 296c23 15 46 29 62 51c12 16 20 35 28 52c2 4 6 6 10 6c7 0 14 -5 14 -15v-233h76c11 0 16 -8 16 -16s-5 -16 -16 -16h-76v-2c0 -50 30 -97 77 -97c9 0 12 -7 12 -13s-3 -13 -12 -13c-46 0 -92 13 -138 13s-93 -13 -139 -13c-9 0 -12 7 -12 13s3 13 12 13		c47 0 77 47 77 97v2h-160c-26 0 -34 15 -34 25c0 3 1 6 2 7c79 91 131 205 131 325c0 10 7 18 15 18h3c24 -7 49 -13 74 -13s50 6 74 13c2 1 3 1 5 1c9 0 15 -7 15 -13c0 -2 0 -4 -2 -6l-283 -325h160v115c0 9 1 19 9 24z",
		"M206 312c22 14 44 28 59 49c11 15 17 33 25 50c4 10 21 6 21 -8v-250h71c9 0 14 -7 14 -14s-5 -14 -14 -14h-71v-12c0 -47 28 -91 71 -91c7 0 11 -5 11 -11s-4 -11 -11 -11c-43 0 -84 13 -127 13s-85 -13 -128 -13c-7 0 -11 5 -11 11s4 11 11 11c43 0 71 44 71 91v12		h-170c-22 0 -30 13 -30 22c0 2 1 5 2 6c81 94 141 207 141 331c0 9 6 16 13 16h3c22 -7 45 -13 69 -13s47 6 69 13c2 1 3 1 5 1c10 0 16 -11 11 -17l-283 -331h170v138c0 8 1 17 8 21z",
		"M208 319c21 13 42 27 57 47c11 15 18 32 25 49c4 9 20 7 20 -7v-256h68c9 0 13 -7 13 -14s-4 -13 -13 -13h-68v-16c0 -45 26 -88 68 -88c7 0 10 -5 10 -10s-3 -11 -10 -11c-41 0 -82 13 -123 13s-82 -13 -123 -13c-7 0 -10 6 -10 11s3 10 10 10c42 0 68 43 68 88v16h-173		c-21 0 -29 13 -29 21c0 2 1 5 2 6c81 96 146 208 146 333c0 8 5 15 12 15h3c22 -7 44 -13 67 -13s45 6 67 13c2 1 2 1 4 1c10 0 16 -10 11 -16l-283 -333h173v147c0 8 2 16 8 20z",
		"M204 307c22 14 44 29 60 50c11 15 19 33 27 50c2 4 5 6 9 6c6 0 13 -5 13 -14v-245h72c10 0 15 -7 15 -14s-5 -15 -15 -15h-72v-8c0 -48 27 -94 72 -94c8 0 12 -5 12 -11s-4 -12 -12 -12c-44 0 -87 13 -131 13s-87 -13 -131 -13c-8 0 -12 6 -12 12s4 11 12 11		c45 0 73 46 73 94v8h-167c-23 0 -31 14 -31 23c0 3 1 5 2 6c80 93 138 207 138 330c0 9 6 16 13 16h3c23 -7 47 -13 71 -13s48 6 71 13c2 1 3 1 5 1c11 0 18 -10 12 -17l-284 -330h167v131c0 8 1 17 8 22z",
	].map(simplifyPath), 0.004),
	pathFramesScaleSymbol("TIME_SIG 6", [
		"M168 256c-54 0 -55 -49 -55 -112v-5v-5c0 -63 1 -112 55 -112c57 0 63 51 63 117s-6 117 -63 117zM113 264c18 7 36 14 55 14c100 0 169 -45 169 -139s-69 -139 -169 -139c-112 0 -168 125 -168 250c0 128 71 250 188 250c70 0 137 -38 137 -102c0 -36 -29 -66 -65 -66 s-66 30 -66 66c0 24 39 25 39 49c0 20 -22 31 -45 31c-68 0 -76 -68 -76 -145c0 -23 1 -46 1 -69z",
	].map(simplifyPath), 0.004),
	pathFramesScaleSymbol("TIME_SIG 8", [
		"M256 287c28 30 51 62 51 102c0 55 -57 89 -118 89c-48 0 -76 -37 -76 -73c0 -21 9 -42 30 -54zM284 270c55 -32 84 -78 84 -127c0 -73 -65 -143 -187 -143c-93 0 -181 53 -181 139c0 51 39 85 77 120c-42 28 -63 69 -63 108c0 67 61 133 175 133c81 0 160 -39 160 -111 c0 -47 -31 -85 -65 -119zM106 242c-33 -29 -64 -59 -64 -103c0 -69 66 -117 139 -117c55 0 87 43 87 84c0 25 -11 50 -36 64z",
	].map(simplifyPath), 0.004),

	identitySymbol("ALTER FLAT", {
		type: "path",
		scale: {x: 0.004, y: -0.004},
		d: "M26 43l-1 -68v-11c0 -22 0 -44 3 -66c46 38 95 80 95 139c0 34 -14 68 -44 68c-31 0 -52 -29 -53 -62zM-14 -137l-12 598c8 5 17 6 26 6s18 -1 26 -6l-7 -348c25 20 57 32 90 32c52 0 91 -47 91 -101c0 -81 -88 -118 -150 -169c-15 -12 -22 -35 -42 -35 c-12 0 -22 10 -22 23z",
	}),
	pathFrameSymbol("ALTER FLAT", simplifyPath("M26 43l-1 -68v-11c0 -22 0 -44 3 -66c46 38 95 80 95 139c0 34 -14 68 -44 68c-31 0 -52 -29 -53 -62zM-14 -137l-12 598c8 5 17 6 26 6s18 -1 26 -6l-7 -348c25 20 57 32 90 32c52 0 91 -47 91 -101c0 -81 -88 -118 -150 -169c-15 -12 -22 -35 -42 -35	c-12 0 -22 10 -22 23z")),
	identitySymbol("ALTER SHARP", {
		type: "path",
		scale: {x: 0.004, y: -0.004},
		d: "M216 -314c0 -10 -8 -18 -18 -18s-18 8 -18 18v148l-85 -31v-160c0 -10 -8 -18 -18 -18s-18 8 -18 18v148l-35 -13c-2 -1 -4 -1 -6 -1c-9 0 -18 8 -18 18v62c0 8 5 14 12 17l47 17v162l-35 -13c-2 -1 -4 -1 -6 -1c-9 0 -18 8 -18 18v63c0 8 5 14 12 17l47 17v160 c0 10 8 18 18 18s18 -8 18 -18v-148l85 31v160c0 10 8 18 18 18s18 -8 18 -18v-148l35 13c2 1 4 1 6 1c9 0 18 -8 18 -18v-62c0 -8 -5 -14 -12 -17l-47 -17v-162l35 13c2 1 4 1 6 1c9 0 18 -8 18 -18v-63c0 -8 -5 -14 -12 -17l-47 -17v-160zM95 66v-162l85 30v162z",
	}),
	pathFrameSymbol("ALTER SHARP", simplifyPath("M216 -314c0 -10 -8 -18 -18 -18s-18 8 -18 18v148l-85 -31v-160c0 -10 -8 -18 -18 -18s-18 8 -18 18v148l-35 -13c-2 -1 -4 -1 -6 -1c-9 0 -18 8 -18 18v62c0 8 5 14 12 17l47 17v162l-35 -13c-2 -1 -4 -1 -6 -1c-9 0 -18 8 -18 18v63c0 8 5 14 12 17l47 17v160	c0 10 8 18 18 18s18 -8 18 -18v-148l85 31v160c0 10 8 18 18 18s18 -8 18 -18v-148l35 13c2 1 4 1 6 1c9 0 18 -8 18 -18v-62c0 -8 -5 -14 -12 -17l-47 -17v-162l35 13c2 1 4 1 6 1c9 0 18 -8 18 -18v-63c0 -8 -5 -14 -12 -17l-47 -17v-160zM95 66v-162l85 30v162z")),
	/*identitySymbol("ALTER NATURAL", {
		type: "path",
		scale: {x: 0.004, y: -0.004},
		d: "M-7 375c7 4 16 6 24 6s17 -2 24 -6l-2 -179l108 19h3c9 0 17 -8 17 -17l7 -573c-7 -4 -16 -6 -24 -6s-17 2 -24 6l2 179l-108 -19h-3c-9 0 -17 8 -17 17zM132 113l-94 -16l-3 -210l94 16z",
	}),*/
	pathFramesScaleSymbol("ALTER NATURAL", [
		"M-7 375c7 4 16 6 24 6s17 -2 24 -6l-2 -179l108 19h3c9 0 17 -8 17 -17l7 -573c-7 -4 -16 -6 -24 -6s-17 2 -24 6l2 179l-108 -19h-3c-9 0 -17 8 -17 17zM132 113l-94 -16l-3 -210l94 16z",
		"M-8 375c8 5 17 7 26 7s18 -2 26 -7l-3 -187l104 21h4c10 0 18 -8 18 -18l7 -566c-8 -5 -16 -7 -25 -7s-18 2 -26 7l2 187l-103 -21h-4c-10 0 -18 8 -18 18zM130 111l-90 -18l-3 -204l90 18z",
	].map(simplifyPath), 0.004),
	pathFramesScaleSymbol("ALTER FLATFLAT", [
		"M191 39l-1 -64v-11c0 -22 1 -43 4 -65c43 38 85 81 85 138c0 32 -11 66 -39 66c-30 0 -48 -31 -49 -64zM19 39l-1 -64v-11c0 -23 1 -45 4 -68c39 39 70 86 70 141c0 32 -6 66 -33 66c-28 0 -39 -32 -40 -64zM147 -139l-2 105c-26 -33 -64 -60 -95 -91		c-14 -14 -20 -41 -41 -41c-14 0 -25 13 -25 27l-12 593c9 5 18 8 28 8s19 -3 28 -8l-7 -343c17 22 43 36 71 36c19 0 36 -8 49 -20l-7 327c9 5 18 8 28 8s20 -3 29 -8l-8 -343c24 23 56 36 89 36c52 0 90 -48 90 -102c0 -79 -84 -118 -144 -170c-16 -14 -24 -41 -46 -41		c-14 0 -25 13 -25 27z",
	].map(simplifyPath), 0.004),

	conditionSymbol("OCTAVE A", elem => elem.identity.type === "text" && /8va/.test(elem.identity.text)),
	conditionSymbol("OCTAVE B", elem => elem.identity.type === "text" && /8vb/.test(elem.identity.text)),
	identitySymbol("OCTAVE CLOSE", {
		type: "line",
		width: 0,
		height: 1.25,
		"stroke-width": 0.0924,
		"stroke-dasharray": "0.362351432995067,0.537648567004933",
	}),
	conditionSymbol("OCTAVE CLOSE", elem => elem.identity.type === "line" && elem.identity.height === 0.8
		&& elem.identity.width === 0 && elem.identity["stroke-dasharray"] === "1.0,0.0" && elem.identity["stroke-width"] < 0.1),

	pathFrameSymbol("DOT", "M c     s -  -s- - - -s-  - z"),

	conditionSymbol("NULL LARGE_RECT", elem => elem.identity.type === "rect" && (elem.identity.height > 1) && elem.identity.width >= 7 && elem.rx <= 0 && elem.ry <= 0),
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
