
import {TOKEN_PRECISION} from "./utils";



const parseLink = link => {
	const [_, line, c1, c2] = link.match(/(\d+):(\d+):(\d+)/);
	return [line, c1, c2].map(Number);
};

const compareLinks = (link1, link2) => {
	const n1 = parseLink(link1);
	const n2 = parseLink(link2);

	return n1[0] === n2[0] ? (n1[1] * 1e4 + n1[2] - n2[1] * 1e4 - n2[2]) : n1[0] - n2[0];
};


const tokensRowsSplit = tokens => {
	const pageHeight = Math.max(...tokens.map(token => token.y));
	const pageTile = Array(Math.round(pageHeight)).fill(-1);

	const connections = tokens.filter(token => token.is("STAVES_CONNECTION"));
	connections.forEach((connection, i) => {
		for (let y = Math.round(connection.y) - 1; y <= Math.round(connection.y + connection.height) + 1; ++y) 
			pageTile[y] = i;
	});

	const addlineYs = tokens.filter(token => token.is("ADDITIONAL_LINE")).map(token => Math.round(token.y)).sort((y1, y2) => y1 - y2);
	addlineYs.forEach(y => {
		if (pageTile[y] >= 0)
			pageTile[y + 1] = pageTile[y];
	});
	addlineYs.reverse().forEach(y => {
		if (pageTile[y] >= 0)
			pageTile[y - 1] = pageTile[y];
	});
	//console.log("pageTile:", pageTile);

	const linkedTokens = tokens
		.filter(token => token.href)
		.sort((t1, t2) => compareLinks(t1.href, t2.href));

	const rows = [];

	if (connections.length > 1) {
		let row = 0;
		let lastToken = null;
		let lastTileIndex = 0;
		for (const token of linkedTokens) {
			const tileIndex = pageTile[Math.round(token.y)];
			//console.log("tileIndex:", tileIndex, lastTileIndex, row);

			if (lastToken) {
				// detect next voice
				if (token.y - lastToken.y < -4 && token.x - lastToken.x < -10)
					break;

				// detect next row
				if (token.href !== lastToken.href && tileIndex > lastTileIndex /*(
					(token.y - lastToken.y > 24 && token.x - lastToken.x < -10)
					|| (token.y - lastToken.y > 4 && token.x - lastToken.x < -20)
				)*/) {
					//console.log("y plus:", token.y - lastToken.y);
					++row;
					lastTileIndex = Math.max(lastTileIndex, tileIndex);
				}
			}
	
			rows[row] = rows[row] || [];
			rows[row].push(token);
	
			lastToken = token;
		}
	}

	const rowBoundaries = rows.map(elems => Math.min(...elems.map(elem => elem.y)) - 2.5);
	rowBoundaries[0] = -Infinity;

	return Array(rowBoundaries.length).fill(null)
		.map((_, i) => tokens
			.filter(token => token.y >= rowBoundaries[i] && (i >= rowBoundaries.length - 1 || token.y < rowBoundaries[i + 1]))
			.sort((t1, t2) => t1.x - t2.x),
		);
};


const isRowToken = token => token.is("STAVES_CONNECTION") || token.is("BRACE") || token.is("VERTICAL_LINE");


