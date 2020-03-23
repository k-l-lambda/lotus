
import * as _ from "lodash";



export default class StaffToken {
	x: Number;
	y: Number;
	rx: Number;
	ry: Number;
	symbol: String;
	symbols = new Set();
	hash: String;


	constructor (data) {
		Object.assign(this, data);

		if (this.symbol) 
			this.symbol.split(" ").forEach(symbol => this.symbols.add(symbol));
		
	}


	toJSON () {
		return {
			__prototype: "StaffToken",
			..._.pick(this, ["x", "y", "rx", "ry", "symbol", "hash"]),
		};
	}


	is (symbol) {
		const queries = symbol.split(" ");
		for (const query of queries) {
			if (!this.symbols.has(query))
				return false;
		}

		return true;
	}


	translate (options) {
		const data : any = {...this};
		if (options.x) {
			data.x -= options.x;
			data.rx -= options.x;
		}
		if (options.y) {
			data.y -= options.y;
			data.ry -= options.y;
		}

		return new StaffToken(data);
	}


	get classes () {
		return Array.from(this.symbols).map((s: string) => s.toLowerCase()).join(" ");
	}


	get alterValue () {
		if (this.is("NATURAL"))
			return 0;

		if (this.is("SHARP"))
			return 1;

		if (this.is("FLAT"))
			return -1;

		// TODO: double sharp & double flat

		return null;
	}


	get clefValue () {
		if (this.is("TREBLE"))
			return 4;

		if (this.is("BASS"))
			return -4;

		if (this.is("ALTO"))
			return 0;

		return null;
	}


	get octaveShiftValue () {
		if (this.is("A"))
			return -1;

		if (this.is("B"))
			return 1;

		if (this.is("CLOSE"))
			return 0;

		return null;
	}


	get timeSignatureValue () {
		if (this.is("CUT_C"))
			return 2;

		if (this.is("C"))
			return 4;

		const numbers = Array(9).fill(null).map((_, i) => i + 1);
		for (const n of numbers) {
			if (this.is(n.toString()))
				return n;
		}

		// TODO: maybe some single value can be greater than 10?

		return null;
	}
};
