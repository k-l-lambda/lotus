
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
};


interface SheetRows {
	index?: number;
	staves: SheetStaff[];
};


interface SheetPage {
	rows: SheetRows[];
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
			});
		});
	}


	updateMatchedTokens (matchedIds) {
		this.rows.forEach(row => {
			row.staves.forEach(staff =>
				staff.measures.forEach(measure =>
					measure.matchedTokens = measure.tokens.filter(token => token.href && matchedIds.has(token.href))));
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

		staff.markings.push(data);
	}


	removeMarking (id) {
		this.rows.forEach(row => row.staves.forEach(staff =>
			staff.markings = staff.markings.filter(marking => marking.id !== id)));
	}


	toJSON () {
		return {
			__prototype: "SheetDocument",
			pages: this.pages,
		};
	}
};



export default SheetDocument;
