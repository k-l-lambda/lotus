
import {CM_TO_PX} from "../constants";
import {roundNumber} from "./utils";

// eslint-disable-next-line
import StaffToken from "./staffToken";
// eslint-disable-next-line
import * as LilyNotation from "../lilyNotation";
import pick from "../pick";



interface SheetMarkingData {
	id: string;
	text: string;
	x: number;
	y: number;
	cls: string;
}


export interface SheetMeasure {
	index: number;
	tokens: StaffToken[];
	headX: number;
	lineX?: number;
	matchedTokens?: StaffToken[];	// for baking mode
	noteRange: {
		begin: number,
		end: number,
	};

	class?: {[key: string]: boolean};
};


export interface SheetStaff {
	measures: SheetMeasure[];
	tokens: StaffToken[];

	markings?: Partial<SheetMarkingData>[];

	// the third staff line Y coordinate value
	//	The third staff line Y supposed to be zero, but regarding to the line stroke width,
	//	there is some error for original values in SVG document (which erased by coordinate rounding).
	yRoundOffset?: number; // 0.0657 for default

	x: number;
	y: number;
	top?: number;
	headWidth?: number;
};


export interface SheetSystem {
	index?: number;
	pageIndex?: number;
	measureIndices?: [number, number][];	// [end_x, index]
	staves: SheetStaff[];
	tokens: StaffToken[];

	x: number;
	y: number;
	width?: number;
	top: number;
	bottom: number;
};


export interface SheetPage {
	width: string;
	height: string;
	viewBox: {
		x: number,
		y: number,
		width: number,
		height: number,
	};

	systems: SheetSystem[];
	tokens: StaffToken[];

	hidden?: boolean;

	// DEPRECATED
	rows?: SheetSystem[];
};


/*const ALTER_PREFIXES = {
	[-2]: "\u266D\u266D",
	[-1]: "\u266D",
	[0]: "\u266E",
	[1]: "\u266F",
	[2]: "\uD834\uDD2A",
};*/

// char codes defined in music font
const ALTER_PREFIXES = {
	[-2]: "\ue02a",
	[-1]: "\ue021",
	[0]: "\ue01d",
	[1]: "\ue013",
	[2]: "\ue01c",
};


let sheetMarkingIndex = 0;


class SheetMarking {
	alter?: number;
	index: number;	// as v-for key

	id?: string;
	text?: string;
	x?: number;
	y?: number;
	cls?: string;


	constructor (fields: Partial<SheetMarkingData>) {
		this.index = sheetMarkingIndex++;
		Object.assign(this, fields);
	}


	get alterText (): string {
		return Number.isInteger(this.alter) ? ALTER_PREFIXES[this.alter] : null;
	}
};


const parseUnitExp = exp => {
	if (/[\d.]+mm/.test(exp)) {
		const [value] = exp.match(/[\d.]+/);
		return Number(value) * 0.1 * CM_TO_PX;
	}

	return Number(exp);
};


type MeasureLocationTable = {[key: number]: {[key: number]: number}};


const cc = <T>(arrays: T[][]): T[] => [].concat(...arrays);


class SheetDocument {
	pages: SheetPage[];


	constructor (fields: Partial<SheetDocument>, {initialize = true} = {}) {
		Object.assign(this, fields);

		if (initialize)
			this.updateTokenIndex();
	}


	get systems (): SheetSystem[] {
		return [].concat(...this.pages.map(page => page.systems));
	}


	// DEPRECATED
	get rows (): SheetSystem[] {
		return this.systems;
	}


	get trackCount (): number{
		return Math.max(...this.systems.map(system => system.staves.length), 0);
	}


	get pageSize (): {width: number, height: number} {
		const page = this.pages && this.pages[0];
		if (!page)
			return null;

		return {
			width: parseUnitExp(page.width),
			height: parseUnitExp(page.height),
		};
	}


	updateTokenIndex () {
		// remove null pages for broken document
		this.pages = this.pages.filter(page => page);

		this.pages.forEach((page, index) => page.systems.forEach(system => system.pageIndex = index));

		let rowMeasureIndex = 1;

		this.systems.forEach((system, index) => {
			system.index = index;
			system.width = system.tokens.concat(...system.staves.map(staff => staff.tokens))
				.reduce((max, token) => Math.max(max, token.x), 0);

			system.measureIndices = [];

			system.staves = system.staves.filter(s => s);
			system.staves.forEach((staff, t) => {
				staff.measures.forEach((measure, i) => {
					measure.index = rowMeasureIndex + i;
					measure.class = {};

					measure.tokens.forEach(token => {
						token.system = index;
						token.measure = measure.index;
						token.endX = measure.noteRange.end;
					});

					measure.lineX = measure.lineX || 0;
					if (i < staff.measures.length - 1)
						staff.measures[i + 1].lineX = measure.noteRange.end;

					if (t === 0)
						system.measureIndices.push([measure.noteRange.end, measure.index]);
				});

				staff.markings = [];
				staff.yRoundOffset = 0;

				const line = staff.tokens.find(token => token.is("STAFF_LINE"));
				if (line)
					staff.yRoundOffset = line.y - line.ry;
			});

			rowMeasureIndex += Math.max(...system.staves.map(staff => staff.measures.length));
		});
	}


