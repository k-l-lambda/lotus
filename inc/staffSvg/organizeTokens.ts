
import {POS_PRECISION, constants} from "./utils";

// eslint-disable-next-line
import StaffToken from "./staffToken";
// eslint-disable-next-line
import TextSource from "../textSource";



interface Rect {
	left: number;
	right: number;
	top: number;
	bottom: number;
};


type IConnection = {y: number, height: number};


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


	tryAttachConnection (connection: IConnection, index: number): boolean {
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

		return x > left - 1.6 && x < right - 1 && y > top - 0.6 && y < bottom + 0.6;
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


const tokensSystemsSplit = (tokens: StaffToken[], logger) => {
	if (!tokens.length) {
		logger.append("tokensSystemsSplit.emptyTokens");
		return [];
	}

	const pageHeight = Math.max(...tokens.map(token => token.y));
	const pageTile = Array(Math.round(pageHeight)).fill(-1);

	let crossedCount = 0;

	const connections: IConnection[] = tokens.filter(token => token.is("STAVES_CONNECTION")) as IConnection[];
	if (!connections.length) {
		// single line system, split by staff lines
		const lines = tokens.filter(token => token.is("STAFF_LINE"));
		lines.forEach(line => pageTile[Math.round(line.y)] = 0);

		// non-staff page
		if (!lines.length) {
			logger.append("tokensSystemsSplit.noConnetionsOrLines", {tokens});
			return [];
		}

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
			const start = Math.round(connection.y) - 1;
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

	//logger.append("tokensSystemsSplit.pageTile.0", [...pageTile]);
	//logger.append("tokensSystemsSplit.connections", connections);

	const lineStacks = parseAdditionalLineStacks(tokens);
	lineStacks.forEach(stack => {
		for (let i = 0; i < connections.length; ++i) {
			if (stack.tryAttachConnection(connections[i], i))
				break;
		}
	});
	//logger.append("tokensSystemsSplit.lineStacks", lineStacks);
	const validLineStacks = lineStacks.filter(stack => stack.systemIndex >= 0);
	if (validLineStacks.length < lineStacks.length)
		logger.append("tokensSystemsSplit.invalidLineStacks", lineStacks.filter(stack => !(stack.systemIndex >= 0)));

	// fill page tile by line stacks
	validLineStacks.forEach(stack => {
		const {top, bottom} = stack.rect;
		for (let y = Math.floor(top) - 1; y < Math.ceil(bottom); ++y) {
			if (pageTile[y] < 0)
				pageTile[y] = stack.systemIndex;
		}
	});

	// fill interval between top tokens and system top
	const topTokens = tokens.filter(token => token.topAtSystem);
	topTokens.forEach(token => {
		const nextIndex = pageTile.find((index, y) => y > token.y && index >= 0);
		for (let y = Math.floor(token.y) - 1; y < pageHeight; ++y) {
			if (pageTile[y] >= 0)
				break;

			pageTile[y] = nextIndex;
		}
	});

	//logger.append("tokensSystemsSplit.octaveAs", octaveAs);

	// enlarge page tile by intersection stems
	const interStems = tokens.filter(token => token.is("NOTE_STEM")
		&& pageTile[Math.round(token.y)] === -1
		&& pageTile[Math.round(token.y)] !== pageTile[Math.round(token.y + token.height)]);
	interStems.forEach(stem => {
		const bottomIndex = pageTile[Math.round(stem.y + stem.height)];
		if (bottomIndex > 0) {
			for (let y = Math.round(stem.y + stem.height) - 1; y >= Math.round(stem.y); --y)
				pageTile[y] = bottomIndex;
		}
	});

	//logger.append("tokensSystemsSplit.pageTile.2", pageTile);

	const systemBoundaries = pageTile.reduce((boundaries, index, y) => {
		if (index >= boundaries.length)
			boundaries.push(y - 1);

		return boundaries;
	}, []);

	systemBoundaries[0] = -Infinity;
	//logger.append("tokensSystemsSplit.systemBoundaries", systemBoundaries);

	const systems = Array(systemBoundaries.length).fill(null).map(() => ({tokens: [], stacks: []}));

	validLineStacks.forEach(stack => systems[stack.systemIndex] && systems[stack.systemIndex].stacks.push(stack));
	//logger.append("tokensSystemsSplit.validLineStacks", {systems, validLineStacks});

	tokens.forEach(token => {
		for (const stack of validLineStacks) {
			if (stack.contains(token)) {
				if (systems[stack.systemIndex]) {
					systems[stack.systemIndex].tokens.push(token);
					return;
				}
				else
					logger.append("tokensSystemsSplit.invalidStackSystemIndex", {stack, systems});
			}
		}

		if (token.withUp || token.withDown) {
			let index = 0;
			if (token.withUp)
				index = connections.filter(c => c.y + c.height < token.y).length;
			else
				index = Math.max(connections.filter(c => c.y < token.y).length - 1, 0);

			if (systems[index])
				systems[index].tokens.push(token);
			else
				console.warn("tokensSystemsSplit: invalid system index:", index, systems.length, token.source);

			return;
		}

		const y = token.logicY;
		for (let i = 0; i < systemBoundaries.length; ++i) {
			if (y >= systemBoundaries[i] && (i >= systemBoundaries.length - 1 || y < systemBoundaries[i + 1])) {
				systems[i].tokens.push(token);
				return;
			}
		}
	});

	systems.forEach(system => system.tokens = system.tokens.sort((t1, t2) => t1.logicX - t2.logicX));

	return systems;
};


const parseChordsByStems = (tokens: StaffToken[], logger) => {
	const stems = tokens.filter(token => token.is("NOTE_STEM"));
	const notes = tokens.filter(token => token.is("NOTEHEAD") || token.is("TEMPO_NOTEHEAD"));

	stems.forEach(stem => {
		const rightAttached = notes.filter(note => stem.stemAttached({
			x: note.x,
			y: note.y + constants.NOTE_TYPE_JOINT_Y[note.noteType] * (note.scale || 1),
			href: note.href,
		}));
		const leftAttached = notes.filter(note => stem.stemAttached({
			x: note.x + constants.NOTE_TYPE_WIDTHS[note.noteType] * (note.scale || 1),
			y: note.y - constants.NOTE_TYPE_JOINT_Y[note.noteType] * (note.scale || 1),
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
		//console.assert(up || leftAttached.length, "unexpected stem, downwards but no left-attached notes.");
		//console.assert(!up || rightAttached.length, "unexpected stem, upwards but no right-attached notes.");

		stem.stemUp = !up;

		const anchorNote = up ? rightAttached[0] : leftAttached[0];
		const anchorToken = anchorNote || stem;

		const assign = note => {
			note.stemX = anchorToken.x;
			note.stemUp = !up;

			note.stems = note.stems || [];
			note.stems.push(stem.index);
		};

		rightAttached.forEach(assign);
		leftAttached.forEach(assign);

		if (!anchorNote) {
			stem.addSymbol("NOTICE");
			logger.append("parseChordsByStems.unexpectedStem", {stem, ys, rightAttached, leftAttached});
		}
		else if (anchorNote.is("HALF"))
			stem.division = 1;
	});
};


const isSystemToken = token => token.is("STAVES_CONNECTION") || token.is("BRACE") || token.is("VERTICAL_LINE");

//const roundJoin = (x, y) => `${Math.round(x)},${Math.round(y)}`;


const parseTokenSystem = (tokens: StaffToken[], stacks: LineStack[], logger) => {
	const separatorYs : Set<number> = new Set();
	const meanSeparators = tokens.filter(token => token.is("MEASURE_SEPARATOR"));
	meanSeparators.forEach(token => separatorYs.add(token.ry));
	//logger.append("parseTokenSystem.meanSeparators", Array.from(meanSeparators));

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

	//logger.append("parseTokenSystem.separatorYs", Array.from(separatorYs));

	const staffLines = tokens.filter(token => token.is("STAFF_LINE")).reduce((lines, token) => {
		lines[token.ry] = token;
		return lines;
	}, {});
	//logger.append("parseTokenSystem.staffLines", Object.keys(staffLines));

	// construct staff Y from staff lines when no separators
	if (!separatorYs.size) {
		const ys = Object.keys(staffLines).map(Number);
		const topLineYs = ys.filter(y => staffLines[y + 3] && staffLines[y + 4]);

		topLineYs.forEach(y => separatorYs.add(y));
	}

	const staffYs = Array.from(separatorYs)
		.filter(y => staffLines[y] || staffLines[y + POS_PRECISION])
		.map(y => staffLines[y] ? y : y + POS_PRECISION).map(y => y + 2)
		.sort((y1, y2) => y1 - y2)
		.filter(y => staffLines[y - 2] && staffLines[y] && staffLines[y + 2]);
	//logger.append("parseTokenSystem.staffYs", staffYs);

	const additionalLines = tokens.filter(token => token.is("ADDITIONAL_LINE")).sort((l1, l2) => l1.y - l2.y);
	const additionalLinesYs = additionalLines.reduce((ys, token) => {
		ys.add(token.ry);
		return ys;
	}, new Set());
	//logger.append("parseTokenSystem.additionalLinesYs", Array.from(additionalLinesYs));

	/*for (const y of staffYs) {
		console.assert(staffLines[y - 2] && staffLines[y] && staffLines[y + 2],
			"no corresponding staff lines for separator", y - 2, Object.keys(staffLines));
	}*/

	const systemY = staffYs[0] - 2;
	const systemX = staffLines[systemY] && staffLines[systemY].rx;

	const noteYs = tokens
		.filter(token => token.is("NOTE") && !token.is("TEMPO_NOTEHEAD"))
		.map(token => token.ry)
		.concat(Object.keys(staffLines).map(Number));

	const top = Math.min(...noteYs) - systemY;
	const bottom = Math.max(...noteYs) - systemY;

	//console.log("additionalLinesYs:", additionalLinesYs);
	const splitters = [];
	for (let i = 0; i < staffYs.length - 1; ++i) {
		let up = staffYs[i] + 2;
		while (additionalLinesYs.has(up + 1))
			++up;

		let down = staffYs[i + 1] - 2;
		while (additionalLinesYs.has(down - 1))
			--down;

		//const splitter = Math.min(Math.max((staffYs[i] + staffYs[i + 1]) / 2, up + 1), down - 1) - systemY;
		const splitter = (up + down) / 2 - systemY;
		splitters.push(splitter);

		//logger.append("parseTokenSystem.splitter", {splitter, up, down, systemY});
	}
	splitters.push(Infinity);


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

	const localTokens = tokens.map(token => token.translate({x: -systemX, y: -systemY}));
	const stems = localTokens.filter(token => token.is("NOTE_STEM"));
	stems.forEach(stem => stem.division = 2);

	const slashes = localTokens.filter(token => token.is("LINE") && token.target && token.target.x > 0 && token.target.y < 0);
	const backSlashes = localTokens.filter(token => token.is("LINE") && token.target && token.target.x > 0 && token.target.y > 0);

	const staffTokens = [];
	//console.log("splitters:", splitters);
	const appendToken = (token: StaffToken) => {
		if (token.is("BEAM")) {
			const jointStems = stems.filter(stem => Math.abs(stem.centerX - token.x) < 0.1
				&& (Math.abs(token.y - stem.y) < 0.2 || Math.abs(token.y - (stem.y + stem.height)) < 0.2));
			if (jointStems.length)
				token.addSymbol("CAPITAL_BEAM");

			const k = (token.target.y - token.start.y) / (token.target.x - token.start.x);

			// append stem division
			const crossedStems = stems.filter(stem =>
				stem.centerX > token.x - 0.1 && stem.centerX < token.x + token.target.x + 0.1
				&& stem.y < Math.max(token.y, token.y + token.target.y) + 0.2
				&& stem.y + stem.height > Math.min(token.y, token.y + token.target.y) - 0.2);
			crossedStems.forEach(stem => {
				const beamY = (stem.centerX - token.x + token.start.x) * k + token.y + token.start.y;
				if (beamY > stem.y - 0.2 && beamY < stem.y + stem.height + 0.2) {
					const atTip = stem.stemUp ? beamY < stem.y + 3.2 : beamY > stem.y + stem.height - 3.2;
					if (atTip) {
						++stem.division;

						if (token.is("CAPITAL_BEAM"))
							stem.beam = token.index;
					}
				}
			});
		}

		if (token.is("FLAG UP")) {
			const stem = stems.find(stem => Math.abs(stem.x + stem.width - token.x) < 0.04 && Math.abs(stem.y - token.y) < 0.1);
			if (stem) {
				token.stem = stem.index;
				stem.division = token.flagNumber;
			}
			else
				token.addSymbol("SUSPENDED");
		}

		if (token.is("FLAG DOWN")) {
			const stem = stems.find(stem => Math.abs(stem.x + stem.width - token.x) < 0.04 && Math.abs(stem.y + stem.height - token.y) < 0.1);
			if (stem) {
				token.stem = stem.index;
				stem.division = token.flagNumber;
			}
			else
				token.addSymbol("SUSPENDED");
		}

		if (slashes.includes(token)) {
			const partner = backSlashes.find(t => t.x === token.x && t.target.y === - token.target.y);
			if (partner) {
				if (token.y <= partner.y) {
					token.addSymbol("WEDGE CRESCENDO TOP");
					partner.addSymbol("WEDGE CRESCENDO BOTTOM");
				}
				else if (token.y > partner.y) {
					token.addSymbol("WEDGE DECRESCENDO BOTTOM");
					partner.addSymbol("WEDGE DECRESCENDO TOP");
				}
			}
		}

		let index = 0;

		if (token.withUp || token.withDown) {
			if (token.withUp)
				index = staffYs.filter(sy => sy + 2 < token.y + systemY).length;
			else if (token.withDown)
				index = Math.max(staffYs.filter(sy => sy - 2 < token.y + systemY).length - 1, 0);
		}
		else {
			let y = token.logicY;
			//const indexInMap = indicesMap[roundJoin(token.x + systemX, y + systemY)];
			const indexByStacks = findStaffByStacks(token);
			if (Number.isInteger(indexByStacks))
				index = indexByStacks;
			else {
				// affiliate beam to a stem
				if (token.is("NOTETAIL") && token.is("JOINT")) {
					const stem = stems.find(stem => Math.abs(stem.centerX - token.x) < 0.1
						&& token.y > stem.y - 0.2 && token.y < stem.y + stem.height + 0.2);
	
					if (stem)
						y = stem.logicY;
					//else
					//	console.debug("isolated beam:", token);
				}

				//if (token.is("NOTEHEAD"))
				//	console.log("omit note:", token.href, roundJoin(token.x + systemX, y + systemY));
				while (y > splitters[index])
					++index;
			}
		}

		staffTokens[index] = staffTokens[index] || [];
		staffTokens[index].push(token);
	};

	stacks.forEach(stack => stack.translate({x: systemX, y: systemY}));
	//logger.append("parseTokenSystem.stacks", stacks);

	parseChordsByStems(localTokens, logger);

	localTokens
		.filter(token => !isSystemToken(token))
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
	//logger.append("parseTokenSystem.measureRanges", measureRanges);

	return {
		x: systemX,
		y: systemY,
		top,
		bottom,
		tokens: localTokens.filter(isSystemToken),
		staves: staffYs.map((y, i) => staffTokens[i] && parseTokenStaff({
			tokens: staffTokens[i],
			y: y - systemY,
			top: splitters[i] - (y - systemY),
			measureRanges,
			logger,
		})),
	};
};


const isStaffToken = token => token.is("STAFF_LINE") || token.is("MEASURE_SEPARATOR");


const parseTokenStaff = ({tokens, y, top, measureRanges, logger}) => {
	const localTokens = tokens.map(token => token.translate({y: -y}));
	const notes = localTokens.filter(token => token.is("NOTE"));
	//logger.append("parseTokenStaff.localTokens", localTokens);

	const headX = measureRanges[0] ? measureRanges[0].headX : 0;

	const alters = localTokens.filter(token => token.is("ALTER"));
	let lastAlter = null;

	// mark key alters
	for (const alter of alters) {
		// far distance alter may be chordmode element
		if (alter.y > 3 || alter.y < -3)
			continue;

		if ((alter.source && alter.source.substr(0, 4) === "\\key"))
			lastAlter = alter;
		// break key chain at large gap
		else if (lastAlter && alter.x - lastAlter.x > 2)
			break;
		else if (alter.x < headX)
			lastAlter = alter;
		// continue key chain
		else if (lastAlter && alter.x - lastAlter.x < 1.2)
			lastAlter = alter;
		else
			break;

		alter.addSymbol("KEY");
	}

	// affiliate accidental alters to notes
	const accs = alters.filter(alter => !alter.is("KEY") && !alter.href);
	accs.forEach(alter => {
		const notehead = notes.find(note => note.ry === alter.ry && note.x > alter.x && note.x - alter.x < 5);
		if (notehead)
			alter.stemX = notehead.logicX - constants.EPSILON;
		else {
			alter.addSymbol("NOTICE");
			logger.append("orphanAlter", alter);
		}
	});
	//logger.append("measureRanges:", {measureRanges, accs});

	const measures = measureRanges.map((range, i) => {
		const left = i > 0 ? measureRanges[i - 1].noteRange.end : -Infinity;

		const tokens = localTokens.filter(token => !isStaffToken(token) && token.logicX > left
			&& (token.logicX < range.noteRange.end || i === measureRanges.length - 1))
			.sort((t1, t2) => t1.logicX - t2.logicX);

		// mark volta repeat dots
		const dots = tokens.filter(token => token.is("DOT"));
		dots.forEach(dot  => {
			if (Math.abs(dot.ry) === 0.5) {
				if (dot.x - left < 2.9) {	// double lines will enlarge left line interval
					dot.addSymbol("LEFT");
					dot.addSymbol("VOLTA");
				}

				if (dot.x - range.noteRange.end > -1.0) {
					dot.addSymbol("RIGHT");
					dot.addSymbol("VOLTA");
				}
			}
		});

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


const organizeTokens = (tokens: StaffToken[], source: TextSource, {logger, viewBox, width, height}: any = {}) => {
	//logger.append("organizeTokens", tokens);

	// added source on tokens
	tokens.forEach(token => {
		const pos = token.sourcePosition;
		if (pos)
			//token.source = lyLines[pos.line - 1].substr(pos.start, Math.max(pos.end - pos.start, 8));
			token.source = source.slice(pos.line, [pos.start, Math.max(pos.end, pos.start + 8)]);
	});

	const meaningfulTokens = tokens.filter(token => !token.is("NULL"));
	//logger.append("organizeTokens.meaningfulTokens", meaningfulTokens);

	const pageTokens = meaningfulTokens.filter(isPageToken);

	meaningfulTokens.forEach(token => {
		if (token.source) {
			// process tempo noteheads
			if (token.source.substr(0, 6) === "\\tempo" && token.is("NOTEHEAD")) {
				token.removeSymbol("NOTEHEAD");
				token.addSymbol("TEMPO_NOTEHEAD");
			}

			// process ped dot
			if (token.is("DOT") && /\\sustain/.test(token.source)) {
				token.removeSymbol("DOT");
				token.addSymbol("SUSTAIN", "PED_DOT");
			}
		}
	});

	const systemDatas = tokensSystemsSplit(meaningfulTokens.filter(token => !isPageToken(token)), logger);
	//logger.append("organizeTokens.systemDatas", systemDatas);

	const systems = systemDatas.map(({tokens, stacks}) => parseTokenSystem(tokens, stacks, logger));

	return {
		tokens: pageTokens,
		systems,

		viewBox,
		width,
		height,
	};
};



export default organizeTokens;
