
import _ from "lodash";

import {constants} from "./utils";



export default class StaffToken {
	x: number;
	y: number;
	rx: number;
	ry: number;
	sw: number;
	symbol: string;
	symbols: Set<string> = new Set();
	hash: string;
	href: string;
	scale?: number;
	width?: number;
	height?: number;
	text?: string;
	start?: object;
	target?: object;
	source?: string;
	tied?: boolean;
	stemX?: number;


	constructor (data) {
		Object.assign(this, data);

		if (this.symbol)
			this.symbol.split(" ").forEach(symbol => this.symbols.add(symbol));
	}


	toJSON () {
		return {
			__prototype: "StaffToken",
			..._.pick(this, ["x", "y", "rx", "ry", "sw", "start", "target", "source", "tied",
				"symbol", "hash", "href", "scale", "width", "height", "text", "stemX"]),
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


	addSymbol (symbol) {
		this.symbols.add(symbol);
		this.symbol = Array.from(this.symbols).join(" ");
	}


	removeSymbol (symbol) {
		this.symbols.delete(symbol);
		this.symbol = Array.from(this.symbols).join(" ");
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


	get logicX () {
		return Number.isFinite(this.stemX) ? this.stemX : this.x;
	}


	// to assist staves splitting
	get logicOffsetY () {
		if (this.is("OCTAVE CLOSE UP"))
			return 2;

		if (this.is("OCTAVE CLOSE DOWN"))
			return -2;

		return 0;
	}


	get classes () {
		return Array.from(this.symbols).map((s: string) => s.toLowerCase().replace(/_/g, "-")).join(" ");
	}


	get alterValue () {
		if (this.is("NATURAL"))
			return 0;

		if (this.is("SHARP"))
			return 1;

		if (this.is("SHARPSHARP"))
			return 2;

		if (this.is("FLAT"))
			return -1;

		if (this.is("FLATFLAT"))
			return -2;

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


	get sourcePosition () {
		if (!this.href)
			return null;

		const [_, line, start, end] = this.href.match(/(\d+):(\d+):(\d+)/);

		return {line, start, end};
	}


	get fontChar () {
		if (this.is("NOTEHEAD")) {
			if (this.is("WHOLE"))
				return "\u0141";
			else if (this.is("HALF"))
				return "\u017c";
			else if (this.is("SOLID"))
				return "\u0174";
			else if (this.is("CROSS"))
				return "\u014e";
		}

		return null;
	}


	get noteType () {
		if (this.is("WHOLE"))
			return 0;
		else if (this.is("HALF"))
			return 1;
		else if (this.is("SOLID"))
			return 2;
		else if (this.is("CROSS"))
			return 3;
	}


	get musicFontNoteOffset () {
		return constants.MUSIC_FONT_NOTE_OFFSETS[this.noteType];
	}


	stemAttached ({x, y}) {
		if (!this.is("NOTE_STEM"))
			return null;

		const cx = this.x + this.width / 2;
		if (Math.abs(x - cx) > 0.1)
			return false;

		const top = this.y - 0.3;
		const bottom = this.y + this.height + 0.3;

		const attached = y > top && y < bottom;

		if (!attached) {
			const distance = Math.abs(x - cx) + Math.min(Math.abs(y - top), Math.abs(y - bottom));
			if (distance < 1)
				console.warn("unattached nearby point:", x - cx, y - top, y - bottom);
		}

		return attached;
	}
};