	updateMatchedTokens (matchedIds: Set<string>) {
		this.systems.forEach(system => {
			system.staves.forEach(staff =>
				staff.measures.forEach(measure => {
					measure.matchedTokens = measure.tokens.filter(token => token.href && matchedIds.has(token.href));

					if (!staff.yRoundOffset) {
						const token = measure.matchedTokens[0];
						if (token)
							staff.yRoundOffset = token.y - token.ry;
					}
				}));
		});
	}


	addMarking (systemIndex: number, staffIndex: number, data: Partial<SheetMarkingData>): SheetMarking {
		const system = this.systems[systemIndex];
		if (!system) {
			console.warn("system index out of range:", systemIndex, this.systems.length);
			return;
		}

		const staff = system.staves[staffIndex];
		if (!staff) {
			console.warn("staff index out of range:", staffIndex, system.staves.length);
			return;
		}

		const marking = new SheetMarking(data);
		staff.markings.push(marking);

		return marking;
	}


	removeMarking (id: string) {
		this.systems.forEach(system => system.staves.forEach(staff =>
			staff.markings = staff.markings.filter(marking => marking.id !== id)));
	}


	clearMarkings () {
		this.systems.forEach(system => system.staves.forEach(staff => staff.markings = []));
	}


	toJSON (): object {
		return {
			__prototype: "SheetDocument",
			pages: this.pages,
		};
	}


	getLocationTable (): MeasureLocationTable {
		const table = {};

		this.systems.forEach(system => system.staves.forEach(staff => staff.measures.forEach(measure => {
			measure.tokens.forEach(token => {
				if (token.href) {
					const location = token.href.match(/\d+/g);
					if (location) {
						const [line, column] = location.map(Number);
						table[line] = table[line] || {};
						table[line][column] = Number.isFinite(table[line][column]) ? Math.min(table[line][column], measure.index) : measure.index;
					}
					else
						console.warn("invalid href:", token.href);
				}
			});
		})));

		return table;
	}


	lookupMeasureIndex (systemIndex: number, x: number): number {
		const system = this.systems[systemIndex];
		if (!system || !system.measureIndices)
			return null;

		const [_, index] = system.measureIndices.find(([end]) => x < end) || [null, null];

		return index;
	}


	tokensInSystem (systemIndex: number): StaffToken[] {
		const system = this.systems[systemIndex];
		if (!system)
			return null;

		return system.staves.reduce((tokens, staff) => {
			const translate = token => token.translate({x: staff.x, y: staff.y});

			tokens.push(...staff.tokens.map(translate));
			staff.measures.forEach(measure => tokens.push(...measure.tokens.map(translate)));

			return tokens;
		}, [...system.tokens]);
	}


	tokensInPage (pageIndex: number, {withPageTokens = false} = {}): StaffToken[] {
		const page = this.pages[pageIndex];
		if (!page)
			return null;

		return page.systems.reduce((tokens, system) => {
			tokens.push(...this.tokensInSystem(system.index).map(token => token.translate({x: system.x, y: system.y})));
			return tokens;
		}, withPageTokens ? [...page.tokens] : []);
	}


