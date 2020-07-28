
import {CM_TO_PX} from "../constants";



// eslint-disable-next-line
declare class StaffToken {
	row?: number;
	measure?: number;
	endX?: number;
};


interface StaffMarking {
	id: string;
	text: string;
	cls?: string;
	x: number;
	y: number;
};


interface SheetMeasures {
	index: number;
	tokens: StaffToken[];
	headX: number;
	lineX?: number;
	matchedTokens?: StaffToken[];
	noteRange: {
		begin: number,
		end: number,
	};

	class?: {[key: string]: boolean};
};


interface SheetStaff {
	measures: SheetMeasures[];
	tokens: StaffToken[];

	markings: StaffMarking[];

	// the third staff line Y coordinate value
	//	The third staff line Y supposed to be zero, but regarding to the line stroke width,
	//	there is some error for original values in SVG document (which erased by coordinate rounding).
	yRoundOffset: number; // 0.0657 for default

	x: number;
	y: number;
	top?: number;
};


interface SheetRows {
	index?: number;
	pageIndex?: number;
	measureIndices?: [number, number][];	// [end_x, index]
	staves: SheetStaff[];
	tokens: StaffToken[];

	x: number;
	y: number;
	width: number;
	top: number;
	bottom: number;
};


interface SheetPage {
	width: string;
	height: string;
	viewBox: {
		x: number,
		y: number,
		width: number,
		height: number,
	};

	rows: SheetRows[];
	tokens: StaffToken[];
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
	[-2]: "\u0125",
	[-1]: "\u0122",
	[0]: "\u0123",
	[1]: "\u0121",
	[2]: "\u0124",
};


let sheetMarkingIndex = 0;


class SheetMarking {
	alter?: number;
	index: number;	// as v-for key

	id?: string;
	x?: number;
	y?: number;
	cls?: string;


	constructor (fields) {
		this.index = sheetMarkingIndex++;
		Object.assign(this, fields);
	}


	get alterText () {
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


class SheetDocument {
	pages: SheetPage[];


	constructor (fields) {
		Object.assign(this, fields);

		this.updateTokenIndex();
	}


	get rows () {
		return [].concat(...this.pages.map(page => page.rows));
	}


	get trackCount () {
		return Math.max(...this.rows.map(row => row.staves.length), 0);
	}


	get pageSize () {
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

		this.pages.forEach((page, index) => page.rows.forEach(row => row.pageIndex = index));

		let rowMeasureIndex = 1;

		this.rows.forEach((row, index) => {
			row.index = index;
			row.width = row.tokens.concat(...row.staves.map(staff => staff.tokens))
				.reduce((max, token) => Math.max(max, token.x), 0);

			row.measureIndices = [];

			row.staves = row.staves.filter(s => s);
			row.staves.forEach((staff, t) => {
				staff.measures.forEach((measure, i) => {
					measure.index = rowMeasureIndex + i;
					measure.class = {};

					measure.tokens.forEach(token => {
						token.row = index;
						token.measure = measure.index;
						token.endX = measure.noteRange.end;
					});

					measure.lineX = measure.lineX || 0;
					if (i < staff.measures.length - 1)
						staff.measures[i + 1].lineX = measure.noteRange.end;

					if (t === 0)
						row.measureIndices.push([measure.noteRange.end, measure.index]);
				});

				staff.markings = [];
				staff.yRoundOffset = 0;
			});

			rowMeasureIndex += Math.max(...row.staves.map(staff => staff.measures.length));
		});
	}


	updateMatchedTokens (matchedIds: Set<string>) {
		this.rows.forEach(row => {
			row.staves.forEach(staff =>
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


	addMarking (rowIndex, staffIndex, data) {
		const row = this.rows[rowIndex];
		if (!row) {
			console.warn("row index out of range:", rowIndex, this.rows.length);
			return;
		}

		const staff = row.staves[staffIndex];
		if (!staff) {
			console.warn("staff index out of range:", staffIndex, row.staves.length);
			return;
		}

		const marking = new SheetMarking(data);
		staff.markings.push(marking);

		return marking;
	}


	removeMarking (id) {
		this.rows.forEach(row => row.staves.forEach(staff =>
			staff.markings = staff.markings.filter(marking => marking.id !== id)));
	}


	clearMarkings () {
		this.rows.forEach(row => row.staves.forEach(staff => staff.markings = []));
	}


	toJSON () {
		return {
			__prototype: "SheetDocument",
			pages: this.pages,
		};
	}


	getLocationTable (): MeasureLocationTable {
		const table = {};

		this.rows.forEach(row => row.staves.forEach(staff => staff.measures.forEach(measure => {
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


	lookupMeasureIndex (rowIndex, x): number {
		const row = this.rows[rowIndex];
		if (!row || !row.measureIndices)
			return null;

		const [_, index] = row.measureIndices.find(([end]) => x < end) || [null, null];

		return index;
	}


	fitPageViewbox ({margin = 5} = {}) {
		if (!this.pages || !this.pages.length)
			return;

		const svgScale = this.pageSize.width / this.pages[0].viewBox.width;

		for (const page of this.pages) {
			const rects = page.rows.map(row => [row.x, row.x + row.width, row.y + row.top, row.y + row.bottom ]);

			const left = Math.min(...rects.map(rect => rect[0]));
			const right = Math.max(...rects.map(rect => rect[1]));
			const top = Math.min(...rects.map(rect => rect[2]));
			const bottom = Math.max(...rects.map(rect => rect[3]));

			page.viewBox = {
				x: left - margin,
				y: top - margin,
				width: right - left + margin * 2,
				height: bottom - top + margin * 2,
			};

			page.width = (page.viewBox.width * svgScale).toString();
			page.height = (page.viewBox.height * svgScale).toString();
		}
	}
};



export default SheetDocument;
