
import {constants, roundNumber} from "./utils";
import {Glyph, slashGlyphName, GlyphUnicode} from "./glyph";
import pick from "../pick";



type Point2 = {x: number, y: number};



export default class StaffToken {
	index: number;	// the token index in page

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
	scaleX?: number;
	width?: number;
	height?: number;
	text?: string;
	start?: Point2;
	target?: Point2;
	source?: string;
	tied?: boolean;
	stemX?: number;
	stemUp?: boolean;
	track?: number;
	tick?: number;
	pitch?: number;
	glyph?: Glyph;
	stems?: number[];	// array of stem token's index (for notehead & beam)
	stem?: number;	// stem token's index (for flags)
	beam?: number;	// joint capital beam token's index
	division?: number;	// stem flag counts + 2

	system?: number;
	measure?: number;
	endX?: number;


	constructor (data) {
		Object.assign(this, data);

		if (this.symbol)
			this.symbol.split(" ").forEach(symbol => this.symbols.add(symbol));
	}


	toJSON (): object {
		const x = roundNumber(this.x, 1e-4);
		const y = roundNumber(this.y, 1e-4);

		return {
			__prototype: "StaffToken",
			x, y,
			...pick(this, ["index", "rx", "ry", "sw", "start", "target", "source", "tied",
				"symbol", "hash", "href", "scale", "scaleX", "width", "height", "text", "stemX", "stemUp",
				"track", "tick", "pitch", "glyph", "stems", "stem", "beam", "division"]),
		};
	}


	// DEPRECATED
	get row (): number {
		return this.system;
	}
	set row (value: number) {
		this.system = value;
	}


	get scale2 (): {x: number, y: number} {
		if (!Number.isFinite(this.scale))
			return null;

		return {
			x: this.scale * (this.scaleX || 1),
			y: this.scale,
		};
	}


	is (symbol: string): boolean {
		const queries = symbol.split(" ");

		return queries.every(query => this.symbols.has(query));
	}


	addSymbol (...symbols: string[]) {
		symbols.forEach(symbol => this.symbols.add(symbol));
		this.symbol = Array.from(this.symbols).join(" ");
	}


	removeSymbol (symbol: string) {
		this.symbols.delete(symbol);
		this.symbol = Array.from(this.symbols).join(" ");
	}


	translate (options: {x?: number, y?: number}): StaffToken {
		const data : any = {...this};
		if (options.x) {
			data.x += options.x;
			data.rx += options.x;
		}
		if (options.y) {
			data.y += options.y;
			data.ry += options.y;
		}

		return new StaffToken(data);
	}


	get logicX (): number {
		return Number.isFinite(this.stemX) ? this.stemX : this.x;
	}


	// to assist staves splitting
	get logicOffsetY (): number {
		if (this.is("OCTAVE A"))
			return 4;

		if (this.is("OCTAVE B"))
			return -4;

		if (this.is("OCTAVE CLOSE UP"))
			return 4;

		if (this.is("OCTAVE CLOSE DOWN"))
			return -4;

		if (this.is("ATTACHED UP"))
			return 1.5;
		else if (this.is("ATTACHED DOWN"))
			return -1.5;

		if (this.is("NOTETAIL UP"))
			return 2;
		else if (this.is("NOTETAIL DOWN"))
			return -2;

		if (this.is("NOTE_STEM"))
			return this.height / 2;

		if (this.is("LYRIC_TEXT"))
			return -4;

		let dy = 0;

		if (this.is("WEDGE DECRESCENDO"))
			dy = this.target.y;
		/*if (this.is("WEDGE")) {
			if (this.is("CRESCENDO"))
				dy = -Math.abs(this.target.y);
			else if (this.is("DECRESCENDO BOTTOM"))
				dy = this.target.y * 2;
		}*/

		if (this.source) {
			if (/^\^/.test(this.source))
				dy += 2;

			if (/^_/.test(this.source))
				dy -= 2;
		}

		if (this.is("SUSTAIN"))
			return -4;

		return dy;
	}