	fitPageViewbox ({margin = 5, verticalCropOnly = false, pageTokens = false} = {}) {
		if (!this.pages || !this.pages.length)
			return;

		const svgScale = this.pageSize.width / this.pages[0].viewBox.width;

		this.pages.forEach((page, i) => {
			const rects = page.systems.filter(system => Number.isFinite(system.x + system.width + system.y + system.top + system.bottom))
				.map(system => [system.x, system.x + system.width, system.y + system.top, system.y + system.bottom ]);

			const tokens = this.tokensInPage(i, {withPageTokens: pageTokens}) || [];
			const tokenXs = tokens.map(token => token.x).filter(Number.isFinite);
			const tokenYs = tokens.map(token => token.y).filter(Number.isFinite);
			//console.debug("tokens:", i, tokens, tokenXs, tokenYs);

			if (!rects.length)
				return;

			const left = Math.min(...rects.map(rect => rect[0]), ...tokenXs);
			const right = Math.max(...rects.map(rect => rect[1]), ...tokenXs);
			const top = Math.min(...rects.map(rect => rect[2]), ...tokenYs);
			const bottom = Math.max(...rects.map(rect => rect[3]), ...tokenYs);

			const x = verticalCropOnly ? page.viewBox.x : left - margin;
			const y = (verticalCropOnly && i === 0) ? page.viewBox.y : top - margin;
			const width = verticalCropOnly ? page.viewBox.width : right - left + margin * 2;
			const height = (verticalCropOnly && i === 0) ? bottom + margin - y : bottom - top + margin * 2;

			page.viewBox = {x, y, width, height};

			page.width = (page.viewBox.width * svgScale).toString();
			page.height = (page.viewBox.height * svgScale).toString();
		});
	}


	getTokensOf (symbol: string): StaffToken[] {
		return this.systems.reduce((tokens, system) => {
			system.staves.forEach(staff => staff.measures.forEach(measure =>
				tokens.push(...measure.tokens.filter(token => token.is(symbol)))));

			return tokens;
		}, []);
	}


	getNoteHeads (): StaffToken[] {
		return this.getTokensOf("NOTEHEAD");
	}


	getNotes (): StaffToken[] {
		return this.getTokensOf("NOTE");
	}


	getTokenMap (): Map<string, StaffToken> {
		return this.systems.reduce((tokenMap, system) => {
			system.staves.forEach(staff => staff.measures.forEach(measure => measure.tokens
				.filter(token => token.href)
				.forEach(token => tokenMap.set(token.href, token))));

			return tokenMap;
		}, new Map<string, StaffToken>());
	}


	findTokensAround (token: StaffToken, indices: number[]): StaffToken[] {
		const system = this.systems[token.system];
		if (system) {
			const tokens = [
				...system.tokens,
				...cc(system.staves.map(staff => [
					...staff.tokens,
					...cc(staff.measures.map(measure => measure.tokens)),
				])),
			];

			return tokens.filter(token => indices.includes(token.index));
		}

		return null;
	}


	findTokenAround (token: StaffToken, index: number): StaffToken {
		const results = this.findTokensAround(token, [index]);
		return results && results[0];
	}


	alignTokensWithNotation (notation: LilyNotation.Notation, {partial = false, assignFlags = false} = {}) {
		const shortId = (href: string): string => href.split(":").slice(0, 2).join(":");

		const noteTokens = this.getNotes();
		const tokenMap = noteTokens.reduce((map, token) => {
			const sid = token.href && shortId(token.href);
			const tokens = map.get(sid) || [];

			// shift column for command chord element
			if (/^\\/.test(token.source)) {
				const spaceCapture = token.source.match(/(?<=\s+)(\S|$)/);
				if (spaceCapture) {
					const [line, column] = token.href.match(/\d+/g).map(Number);
					map.set(`${line}:${column + spaceCapture.index}`, [token]);

					return map;
				}
				else
					console.warn("unresolved command chord element:", token.source, token);
			}

			tokens.push(token);
			token.href && map.set(sid, tokens);

			return map;
		}, new Map<string, StaffToken[]>());
		//console.assert(tokenMap.size === noteTokens.length, "tokens noteTokens count dismatch:", tokenMap.size, noteTokens.length);

		const tokenTickMap = new Map<StaffToken, {measureTick: number, tick: number}>();

		// assign tick & track
		notation.measures.forEach((measure, mi) => {
			const pendingStems = new Map<StaffToken, StaffToken>();	// stem -> beam

			measure.notes.forEach(note => {
				const tokens = tokenMap.get(shortId(note.id));
				if (tokens) {
					tokens.forEach(token => {
						token.href = note.id;
	
						if (!Number.isFinite(token.tick)) {
							tokenTickMap.set(token, {measureTick: measure.tick, tick: measure.tick + note.tick});
							token.pitch = note.pitch;
							token.track = note.track;

							if (token.stems) {
								const stems = this.findTokensAround(token, token.stems);
								if (stems) {
									const stem = stems.find(stem => stem.division === note.division && !Number.isFinite(stem.track));
									if (stem) {
										stem.track = note.track;

										if (stem.beam >= 0) {
											const beam = this.findTokenAround(stem, stem.beam);
											if (stems.length < 2 || stems[0].division !== stems[1].division)
												beam.track = stem.track;
										}
									}
									else if (!stems.find(stem => stem.division === note.division))
										console.warn("missed stem:", mi, token.href, note.division, token.stems, stems.map(stem => stem.division));

									stems.forEach(stem => {
										tokenTickMap.set(stem, {measureTick: measure.tick, tick: measure.tick + note.tick});
										if (stems.length > 1 && stem.beam >= 0) {
											const beam = this.findTokenAround(stem, stem.beam);
											if (beam)
												pendingStems.set(stem, beam);
										}
									});
								}
								else
									console.warn("stems token missing:", token.system, token.stems, mi, token.href);
							}
						}
					});
				}
				else if (!partial)
					note.overlapped = true;
			});

			//if (pendingStems.size)
			//	console.log("pendingStems:", mi, [...pendingStems].map(s => s.index));
			for (const [stem, beam] of pendingStems) {
				if (Number.isFinite(beam.track))
					stem.track = beam.track;
			}
		});

		const tokenTickMapKeys = Array.from(tokenTickMap.keys());
		this.systems.forEach(system => {
			system.staves.forEach(staff => staff.measures.forEach(measure => {
				const tokens = measure.tokens.filter(token => tokenTickMapKeys.includes(token));
				const meastureTick = tokens.reduce((tick, token) => Math.min(tokenTickMap.get(token).measureTick, tick), Infinity);
				tokens.forEach(token => token.tick = tokenTickMap.get(token).tick - meastureTick);
			}));
		});

		if (assignFlags)
			this.assignFlagsTrack();
	}


