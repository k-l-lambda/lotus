
import {POS_PRECISION, constants} from "./utils";

// eslint-disable-next-line
import StaffToken from "./staffToken";



interface Rect {
	left: number;
	right: number;
	top: number;
	bottom: number;
};


class LineStack {
	lines: StaffToken[];
	translation = {x: 0, y: 0};

	systemIndex?: number;
	staffIndex?: number;

	_rect?: Rect;


	constructor (root) {
		this.lines = [root];
	}


	// the bottom line
	get tip (): StaffToken {
		return this.lines[this.lines.length - 1];
	}


	get rect (): {left: number, right: number, top: number, bottom: number} {
		if (!this._rect) {
			const ys = this.lines.map(token => token.y + token.height / 2);

			this._rect = {
				left: Math.min(...this.lines.map(token => token.x)),
				right: Math.max(...this.lines.map(token => token.x + token.width)),
				top: ys[0],
				bottom: ys[ys.length - 1],
			};
		}

		return this._rect;
	}


	tryAppend (line: StaffToken): boolean {
		if (line.ry - this.tip.ry === 1 && Math.abs(line.x - this.tip.x) < 2) {
			this.lines.push(line);

			this._rect = null;

			return true;
		}

		return false;
	}


	tryAttachConnection (connection: {y: number, height: number}, index: number): boolean {
		const {top, bottom} = this.rect;

		//console.log("connection:", connection.y + connection.height, top - 1.2);

		const y = connection.y + this.translation.y;

		if (bottom + 1.6 > y && top - 1.6 < y + connection.height) {
			this.systemIndex = index;
			return true;
		}

		return false;
	}


	tryAttachStaff (y: number, index: number): boolean {
		const {top, bottom} = this.rect;

		y += this.translation.y;

		if (bottom + 3.2 > y && top - 3.2 < y) {
			this.staffIndex = index;
			return true;
		}

		return false;
	}


	contains (token: StaffToken) {
		const {left, right, top, bottom} = this.rect;

		const x = token.x + this.translation.x;
		const y = token.y + this.translation.y;

		return x > left - 1.2 && x < right - 1 && y > top - 0.6 && y < bottom + 0.6;
	}


	translate ({x = 0, y = 0} = {}) {
		this.translation.x += x;
		this.translation.y += y;
	}
};


const parseAdditionalLineStacks = (tokens: StaffToken[]): LineStack[] => {
	const lines = tokens.filter(token => token.is("ADDITIONAL_LINE")).sort((t1, t2) => t1.y - t2.y);

	const stacks: LineStack[] = [];

	lines.forEach(line => {
		for (const stack of stacks) {
			if (stack.tryAppend(line))
				return;
		}

		stacks.push(new LineStack(line));
	});

	return stacks;
};