	get withUp (): boolean {
		return this.source && /^\^/.test(this.source);
	}


	get withDown (): boolean {
		return (this.source && /^_/.test(this.source)) || this.is("LYRIC_TEXT");
	}


	get topAtSystem (): boolean {
		return this.is("OCTAVE A") || this.is("CHORD_TEXT") || this.is("REPEAT_SIGN SEGNO")
			|| this.is("REPEAT_SIGN CODA") || this.is("TEMPO_NOTEHEAD") || this.is("TEMPO_NOTE_STEM");
	}


	get logicY (): number {
		return this.y + this.logicOffsetY;
	}


	get centerX (): number {
		return this.x + (Number.isFinite(this.width) ? this.width / 2 : 0);
	}


	get classes (): string {
		return Array.from(this.symbols).map((s: string) => s.toLowerCase().replace(/_/g, "-")).join(" ");
	}


	get alterValue (): number {
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


	get clefValue (): number {
		if (this.is("TREBLE"))
			return 4;

		if (this.is("BASS"))
			return -4;

		if (this.is("ALTO"))
			return 0;

		return null;
	}


	get octaveShiftValue (): number {
		if (this.is("A"))
			return this.is("_15") ? -2 : -1;

		if (this.is("B"))
			return this.is("_15") ? 2 : 1;

		if (this.is("CLOSE"))
			return 0;

		return null;
	}


	get timeSignatureValue (): number {
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


	get sourcePosition (): {line: number, start: number, end: number} {
		if (!this.href)
			return null;

		const [line, start, end] = this.href.match(/\d+/g).map(Number);

		return {line, start, end};
	}


	get sourceProgress (): number {
		if (!this.sourcePosition)
			return 0;

		const {line, start} = this.sourcePosition;

		return line + start * 1e-4;
	}


	get glyphClass (): string {
		return slashGlyphName(this.glyph);
	}


	get fontUnicode (): string {
		return GlyphUnicode[this.glyph];
	}


	get noteType (): number {
		if (this.is("DIAMOND"))
			return 4;

		if (this.is("WHOLE"))
			return 0;
		else if (this.is("HALF"))
			return 1;
		else if (this.is("SOLID"))
			return 2;
		else if (this.is("CROSS"))
			return 3;
	}


	get flagNumber (): number {
		if (this.glyph)
			return Number((this.glyph as any).match(/\d+/)[0]);

		if (this.is("EIGHTH"))
			return 3;
		if (this.is("SIXTEENTH"))
			return 4;
		if (this.is("THIRTYSECOND"))
			return 5;
		if (this.is("SIXTYFOURTH"))
			return 6;
		if (this.is("HUNDREDTWENTYEIGHTH"))
			return 7;
		if (this.is("TWOHUNDREDSFIFTYSIXTH"))
			return 8;

		return null;
	}


	// DEPRECATED
	get musicFontNoteOffset (): number {
		return constants.MUSIC_FONT_NOTE_OFFSETS[this.noteType];
	}


	stemAttached ({x, y, href}): boolean {
		if (!this.is("NOTE_STEM"))
			return null;

		const cx = this.x + this.width / 2;
		if (Math.abs(x - cx) > 0.1)
			return false;

		const top = this.y - 0.2;
		const bottom = this.y + this.height + 0.2;

		const attached = y > top && y < bottom;

		if (!attached) {
			const distance = Math.abs(x - cx) + Math.min(Math.abs(y - top), Math.abs(y - bottom));
			if (distance < 0.18)
				console.warn("unattached nearby point:", href, x - cx, y - top, y - bottom);
		}

		return attached;
	}


	// up: 1, down: -1
	get direction (): number {
		if (typeof this.stemUp === "boolean")
			return this.stemUp ? 1 : -1;

		if (this.is("UP"))
			return 1;

		if (this.is("DOWN"))
			return -1;

		return 0;
	}
};