	assignFlagsTrack () {
		const flags = this.getTokensOf("FLAG");
		flags.forEach(flag => {
			if (Number.isFinite(flag.stem)) {
				const stem = this.findTokenAround(flag, flag.stem);
				if (stem && Number.isFinite(stem.track))
					flag.track = stem.track;
			}
		});
	}


	pruneForBakingMode () {
		const round = x => roundNumber(x, 1e-4);

		this.pages.forEach(page => {
			page.tokens = [];

			page.systems.forEach(system => {
				system.tokens = [];
				system.measureIndices = system.measureIndices && system.measureIndices.map(([x, i]) => [round(x), i]);

				system.staves.forEach(staff => {
					staff.tokens = [];
					staff.yRoundOffset = round(staff.yRoundOffset);
					delete staff.top;
					delete staff.headWidth;

					staff.measures.forEach(measure => {
						measure.headX = round(measure.headX);
						measure.lineX = round(measure.lineX);
						measure.noteRange = {
							begin: round(measure.noteRange.begin),
							end: round(measure.noteRange.end),
						};

						measure.tokens = measure.matchedTokens.map(token => new StaffToken(pick(token, [
							"x", "y", "symbol", "href", "scale", "tied",
						])));
						delete measure.matchedTokens;
					});
				});
			});
		});
	}


	appendLinkedTokensForStaves (): void {
		const doneTokens = new Set();
		const appendLink = (staff: SheetStaff, oldStaff: SheetStaff, token: StaffToken): void => {
			if (doneTokens.has(token.index))
				return;
			//console.log("appendLink:", staff, oldStaff, token);
			const dy = staff.y - oldStaff.y;

			const measure = staff.measures.find(measure => measure.noteRange.end >= token.x);
			if (measure) {
				const newToken = new StaffToken({...token, symbols: new Set(), y: token.y - dy, ry: token.ry - dy});
				token.addSymbol("ACROSS_STAVES");
				newToken.addSymbol("ACROSS_STAVES");
				newToken.addSymbol("DUPLICATED");
				measure.tokens.push(newToken);
			}
			else
				console.warn("appendLink failed, because no fit measure:", staff.measures, token);

			doneTokens.add(token.index);
		};

		this.pages.forEach(page => {
			const tokens: StaffToken[] = (page.systems
				.map(system => system.staves
					.map(staff => staff.measures
						.map(measure => measure.tokens))) as any).flat(3);
			const tokenStaffTable: Record<number, SheetStaff> = page.systems
				.reduce((table, system) => system.staves
					.reduce((table, staff) => staff.measures
						.reduce((table, measure) => measure.tokens
							.reduce((table, token) => {
								table[token.index] = staff;
								return table;
							}, table), table), table), {});

			//console.log("tokenStaffTable:", tokenStaffTable);

			tokens.forEach(token => {
				if (token.stems) {
					const staff = tokenStaffTable[token.index];
					token.stems.forEach(stem => {
						if (tokenStaffTable[stem] !== staff)
							appendLink(tokenStaffTable[stem], staff, token);
					});
				}
			});
		});
	}
};



export default SheetDocument;