const tokensRowsSplit = (tokens, logger) => {
	if (!tokens.length) {
		logger.append("tokensRowsSplit.emptyTokens");
		return [];
	}

	const pageHeight = Math.max(...tokens.map(token => token.y));
	const pageTile = Array(Math.round(pageHeight)).fill(-1);

	let crossedCount = 0;

	const connections = tokens.filter(token => token.is("STAVES_CONNECTION"));
	if (!connections.length) {
		// single line row, split by staff lines
		const lines = tokens.filter(token => token.is("STAFF_LINE"));
		lines.forEach(line => pageTile[Math.round(line.y)] = 0);

		// non-staff page
		if (!lines.length)
			return [];

		let index = -1;
		let outStaff = true;
		for (let y = 0; y < pageTile.length; ++y) {
			const out = pageTile[y] < 0;
			if (outStaff && !out) {
				++index;

				// append connection placeholder
				connections.push({y, height: 4});
			}

			if (!out)
				pageTile[y] = index;

			outStaff = out;
		}
	}
	else {
		connections.forEach((connection, i) => {
			const start = Math.round(connection.y) - 2;
			const end = Math.round(connection.y + connection.height) + 1;

			let index = i - crossedCount;

			for (let y = start; y <= end; ++y) {
				if (pageTile[y] >= 0) {
					index = pageTile[y];
					++crossedCount;
					break;
				}
			}

			for (let y = start; y <= end; ++y) 
				pageTile[y] = index;
		});
	}

	//logger.append("tokensRowsSplit.pageTile.0", [...pageTile]);
	//logger.append("tokensRowsSplit.connections", connections);

	const lineStacks = parseAdditionalLineStacks(tokens);
	lineStacks.forEach(stack => {
		for (let i = 0; i < connections.length; ++i) {
			if (stack.tryAttachConnection(connections[i], i))
				break;
		}
	});
	//logger.append("tokensRowsSplit.lineStacks", lineStacks);
	const validLineStacks = lineStacks.filter(stack => stack.systemIndex >= 0);
	if (validLineStacks.length < lineStacks.length)
		logger.append("tokensRowsSplit.invalidLineStacks", lineStacks.filter(stack => !(stack.systemIndex >= 0)));

	// fill interval between 8va and row top
	const octaveAs = tokens.filter(token => token.is("OCTAVE A"));
	octaveAs.forEach(token => {
		const nextIndex = pageTile.find((index, y) => y > token.y && index >= 0);
		for (let y = Math.floor(token.y) - 1; y < pageHeight; ++y) {
			if (pageTile[y] >= 0)
				break;

			pageTile[y] = nextIndex;
		}
	});
	//logger.append("tokensRowsSplit.octaveAs", octaveAs);

	//logger.append("tokensRowsSplit.pageTile.2", pageTile);

	const rowBoundaries = pageTile.reduce((boundaries, index, y) => {
		if (index >= boundaries.length)
			boundaries.push(y - 1);

		return boundaries;
	}, []);

	rowBoundaries[0] = -Infinity;
	//logger.append("tokensRowsSplit.rowBoundaries", rowBoundaries);

	const rows = Array(rowBoundaries.length).fill(null).map(() => ({tokens: [], stacks: []}));

	validLineStacks.forEach(stack => rows[stack.systemIndex].stacks.push(stack));

	tokens.forEach(token => {
		for (const stack of validLineStacks) {
			if (stack.contains(token)) {
				rows[stack.systemIndex].tokens.push(token);
				return;
			}
		}

		const y = Math.max(token.y, token.y + (token.height || 0));
		for (let i = 0; i < rowBoundaries.length; ++i) {
			if (y >= rowBoundaries[i] && (i >= rowBoundaries.length - 1 || y < rowBoundaries[i + 1])) {
				rows[i].tokens.push(token);
				return;
			}
		}
	});

	rows.forEach(row => row.tokens = row.tokens.sort((t1, t2) => t1.logicX - t2.logicX));

	return rows;
};


const parseChordsByStems = (tokens, logger) => {
	const stems = tokens.filter(token => token.is("NOTE_STEM"));
	const notes = tokens.filter(token => token.is("NOTEHEAD") || token.is("TEMPO_NOTEHEAD"));

	stems.forEach(stem => {
		const rightAttached = notes.filter(note => stem.stemAttached({
			x: note.x,
			y: note.y + constants.NOTE_TYPE_JOINT_Y[note.noteType] * note.scale,
			href: note.href,
		}));
		const leftAttached = notes.filter(note => stem.stemAttached({
			x: note.x + constants.NOTE_TYPE_WIDTHS[note.noteType] * note.scale,
			y: note.y - constants.NOTE_TYPE_JOINT_Y[note.noteType] * note.scale,
			href: note.href,
		}));

		if (rightAttached.length + leftAttached.length <= 0) {
			logger.append("parseChordsByStems.baldStem:", stem);
			//console.warn("bald stem:", stem);

			stem.addSymbol("BALD");

			return;
		}

		const ys = [...rightAttached.map(n => n.y), ...leftAttached.map(n => n.y)];
		const top = Math.abs(stem.y - Math.min(...ys));
		const bottom = Math.abs(stem.y + stem.height - Math.max(...ys));

		const up = top < bottom;
		console.assert(up || leftAttached.length, "unexpected stem, downwards but no left-attached notes.");
		console.assert(!up || rightAttached.length, "unexpected stem, upwards but no right-attached notes.");

		const anchorNote = up ? rightAttached[0] : leftAttached[0];
		const anchorToken = anchorNote || stem;

		const assign = note => {
			note.stemX = anchorToken.x;
			note.stemUp = up;
		};

		rightAttached.forEach(assign);
		leftAttached.forEach(assign);

		if (!anchorNote) {
			stem.addSymbol("NOTICE");
			logger.append("parseChordsByStems.unexpectedStem", {stem, ys, rightAttached, leftAttached});
		}
	});
};