const parseTokenRow = tokens => {
	const separatorYs : Set<number> = new Set();
	tokens.filter(token => token.is("MEASURE_SEPARATOR")).forEach(token => separatorYs.add(token.ry));
	//console.log("separatorYs:", separatorYs);

	const staffLines = tokens.filter(token => token.is("STAFF_LINE")).reduce((lines, token) => {
		lines[token.ry] = token;
		return lines;
	}, {});
	//console.log("staffLines:", staffLines);

	const staffYs = Array.from(separatorYs)
		.map(y => staffLines[y] ? y : y + TOKEN_PRECISION).map(y => y + 2)
		.sort((y1, y2) => y1 - y2);

	const additionalLinesYs = tokens.filter(token => token.is("ADDITIONAL_LINE")).reduce((ys, token) => {
		ys.add(token.ry);
		return ys;
	}, new Set());

	for (const y of staffYs) {
		console.assert(staffLines[y - 2] && staffLines[y] && staffLines[y + 2],
			"no corresponding staff lines for separator", y - 2, Object.keys(staffLines));
	}

	const rowY = staffYs[0] - 2;
	const rowX = staffLines[rowY] && staffLines[rowY].rx;

	const symbolYs = tokens.filter(token => token.symbol).map(token => token.ry);

	const top = Math.min(...symbolYs) - rowY;
	const bottom = Math.max(...symbolYs) - rowY;

	//console.log("additionalLinesYs:", additionalLinesYs);
	const splitters = [];
	for (let i = 0; i < staffYs.length - 1; ++i) {
		let up = staffYs[i] + 2;
		while (additionalLinesYs.has(up + 1) || additionalLinesYs.has(up + 0.75))
			++up;

		let down = staffYs[i + 1] - 2;
		while (additionalLinesYs.has(down - 1) || additionalLinesYs.has(down - 1.25))
			--down;

		const splitter = Math.min(Math.max((staffYs[i] + staffYs[i + 1]) / 2, up + 1), down - 1) - rowY;
		splitters.push(splitter);

		//console.log("splitters:", splitters, up, down);
	}
	splitters.push(Infinity);

	const staffTokens = [];
	//console.log("splitters:", splitters);
	const appendToken = token => {
		let index = 0;
		while (token.ry > splitters[index])
			++index;

		staffTokens[index] = staffTokens[index] || [];
		staffTokens[index].push(token);
	};

	const localTokens = tokens.map(token => token.translate({x: rowX, y: rowY}));

	localTokens
		.filter(token => !isRowToken(token))
		.forEach(appendToken);

	return {
		//staffYs,
		x: rowX,
		y: rowY,
		top,
		bottom,
		tokens: localTokens.filter(isRowToken),
		staves: staffYs.map((y, i) => staffTokens[i] && parseTokenStaff(staffTokens[i], y - rowY)),
	};
};


const isStaffToken = token => token.is("STAFF_LINE") || token.is("MEASURE_SEPARATOR");


const parseTokenStaff = (tokens, y) => {
	const localTokens = tokens.map(token => token.translate({y}));
	const notes = localTokens.filter(token => token.is("NOTE"));

	const separatorXsRaw = localTokens
		.filter(token => token.is("MEASURE_SEPARATOR"))
		.map(token => token.x);

	const separatorXs = separatorXsRaw.filter((x, i) => {
		const left = i > 0 ? separatorXsRaw[i - 1] : -Infinity;

		return notes.filter(note => note.x > left && note.x < x).length > 0;
	});
	//console.log("separatorXs:", separatorXs, separatorXsRaw);

	const measures = separatorXs.map((x, i) => {
		const left = i > 0 ? separatorXs[i - 1] : -Infinity;

		return localTokens.filter(token => !isStaffToken(token) && token.x > left && token.x < x);
	}).map((tokens, i) => parseTokenMeasure(tokens, separatorXs[i]));

	return {
		x: 0, y,
		tokens: localTokens.filter(isStaffToken),
		measures,
	};
};


const parseTokenMeasure = (tokens, endX) => {
	const notes = tokens.filter(token => token.is("NOTE"));

	//const head = tokens.filter(token => token.x < notes[0].x - 3);
	const noteRange = {begin: notes[0].x, end: endX};
	const headX = notes[0].x - 3;

	return {
		tokens,
		noteRange,
		headX,
	};
};


const organizeTokens = (tokens, {viewBox, width, height}: any = {}) => {
	const meaningfulTokens = tokens.filter(token => !token.is("NULL"));
	const rowTokens = tokensRowsSplit(meaningfulTokens);

	const rows = rowTokens.map(parseTokenRow);

	return {
		rows,

		viewBox,
		width,
		height,
	};
};



export default organizeTokens;