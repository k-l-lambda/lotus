
declare class StaffToken {
	row?: number;
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
	tokens: StaffToken[];
};


interface SheetStaff {
	measures: SheetMeasures[];

	markings: StaffMarking[];

	// the third staff line Y coordinate value
	//	The third staff line Y supposed to be zero, but regarding to the line stroke width,
	//	there is some error for original values in SVG document (which erased by coordinate rounding).
	yRoundOffset: number; // 0.0657 for default
};


interface SheetRows {
	index?: number;
	staves: SheetStaff[];
};


interface SheetPage {
	rows: SheetRows[];
};


/*const ALTER_PREFIXES = {
	[-2]: "\u266D\u266D",
	[-1]: "\u266D",
	[0]: "\u266E",
	[1]: "\u266F",
	[2]: "\uD834\uDD2A",
};*/
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


class SheetDocument {
	pages: SheetPage[];


	constructor (fields) {
		Object.assign(this, fields);

		this.updateTokenIndex();
	}


	get rows () {
		return [].concat(...this.pages.map(page => page.rows));
	}


	updateTokenIndex () {
		this.rows.forEach((row, index) => {
			row.index = index;
			row.width = row.tokens.concat(...row.staves.map(staff => staff.tokens))
				.reduce((max, token) => Math.max(max, token.x), 0);

			row.staves = row.staves.filter(s => s);
			row.staves.forEach(staff => {
				staff.measures.forEach(measure =>
					measure.tokens.forEach(token => {
						token.row = index;
						token.endX = measure.noteRange.end;
					}));

				staff.markings = [];
				staff.yRoundOffset = 0;
			});
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
};



export default SheetDocument;