const isRowToken = token => token.is("STAVES_CONNECTION") || token.is("BRACE") || token.is("VERTICAL_LINE");

//const roundJoin = (x, y) => `${Math.round(x)},${Math.round(y)}`;


const parseTokenRow = (tokens: StaffToken[], stacks: LineStack[], logger) => {
	const separatorYs : Set<number> = new Set();
	const meanSeparators = tokens.filter(token => token.is("MEASURE_SEPARATOR"));
	meanSeparators.forEach(token => separatorYs.add(token.ry));
	//logger.append("parseTokenRow.meanSeparators", Array.from(meanSeparators));

	// remove separator Y from fake MEASURE_SEPARATOR
	for (const y of Array.from(separatorYs).sort()) {
		if (separatorYs.has(y - 4) && separatorYs.has(y + 4)) {
			separatorYs.delete(y);

			meanSeparators.filter(token => token.ry === y).forEach(token => {
				token.removeSymbol("MEASURE_SEPARATOR");
				token.addSymbol("VERTICAL_LINE");
			});
		}
	}

	//logger.append("parseTokenRow.separatorYs", Array.from(separatorYs));

	const staffLines = tokens.filter(token => token.is("STAFF_LINE")).reduce((lines, token) => {
		lines[token.ry] = token;
		return lines;
	}, {});
	//logger.append("parseTokenRow.staffLines", Object.keys(staffLines));

	// construct staff Y from staff lines when no separators
	if (!separatorYs.size) {
		const ys = Object.keys(staffLines).map(Number);
		const topLineYs = ys.filter(y => staffLines[y + 3] && staffLines[y + 4]);

		topLineYs.forEach(y => separatorYs.add(y));
	}

	const staffYs = Array.from(separatorYs)
		.filter(y => staffLines[y] || staffLines[y + POS_PRECISION])
		.map(y => staffLines[y] ? y : y + POS_PRECISION).map(y => y + 2)
		.sort((y1, y2) => y1 - y2);
	//logger.append("parseTokenRow.staffYs", staffYs);

	const additionalLines = tokens.filter(token => token.is("ADDITIONAL_LINE")).sort((l1, l2) => l1.y - l2.y);
	const additionalLinesYs = additionalLines.reduce((ys, token) => {
		ys.add(token.ry);
		return ys;
	}, new Set());
	//logger.append("parseTokenRow.additionalLinesYs", Array.from(additionalLinesYs));

	for (const y of staffYs) {
		console.assert(staffLines[y - 2] && staffLines[y] && staffLines[y + 2],
			"no corresponding staff lines for separator", y - 2, Object.keys(staffLines));
	}

	const rowY = staffYs[0] - 2;
	const rowX = staffLines[rowY] && staffLines[rowY].rx;

	const noteYs = tokens.filter(token => token.is("NOTE")).map(token => token.ry).concat(Object.keys(staffLines).map(Number));

	const top = Math.min(...noteYs) - rowY;
	const bottom = Math.max(...noteYs) - rowY;

	//console.log("additionalLinesYs:", additionalLinesYs);
	const splitters = [];
	for (let i = 0; i < staffYs.length - 1; ++i) {
		let up = staffYs[i] + 2;
		while (additionalLinesYs.has(up + 1))
			++up;

		let down = staffYs[i + 1] - 2;
		while (additionalLinesYs.has(down - 1))
			--down;

		//const splitter = Math.min(Math.max((staffYs[i] + staffYs[i + 1]) / 2, up + 1), down - 1) - rowY;
		const splitter = (up + down) / 2 - rowY;
		splitters.push(splitter);

		//logger.append("parseTokenRow.splitter", {splitter, up, down, rowY});
	}
	splitters.push(Infinity);


	/*// generate 2D staves index map
	const indicesMap = {};
	const markLineIndex = (line, index) => {
		for (let x = Math.round(line.x); x < Math.round(line.x + line.width); ++x) {
			indicesMap[roundJoin(x, line.y)] = index;
			indicesMap[roundJoin(x, line.y + 1)] = index;
			indicesMap[roundJoin(x, line.y - 1)] = index;
		}
	};
	staffYs.forEach((sy, index) => additionalLines.filter(line => Math.abs(line.ry - sy) <= 3)
		.forEach((line: any) => (markLineIndex(line, index), line.resolved = true)));

	const pendingLines = additionalLines.filter((line: any) => !line.resolved);

	// down pass
	pendingLines.forEach(line => {
		const base = indicesMap[roundJoin(line.x, line.y - 1)];
		if (Number.isInteger(base))
			markLineIndex(line, base);
	});

	// up pass
	pendingLines.reverse().forEach(line => {
		const base = indicesMap[roundJoin(line.x, line.y + 1)];
		if (Number.isInteger(base))
			markLineIndex(line, base);
	});

	//logger.append("parseTokenRow.indicesMap", indicesMap);*/

	stacks.forEach(stack => {
		for (let i = 0; i < staffYs.length; ++i) {
			if (stack.tryAttachStaff(staffYs[i], i))
				return;
		}
	});

	const findStaffByStacks = token => {
		for (const stack of stacks) {
			if (stack.contains(token))
				return stack.staffIndex;
		}
	};

	const staffTokens = [];
	//console.log("splitters:", splitters);
	const appendToken = token => {
		let index = 0;
		const y = token.logicY;
		//const indexInMap = indicesMap[roundJoin(token.x + rowX, y + rowY)];
		const indexByStacks = findStaffByStacks(token);
		if (Number.isInteger(indexByStacks))
			index = indexByStacks;
		else {
			//if (token.is("NOTEHEAD"))
			//	console.log("omit note:", token.href, roundJoin(token.x + rowX, y + rowY));
			while (y > splitters[index])
				++index;
		}

		staffTokens[index] = staffTokens[index] || [];
		staffTokens[index].push(token);
	};

	const localTokens = tokens.map(token => token.translate({x: rowX, y: rowY}));
	stacks.forEach(stack => stack.translate({x: rowX, y: rowY}));
	//logger.append("parseTokenRow.stacks", stacks);

	parseChordsByStems(localTokens, logger);

	localTokens
		.filter(token => !isRowToken(token))
		.forEach(appendToken);

	// measure ranges
	const notes = localTokens.filter(token => token.is("NOTE"));
	const separatorXsRaw = Array.from(new Set(localTokens
		.filter(token => token.is("MEASURE_SEPARATOR"))
		.map(token => token.logicX))).sort((x1: number, x2: number) => x1 - x2);

	// supplement for empty measure separator staff, maybe some lilypond bug if not at end.
	if (!separatorXsRaw.length)
		separatorXsRaw.push(localTokens[localTokens.length - 1].x + 1);

	const measureRanges = separatorXsRaw.map((x, i) => {
		const left = i > 0 ? separatorXsRaw[i - 1] : -Infinity;

		return {
			x,
			notes: notes.filter(note => note.x > left && note.x < x),
		};
	}).filter(({notes}) => notes.length).map(({x, notes}) => ({
		headX: notes[0].x - 1.5,
		noteRange: {begin: notes[0].x, end: x},
	}));
	//logger.append("parseTokenRow.measureRanges", measureRanges);

	return {
		x: rowX,
		y: rowY,
		top,
		bottom,
		tokens: localTokens.filter(isRowToken),
		staves: staffYs.map((y, i) => staffTokens[i] && parseTokenStaff({
			tokens: staffTokens[i],
			y: y - rowY,
			top: splitters[i] - (y - rowY),
			measureRanges,
			logger,
		})),
	};
};


