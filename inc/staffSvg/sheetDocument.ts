
declare class StaffToken {
	row?: number;
};


interface SheetMeasures {
	tokens: StaffToken[];
};


interface SheetStaff {
	measures: SheetMeasures[];
};


interface SheetRows {
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
		this.rows.forEach((row, index) =>
			row.staves.forEach(staff =>
				staff.measures.forEach(measure =>
					measure.tokens.forEach(token => {
						token.row = index;
						token.endX = measure.noteRange.end;
					}))));
	}


	toJSON () {
		return {
			__prototype: "SheetDocument",
			pages: this.pages,
		};
	}
};



export default SheetDocument;