const isStaffToken = token => token.is("STAFF_LINE") || token.is("MEASURE_SEPARATOR");


const parseTokenStaff = ({tokens, y, top, measureRanges, logger}) => {
	const localTokens = tokens.map(token => token.translate({y}));
	const notes = localTokens.filter(token => token.is("NOTE"));
	//logger.append("parseTokenStaff.localTokens", localTokens);

	// mark tied notes
	const ties = localTokens.filter(token => token.is("SLUR") && token.source && (token.source[0] === "~" || token.source[1] === "~"));
	//logger.append("parseTokenStaff.ties", ties);

	ties.forEach(tie => {
		let offsetY = 0;
		if (tie.is("UP"))
			offsetY = 0.3;
		if (tie.is("DOWN"))
			offsetY = -0.3;

		const position = {
			x: tie.x + tie.target.x - 0.3,
			y: tie.y + tie.target.y + offsetY,
		};

		const nearest = notes.reduce((best, note) => {
			if (!note.tied) {
				//const distance = note.sourceProgress - tie.sourceProgress;
				if (note.sourceProgress > tie.sourceProgress) {
					const dx = note.x + constants.NOTE_TYPE_WIDTHS[note.noteType] * 0.5 - position.x;
					if (dx > -1) {
						const dy = (note.y - position.y) * 2;
						const distance = Math.sqrt(dx * dx + dy * dy) + (note.sourcePosition.line - tie.sourcePosition.line) * 0.2;
						if (dy < 4 && distance < best.distance) {
							//logger.append("nearNote", {tipDistance, tie: tie.sourceProgress, note: note.sourceProgress});
							return {distance, note};
						}
					}
				}
			}

			return best;
		}, {distance: Infinity});
		if (nearest.note)
			nearest.note.tied = true;
			//logger.append("parseTokenStaff.tiedNote", {nearest, tie});
		else
			logger.append("parseTokenStaff.omitTie", {tie});
	});

	const measures = measureRanges.map((range, i) => {
		const left = i > 0 ? measureRanges[i - 1].noteRange.end : -Infinity;

		const tokens = localTokens.filter(token => !isStaffToken(token) && token.x > left
			&& (token.x < range.noteRange.end || i === measureRanges.length - 1));

		// shift fore headX by alters
		const alters = tokens.filter(token => token.is("ALTER")).sort((a1, a2) => a2.x - a1.x);
		//logger.append("measure.alters", {alters, range});

		let xbegin = range.noteRange.begin;
		for (const alter of alters) {
			if (alter.x + constants.ALTER_WIDTHS[alter.alterValue] >= xbegin) {
				range.headX = Math.min(range.headX, alter.x);
				xbegin = Math.min(range.noteRange.begin, alter.x);
			}
			else
				break;
		}
		//logger.append("measure.xbegin", {xbegin, headX: range.headX});

		return {
			tokens,
			noteRange: range.noteRange,
			headX: range.headX,
		};
	});

	const headWidth = measures[0] ? measures[0].headX : 0;

	return {
		x: 0, y,
		headWidth,
		top,
		tokens: localTokens.filter(isStaffToken),
		measures,
	};
};


const isPageToken = token => token.is("TEXT") && !token.source;


const organizeTokens = (tokens, ly: string, {logger, viewBox, width, height}: any = {}) => {
	//logger.append("organizeTokens", tokens);

	// added source on tokens
	const lyLines = ly.split("\n");
	tokens.forEach(token => {
		const pos = token.sourcePosition;
		if (pos)
			token.source = lyLines[pos.line - 1].substr(pos.start, Math.max(pos.end - pos.start, 8));
	});

	const meaningfulTokens = tokens.filter(token => !token.is("NULL"));
	//logger.append("organizeTokens.meaningfulTokens", meaningfulTokens);

	const pageTokens = meaningfulTokens.filter(isPageToken);

	// process tempo noteheads
	const tempoNotes = meaningfulTokens.filter(token => token.source && token.source.substr(0, 6) === "\\tempo" && token.is("NOTEHEAD"));
	tempoNotes.forEach(note => {
		note.removeSymbol("NOTEHEAD");
		note.addSymbol("TEMPO_NOTEHEAD");
	});

	const rowDatas = tokensRowsSplit(meaningfulTokens.filter(token => !isPageToken(token)), logger);
	//logger.append("organizeTokens.rowDatas", rowDatas);

	const rows = rowDatas.map(({tokens, stacks}) => parseTokenRow(tokens, stacks, logger));

	return {
		tokens: pageTokens,
		rows,

		viewBox,
		width,
		height,
	};
};



export default organizeTokens;
