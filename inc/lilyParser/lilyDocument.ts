
import TextSource from "../textSource";
import {LILY_STAFF_SIZE_DEFAULT} from "../constants";



interface LilyTerm {
	isMusic?: boolean;

	serialize () : string[];
	join () : string;

	query (key: string): any;
};


interface Location {
	lines: [number, number];
	columns: [number, number];
};


class MusicChunk {
	parent: MusicBlock;
	terms: BaseTerm[];


	constructor (parent: MusicBlock) {
		this.parent = parent;
		this.terms = [];
	}


	push (term: BaseTerm) {
		this.terms.push(term);
	}


	get size () {
		return this.terms.length;
	}


	get durationMagnitude () {
		return this.terms.reduce((magnitude, term) => magnitude + term.durationMagnitude, 0);
	}
};


interface MusicVoice {
	name?: string;
	body: MusicChunk[];
};


// concat array of array
const cc = <T>(arrays: T[][]): T[] => [].concat(...arrays);


const isNullItem = item => item === "" || item === undefined || item === null || (Array.isArray(item) && !item.length);
const compact = items => cc(items.map((item, index) => isNullItem(item) ? [] : [index > 0 ? "\b" : null, item]));


const WHOLE_DURATION_MAGNITUDE = 128 * 3 * 5;


const PHONETS = "cdefgab";
const PHONETS_ALIAS = {
	h: "b",
};


export class BaseTerm implements LilyTerm {
	_location?: Location;
	_measure?: number;
	_previous?: BaseTerm;
	_anchorPitch?: ChordElement;
	_parent?: BaseTerm;


	constructor (data: object) {
		//Object.assign(this, data);
		for (const key in data) 
			this[key] = parseRaw(data[key]);
	}


	serialize (): any[] {
		console.warn("unimplemented serilization:", this);
		return [];
	}


	join (): string {
		let words = this.serialize().filter(word => word !== null);
		words = words.filter((word, i) => !(i && words[i - 1] === "\n" && word === "\n"));

		let indent = 0;
		const result = [];

		const pop = char => {
			if (!char || result[result.length - 1] === char)
				result.pop();
		};

		for (const word of words) {
			if (word === "\b") {
				// remove the last space
				pop(" ");
				continue;
			}

			if (/^(\}|>>)/.test(word))
				pop("\t"); // remove the last tab

			result.push(word);

			if (/\n$/.test(word)) {
				if (/(\{|<<)\n$/.test(word))
					++indent;
				else if (/^(\}|>>)/.test(word)) 
					--indent;

				if (indent)
					result.push(...Array(indent).fill("\t"));
			}
			else
				result.push(" ");
		}

		return result.join("");
	}


	clone (): this {
		return parseRaw(JSON.parse(JSON.stringify(this)));
	}


	get entries (): BaseTerm[] {
		return null;
	}


	get isMusic (): boolean {
		return false;
	}


	get musicChunks (): MusicChunk[] {
		if (!this.isMusic || !this.entries)
			return [];

		return [].concat(...this.entries.map(entry => entry.musicChunks));
	}


	get measures (): number[] {
		const indices = [this._measure].concat(...(this.entries || []).map(entry => entry.measures)).filter(index => Number.isInteger(index));

		return Array.from(new Set(indices));
	}


	get durationMagnitude (): number {
		return 0;
	}


	get proto () {
		return termProtoMap.get(Object.getPrototypeOf(this));
	}


	getField (key): any {
		console.assert(!!this.entries, "[BaseTerm.getField] term's entries is null:", this);

		for (const entry of this.entries) {
			const result = entry.query(key);
			if (result)
				return result;
		}
	}


	query (key: string): any {
		void(key);
		//console.warn("term.query not implemented:", this);
	}


	appendAssignment (key, value) {
		console.assert(!!this.entries, "no entries on this term.");

		const assign = this.getField(key);
		if (assign)
			assign.value = value;
		else {
			this.entries.push(parseRaw({
				proto: "Assignment",
				key,
				value: value,
			}));
		}
	}


	findFirst (termClass): BaseTerm {
		if (!this.entries)
			return null;

		for (const entry of this.entries) {
			if (entry instanceof termClass)
				return entry;
	
			if (entry instanceof BaseTerm) {
				const result = entry.findFirst(termClass);
				if (result)
					return result;
			}
		}
	}


	forEachTerm (termClass, handle) {
		if (!this.entries)
			return;

		for (const entry of this.entries) {
			if (entry instanceof termClass)
				handle(entry);

			if (entry instanceof BaseTerm)
				entry.forEachTerm(termClass, handle);
		}
	}


	forEachTopTerm (termClass, handle) {
		if (!this.entries)
			return;

		for (const entry of this.entries) {
			if (entry instanceof termClass)
				handle(entry);
			else if (entry instanceof BaseTerm)
				entry.forEachTopTerm(termClass, handle);
		}
	}


	toJSON () {
		// exlude meta fields in JSON
		const {_location, _measure, _previous, _anchorPitch, _parent, ...data} = this;
		void _location;
		void _measure;
		void _previous;
		void _anchorPitch;
		void _parent;

		Object.entries(data).forEach(([key, value]) => {
			if (value && typeof value === "object" && !Array.isArray(value) && !(value instanceof BaseTerm))
				data[key] = {proto: "_PLAIN", ...value};
		});

		return {
			proto: this.proto,
			...data,
		};
	}


	static isTerm (x): boolean {
		return typeof x === "object" && x instanceof BaseTerm;
	}


	static optionalSerialize (item: any): any[] {
		return BaseTerm.isTerm(item) ? (item as LilyTerm).serialize() : (item === undefined ? [] : [item]);
	}


	static serializeScheme (item: any): any[] {
		if (typeof item === "boolean")
			item = item ? "#t" : "#f";

		return BaseTerm.optionalSerialize(item);
	}
}


export class Root extends BaseTerm {
	sections: BaseTerm[];


	serialize () {
		return [].concat(...this.sections.map(section => [...section.serialize(), "\n\n"]));
	}


	get entries (): BaseTerm[] {
		return this.sections;
	}


	getBlock (head): Block {
		return this.entries.find((entry: any) => entry.head === head || (entry.head === "\\" + head)) as Block;
	}
};


export class Primitive extends BaseTerm {
	exp: string | number;


	serialize () {
		return [this.exp];
	}
};


export class LiteralString extends BaseTerm {
	exp: string


	static fromString (content: string): LiteralString {
		return new LiteralString({exp: JSON.stringify(content)});
	}


	serialize () {
		return [this.exp];
	}


	toString () {
		try {
			return eval(this.exp);
		}
		catch (err) {
			console.warn("invalid lilypond string exp:", this.exp);
			return this.exp;
		}
	}
};


export class Command extends BaseTerm {
	cmd: string;
	args: any[];


	constructor (data) {
		super(data);

		this.args.forEach(term => {
			if (term instanceof MusicBlock || term instanceof Block)
				term._parent = this;
		});
	}


	serialize () {
		return [
			"\\" + this.cmd,
			...[].concat(...this.args.map(BaseTerm.optionalSerialize)),
			["break", "pageBreak", "overrideProperty"].includes(this.cmd) ? "\n" : null,
		];
	}


	get entries () {
		return this.args.filter(arg => arg instanceof BaseTerm);
	}


	get isMusic () {
		for (const arg of this.args) {
			if (arg.isMusic)
				return true;
		}

		return false;
	}


	get isGrace () {
		return GRACE_COMMANDS.includes(this.cmd);
	}


	get musicChunks (): MusicChunk[] {
		if (this.cmd === "alternative")
			return [].concat(...this.args[0].body.map(term => term.musicChunks));

		return [].concat(...this.entries.map(entry => entry.musicChunks));
	}


	get isRepeatWithAlternative () {
		return this.cmd === "repeat"
			&& this.args[2] instanceof MusicBlock
			&& this.args[3]
			&& this.args[3].cmd === "alternative";
	}


	get durationMagnitude (): number {
		switch (this.cmd) {
		case "times": {
			const factor = eval(this.args[0]);
			return this.args[1].durationMagnitude * factor;
		}

		case "tuplet": {
			const factor = 1 / eval(this.args[0]);
			return this.args[this.args.length - 1].durationMagnitude * factor;
		}

		case "afterGrace":
			return this.args[0].durationMagnitude;

		default:
			if (this.isGrace)
				return 0;

			return this.args.filter(arg => arg instanceof BaseTerm).reduce((magnitude, term) => magnitude + term.durationMagnitude, 0);
		}
	}
};


export class Variable extends Command {
	name: string


	constructor ({name}) {
		super({cmd: name, args: []});

		this.name = name;
	}


	toJSON (): any {
		return {
			proto: this.proto,
			name: this.name,
		};
	}


	queryValue (dict: BaseTerm): any {
		const field = dict.getField(this.name);

		return field && field.value;
	}
};


export class MarkupCommand extends Command {
	toString () {
		const strs = [];
		this.forEachTerm(LiteralString, term => strs.push(term.toString()));

		return strs.join("\n");
	}
};


export class Repeat extends Command {
	get times () {
		return Number(this.args[1]);
	}


	get bodyBlock (): MusicBlock {
		return this.args[2];
	}


	get alternativeBlocks (): MusicBlock[] {
		return this.args[3] && this.args[3].args[0].body;
	}


	// this result length equal to times, if not null
	get completeAlternativeBlocks (): MusicBlock[] {
		if (!this.alternativeBlocks || !this.alternativeBlocks.length)
			return null;

		if (this.alternativeBlocks.length >= this.times)
			return this.alternativeBlocks.slice(0, this.times);

		const list = [];
		for (let i = 0; i < this.times - this.alternativeBlocks.length; ++ i)
			list.push(this.alternativeBlocks[0]);
		list.push(...this.alternativeBlocks);

		return list;
	}


	// \repeat {body} \alternative {{alter1} {alter2}}		=> body alter1 body alter2
	getUnfoldTerms (): BaseTerm[] {
		const completeAlternativeBlocks = this.completeAlternativeBlocks;

		const list = [];
		for (let i = 0; i < this.times; ++i) {
			list.push(...this.bodyBlock.clone().body);

			if (completeAlternativeBlocks)
				list.push(...completeAlternativeBlocks[i].clone().body);
		}

		return list;
	}


	// \repeat {body} \alternative {{alter1} {alter2}}		=> body alter1 alter2
	getPlainTerms (): BaseTerm[] {
		const list = [...this.bodyBlock.clone().body];

		const alternativeBlocks = this.alternativeBlocks;
		if (alternativeBlocks)
			alternativeBlocks.forEach(block => list.push(...block.clone().body));

		return list;
	}


	// \repeat {body} \alternative {{alter1} {alter2}}		=> body alter2
	getTailPassTerms (): BaseTerm[] {
		const list = [...this.bodyBlock.clone().body];

		const alternativeBlocks = this.alternativeBlocks;
		if (alternativeBlocks)
			list.push(...alternativeBlocks[alternativeBlocks.length - 1].clone().body);

		return list;
	}
};


export class Relative extends Command {
	static makeBlock (block: MusicBlock): Relative {
		const chord = block.findFirst(Chord) as Chord;
		const anchor = chord && chord.anchorPitch;

		return new Relative({cmd: "relative", args: [anchor, block].filter(term => term)});
	}


	get anchor (): ChordElement {
		if (this.args[0] instanceof ChordElement)
			return this.args[0];

		return null;
	}
}


export class Block extends BaseTerm {
	head: (string|string[]);
	body: BaseTerm[];


	constructor (data) {
		super(data);

		this.body = this.body.map(parseRawEnforce);
	}


	serialize () {
		const heads = Array.isArray(this.head) ? this.head : (this.head ? [this.head] : []);

		return [
			...heads,
			"{\n",
			...cc(this.body.map(section => [...BaseTerm.optionalSerialize(section), "\n"])),
			"}\n",
		];
	}


	get entries () {
		return this.body;
	}
};


export class InlineBlock extends Block {
	serialize () {
		return [
			"{",
			...cc(this.body.map(BaseTerm.optionalSerialize)),
			"}",
		];
	}
};


export class MusicBlock extends BaseTerm {
	body: BaseTerm[];


	constructor (data) {
		super(data);

		this.body = this.body.map(parseRawEnforce);
	}


	serialize () {
		return [
			"{\n",
			...cc(this.body.map(BaseTerm.optionalSerialize)),
			"\n",
			"}\n",
		];
	}


	get entries () {
		return this.body;
	}


	get isMusic () {
		return true;
	}


	get musicChunks (): MusicChunk[] {
		const chunks = [];
		let currentChunk = new MusicChunk(this);

		const dumpChunk = () => {
			if (currentChunk.size)
				chunks.push(currentChunk);

			currentChunk = new MusicChunk(this);
		};

		for (const term of this.entries) {
			if (term instanceof Command && term.cmd === "repeat") {
				dumpChunk();
				chunks.push(...term.musicChunks);
			}
			else if (term instanceof Divide)
				dumpChunk();
			else
				currentChunk.push(term);
		}

		dumpChunk();

		return chunks;
	}


	// for parallelMusic only
	get voiceNames () {
		const header = this._parent as Command;
		if (header && header.cmd === "parallelMusic") {
			if (header.args[0] instanceof Scheme && header.args[0].exp instanceof SchemePointer && header.args[0].exp.value instanceof SchemeFunction) {
				const voices = header.args[0].exp.value.asList;
				return voices;
			}
		}

		return null;
	}


	get voices (): MusicVoice[] {
		const voiceNames = this.voiceNames;
		if (!voiceNames)
			return [{body: this.musicChunks}];

		const chunks = this.musicChunks;
		const measureCount = Math.ceil(chunks.length / voiceNames.length);

		return voiceNames.map((name, index) => ({
			name: name.toString(),
			body: Array(measureCount).fill(null).map((_, m) => chunks[m * voiceNames.length + index]).filter(chunk => chunk),
		}));
	}


	get durationMagnitude (): number {
		return this.body.reduce((magnitude, term) => magnitude + term.durationMagnitude, 0);
	}


	get isRelative (): boolean {
		return this._parent instanceof Relative;
	}


	get anchorPitch (): ChordElement {
		if (this.isRelative) 
			return (this._parent as Relative).anchor;

		return null;
	}


	updateChordChains () {
		let previous: MusicEvent = null;

		this.forEachTerm(MusicEvent, event => {
			event._previous = previous;
			if (this.isRelative && !previous)
				event._anchorPitch = this.anchorPitch || event.pitches[0];

			previous = event;
		});
	}


	spreadRepeatBlocks ({ignoreRepeat = true, keepTailPass = false} = {}): this {
		this.forEachTerm(MusicBlock, block => block.spreadRepeatBlocks());

		this.body = cc(this.body.map(term => {
			if (term instanceof Repeat) {
				if (!ignoreRepeat)
					return term.getUnfoldTerms();
				else if (keepTailPass)
					return term.getTailPassTerms();
				else
					return term.getPlainTerms();
			}
			else
				return [term];
		}));

		return this;
	}


	spreadRelativeBlocks (): this {
		this.forEachTerm(MusicBlock, block => block.spreadRelativeBlocks());

		this.body = cc(this.body.map(term => {
			if (term instanceof Relative) {
				// TODO:
			}
			else
				return [term];
		}));

		return this;
	}


	expandVariables (dict: BaseTerm) {
		this.body = this.body.map(term => {
			if (term instanceof Variable) {
				const value = term.queryValue(dict);
				const clonedValue = value instanceof BaseTerm ? value.clone() : value;

				if (clonedValue instanceof BaseTerm) {
					clonedValue.forEachTerm(MusicBlock, block => block.expandVariables(dict));

					if (clonedValue instanceof MusicBlock)
						clonedValue.expandVariables(dict);
				}

				return clonedValue;
			}

			return term;
		});
	}
};


export class SimultaneousList extends BaseTerm {
	list: BaseTerm[];


	serialize () {
		return [
			"<<\n",
			...cc(this.list.map(item => [...BaseTerm.optionalSerialize(item), "\n"])),
			">>\n",
		];
	}


	removeStaffGroup () {
		for (let i = 0; i < this.list.length; ++i) {
			const item: any = this.list[i];
			if (item.head instanceof Command && item.head.args && item.head.args[0] === "StaffGroup")
				this.list[i] = item.body;
		}

		this.list.forEach(item => {
			if (item instanceof SimultaneousList)
				item.removeStaffGroup();
		});
	}


	get isMusic () {
		return true;
	}


	get entries () {
		return this.list;
	}


	get durationMagnitude (): number {
		return Math.max(...this.list.filter(term => term instanceof BaseTerm).map(term => term.durationMagnitude));
	}
};


export class ContextedMusic extends BaseTerm {
	head: BaseTerm;
	body: BaseTerm;
	lyrics?: BaseTerm;


	serialize () {
		return [
			...BaseTerm.optionalSerialize(this.head),
			...BaseTerm.optionalSerialize(this.body),
			...BaseTerm.optionalSerialize(this.lyrics),
		];
	}


	get isMusic () {
		return true;
	}


	get entries () {
		return [this.head, this.body];
	}


	get durationMagnitude (): number {
		return this.body.durationMagnitude;
	}
};


export class Divide extends BaseTerm {
	serialize () {
		return ["|\n"];
	}
}


export class Scheme extends BaseTerm {
	exp: (boolean|LilyTerm);


	serialize () {
		if (BaseTerm.isTerm(this.exp))
			return ["#", "\b", ...(this.exp as LilyTerm).serialize()];
		else if (typeof this.exp === "boolean")
			return ["#", "\b", this.exp ? "#t" : "#f"];
		// TODO: enhance grammar to parse empty scheme list
		//else if (this.exp === null)
		//	return ["#", "\b", "'()"];
		else
			return ["#", "\b", this.exp];
	}


	query (key: string): any {
		if (this.exp instanceof SchemeFunction)
			return this.exp.query(key);
	}
};


export class SchemeFunction extends BaseTerm {
	func: (string | BaseTerm);
	args: (boolean | string | BaseTerm)[];


	serialize () {
		return [
			"(", "\b",
			...BaseTerm.optionalSerialize(this.func),
			...cc(this.args.map(BaseTerm.serializeScheme)),
			"\b", ")",
		];
	}


	query (key: string): any {
		if (key === this.func) {
			const term = this;

			return {
				get value () {
					return term.args.length === 1 ? term.args[0] : term.args;
				},

				set value (value) {
					if (term.args.length === 1)
						term.args[0] = value as string|BaseTerm;
					else
						term.args = value as (string|BaseTerm)[];
				},
			};
		}
	}


	get asList (): (boolean | string | BaseTerm)[] {
		return [this.func, ...this.args];
	}
};


export class SchemePair extends BaseTerm {
	left: any;
	right: any;


	serialize () {
		return [
			"(", "\b",
			...BaseTerm.optionalSerialize(this.left), ".", ...BaseTerm.optionalSerialize(this.right),
			"\b", ")",
		];
	}
};


export class SchemePointer extends BaseTerm {
	value: any;


	serialize () {
		const content = this.value === null ? ["()"] : BaseTerm.optionalSerialize(this.value);

		return [
			"'", "\b", ...content,
		];
	}
};


export class SchemeEmbed extends BaseTerm {
	value: Root;


	serialize () {
		return [
			"#{",
			...BaseTerm.optionalSerialize(this.value),
			"#}",
		];
	}
};


export class Assignment extends BaseTerm {
	key: (string|any[]);
	value: object;


	serialize () {
		const keys = (Array.isArray(this.key) ? this.key : [this.key]).map(BaseTerm.optionalSerialize);
		const values = (Array.isArray(this.value) ? this.value : [this.value]).map(BaseTerm.optionalSerialize);

		return [
			...cc(keys),
			"=",
			...cc(values),
		];
	}


	get entries () {
		if (this.value instanceof BaseTerm)
			return [this.value];

		return null;
	}


	query (key) {
		if (this.key === key) {
			const term = this;

			return {
				get value () {
					return term.value;
				},

				set value (value) {
					term.value = value;
				},
			};
		}
	}
};


export class MusicEvent extends BaseTerm {
	duration?: Duration;
	post_events?: PostEvent[];

	_previous?: MusicEvent;
	_anchorPitch?: ChordElement;


	constructor (data: object) {
		super(data);

		if (this.post_events)
			this.post_events = this.post_events.map(parseRaw);
	}


	getPreviousT (T) {
		if (this._previous instanceof T)
			return this._previous;

		if (this._previous)
			return this._previous.getPreviousT(T);
	}


	get durationValue (): Duration {
		return this.duration || (this._previous ? this._previous.durationValue : Duration.default);
	}


	get durationMagnitude (): number {
		return this.durationValue.magnitude;
	}
};


export class Chord extends MusicEvent {
	pitches: ChordElement[];
	options: {
		exclamations?: string[],
		questions?: string[],
		rest?: string,
		withAngle?: boolean,
	};


	get single () {
		return this.pitches.length === 1;
	}


	get entries () {
		const list: BaseTerm[] = [...this.pitches];
		if (Array.isArray(this.post_events))
			list.push(...this.post_events);

		return list;
	}


	serialize () {
		const innerPitches = this.pitches.map(BaseTerm.optionalSerialize);
		const pitches = (this.single && !this.options.withAngle) ? innerPitches : [
			"<", "\b", ...cc(innerPitches), "\b", ">",
		];

		const {exclamations, questions, rest} = this.options;
		const postfix = cc([...(exclamations || []), ...(questions || []), ...BaseTerm.optionalSerialize(this.duration), rest]
			.filter(item => item)
			.map(item => ["\b", item]),
		).concat(...(this.post_events || []).map(BaseTerm.optionalSerialize));

		return [
			...pitches,
			...postfix,
		];
	}


	get isMusic () {
		return true;
	}


	get isSpacer () {
		return this.pitches.length === 1 && this.pitches[0].pitch === "s";
	}


	get pitchNames () {
		return this.pitches.map(elem => elem.pitch.replace(/'|,/g, ""));
	}


	get absolutePitch (): ChordElement {
		const anchor = this.pitches[0];
		if (anchor.phonet === "q")
			return this.anchorPitch;

		const octave = anchor.absoluteOctave(this.anchorPitch);

		return ChordElement.from({phonet: anchor.phonet, alters: anchor.alters, octave});
	}


	get anchorPitch (): ChordElement {
		if (this._anchorPitch)
			return this._anchorPitch;

		const previous = this.getPreviousT(Chord);
		if (previous)
			return previous.absolutePitch;

		return this.pitches[0];
	}
};


export class Rest extends MusicEvent {
	name: string;


	serialize () {
		return [
			...compact([
				this.name,
				...BaseTerm.optionalSerialize(this.duration),
			]),
			...cc((this.post_events || []).map(BaseTerm.optionalSerialize)),
		];
	}
};


export class ChordElement extends BaseTerm {
	pitch: string;
	options: {
		exclamations?: string[],
		questions?: string[],
		post_events?: PostEvent[],
	};


	static from ({phonet, alters, octave, options = {proto: "_PLAIN"}}): ChordElement {
		const octaveString = octave ? Array(Math.abs(octave)).fill(octave > 0 ? "'" : ",").join("") : "";
		const pitch = phonet + (alters || "") + octaveString;

		return new ChordElement({pitch, options});
	}


	constructor (data: object) {
		super(data);

		if (this.options.post_events)
			this.options.post_events = this.options.post_events.map(parseRaw);

		if (!this.pitch)
			console.log("null pitch:", this);
	}


	serialize () {
		const {exclamations, questions, post_events} = this.options;
		const postfix = [].concat(...[...(exclamations || []), ...(questions || [])]
			.filter(item => item)
			.map(item => ["\b", item]),
		).concat(...(post_events || []).map(item => ["\b", ...BaseTerm.optionalSerialize(item)]));

		return [
			this.pitch,
			...postfix,
		];
	}


	get octave (): number {
		const positive = (this.pitch.match(/'/g) || []).length;
		const negative = (this.pitch.match(/,/g) || []).length;

		return positive - negative;
	}


	get phonet (): string {
		const ph = this.pitch.substr(0, 1);

		return PHONETS_ALIAS[ph] || ph;
	}


	get phonetStep (): number {
		return PHONETS.indexOf(this.phonet);
	}


	get alters (): string {
		const captures = this.pitch.substr(1).match(/^\w+/);
		return captures && captures[0];
	}


	absoluteOctave (anchor: ChordElement): number {
		if (this.phonet === "q")
			return anchor.octave;

		const phonetDiffer = this.phonetStep - anchor.phonetStep;
		const shift = phonetDiffer > 3 ? -1 : (phonetDiffer < -3 ? 1 : 0);

		return anchor.octave + shift + this.octave;
	}
};


export class Duration extends BaseTerm {
	number: string;
	dots: number;
	multipliers?: string[];


	static _default: Duration;
	static get default (): Duration {
		if (!Duration._default)
			Duration._default = new Duration({number: 4, dots: 0});

		return Duration._default;
	}


	serialize () {
		const dots = Array(this.dots).fill(".").join("");
		const multipliers = this.multipliers && this.multipliers.map(multiplier => `*${multiplier}`).join("");

		return compact([
			this.number, dots, multipliers,
		]);
	}


	get denominator (): number {
		switch (this.number) {
		case "\\breve":
			return 0.5;

		case "\\longa":
			return 0.25;
		}

		return Number(this.number);
	}


	get magnitude (): number {
		let value = WHOLE_DURATION_MAGNITUDE / this.denominator;

		if (this.dots)
			value *= 2 - 0.5 ** this.dots;

		if (this.multipliers)
			this.multipliers.forEach(multiplier => value *= eval(multiplier));

		return value;
	}
};


interface BriefChordBody {
	pitch: string;
	duration: Duration;
	separator: string;
	items: string[];
};


export class BriefChord extends BaseTerm {
	body: BriefChordBody;
	post_events: any[];


	constructor (data: object) {
		super(data);

		if (this.body)
			this.body.duration = parseRaw(this.body.duration);
	}


	serialize () {
		const {pitch, duration, separator, items} = this.body;

		return [
			...compact(cc([pitch, duration, separator, ...(items || [])].map(BaseTerm.optionalSerialize))),
			...cc((this.post_events || []).map(BaseTerm.optionalSerialize)),
		];
	}


	get isMusic () {
		return true;
	}


	get durationMagnitude (): number {
		if (this.body.duration)
			return this.body.duration.magnitude;

		return 0;
	}
};


export class NumberUnit extends BaseTerm {
	number: number;
	unit: string;


	serialize () {
		return [this.number, "\b", this.unit];
	}


	set ({number, unit}) {
		this.number = Number(number.toFixed(2));

		if (unit !== undefined)
			this.unit = unit;
	}
}


export class Tempo extends BaseTerm {
	beatsPerMinute?: number;
	unit?: Duration;
	text?: string;


	serialize () {
		const assignment = Number.isFinite(this.beatsPerMinute) ? [...BaseTerm.optionalSerialize(this.unit), "=", this.beatsPerMinute] : [];

		return [
			"\\tempo",
			...BaseTerm.optionalSerialize(this.text),
			...assignment,
		];
	}
}


const DIRECTION_CHAR = {
	up: "^",
	down: "_",
	middle: "-",
};


export class PostEvent extends BaseTerm {
	direction: string;
	arg: string | LilyTerm;


	serialize () {
		return [DIRECTION_CHAR[this.direction], "\b", ...BaseTerm.optionalSerialize(this.arg)];
	}


	get entries () {
		if (this.arg instanceof BaseTerm)
			return [this.arg];

		return null;
	}
};


export class Fingering extends BaseTerm {
	value: number;


	serialize () {
		return [this.value];
	}
};


export class Markup extends BaseTerm {
	head: any[];
	body: (string|LilyTerm);


	serialize () {
		return [
			...cc(this.head.map(BaseTerm.optionalSerialize)),
			...BaseTerm.optionalSerialize(this.body),
		];
	}
};


export class Lyric extends BaseTerm {
	content: string | LiteralString;
	duration?: Duration;
	post_events?: any[];


	serialize () {
		return [
			...BaseTerm.optionalSerialize(this.content),
			...BaseTerm.optionalSerialize(this.duration),
			...cc((this.post_events || []).map(BaseTerm.optionalSerialize)),
		];
	}


	get isMusic () {
		return true;
	}


	get durationMagnitude (): number {
		return this.duration ? this.duration.magnitude : 0;
	}
}


export class Unexpect extends BaseTerm {
	constructor (data) {
		super(data);

		console.warn("unexpected term", data);
	}
};


export const termDictionary = {
	Root,
	LiteralString,
	Command,
	Variable,
	MarkupCommand,
	Repeat,
	Relative,
	Block,
	InlineBlock,
	Scheme,
	SchemeFunction,
	SchemePair,
	SchemePointer,
	SchemeEmbed,
	Assignment,
	Duration,
	ChordElement,
	Chord,
	Rest,
	BriefChord,
	NumberUnit,
	MusicBlock,
	SimultaneousList,
	ContextedMusic,
	Divide,
	Tempo,
	PostEvent,
	Fingering,
	Markup,
	Lyric,
	Primitive,
};


const termProtoMap: Map<object, string> = Object.entries(termDictionary)
	.reduce((map, [name, cls]: [string, {prototype: object}]) => (map.set(cls.prototype, name), map), new Map());


const parseRawEnforce = data => {
	switch (typeof data) {
	case "string":
	case "number":
		return new Primitive({exp: data});

	default:
		return parseRaw(data);
	}
};


const parseRaw = data => {
	if (data instanceof BaseTerm)
		return data;

	if (!data)
		return data;

	switch (typeof data) {
	case "object":
		if (Array.isArray(data))
			return data.map(item => parseRaw(item));

		const {proto, ...fields} = data;
		if (proto) {
			if (proto === "_PLAIN")
				return fields;

			const termClass = termDictionary[proto];
			if (!termClass)
				throw new Error(`Unexpected term class: ${data.proto}`);

			return new termClass(fields);
		}

		return new Unexpect(data); 
	}

	return data;
};


//const deepCopyTerm = (term: BaseTerm) => parseRaw(JSON.parse(JSON.stringify(term)));


type AttributeValue = number | boolean | string | LilyTerm;

interface AttributeValueHandle {
	value: AttributeValue;
};


export interface LilyDocumentAttribute {
	[key: string]: AttributeValueHandle
};

export interface LilyDocumentAttributeReadOnly {
	[key: string]: AttributeValue
};


const GRACE_COMMANDS = ["grace", "acciaccatura", "appoggiatura", "slashedGrace"];



export default class LilyDocument {
	root: Root;


	constructor (data) {
		//console.log("raw data:", data);
		this.root = parseRaw(data);
	}


	toString () {
		return this.root.join();
		//return this.root.serialize();
	}


	globalAttributes ({readonly = false} = {}): LilyDocumentAttribute | LilyDocumentAttributeReadOnly {
		const globalStaffSize = this.root.getField("set-global-staff-size");
		const header = this.root.getBlock("header");
		let paper = this.root.getBlock("paper");
		const layoutStaffSize = paper && paper.getField("layout-set-staff-size");
		let staffSize = globalStaffSize || layoutStaffSize;

		if (!readonly) {
			if (!staffSize) {
				this.root.sections.push(new Scheme({exp: {proto: "SchemeFunction", func: "set-global-staff-size", args: [LILY_STAFF_SIZE_DEFAULT]}}));
				staffSize = this.root.getField("set-global-staff-size");
			}

			// A4 paper size
			const DEFAULT_PAPER_WIDTH = {
				proto: "Assignment",
				key: "paper-width",
				value: {proto: "NumberUnit", number: 21, unit: "\\cm"},
			};
			const DEFAULT_PAPER_HEIGHT = {
				proto: "Assignment",
				key: "paper-height",
				value: {proto: "NumberUnit", number: 29.71, unit: "\\cm"},
			};

			if (!paper) {
				paper = new Block({
					block: "score",
					head: "\\paper",
					body: [DEFAULT_PAPER_WIDTH, DEFAULT_PAPER_HEIGHT],
				});
				this.root.sections.push(paper);
			}

			if (!paper.getField("paper-width")) 
				paper.body.push(parseRaw(DEFAULT_PAPER_WIDTH));

			if (!paper.getField("paper-height")) 
				paper.body.push(parseRaw(DEFAULT_PAPER_HEIGHT));
		}
		else
			staffSize = staffSize || {value: LILY_STAFF_SIZE_DEFAULT};

		const paperPropertyCommon = key => ({
			get value () {
				if (!paper)
					return undefined;

				const item = paper.getField(key);
				if (!item)
					return undefined;

				return item.value;
			},

			set value (value) {
				console.assert(!!paper, "paper is null.");

				const item = paper.getField(key);
				if (item)
					item.value = parseRaw(value);
				else
					paper.body.push(new Assignment({key, value}));
			},
		});

		const paperPropertySchemeToken = key => ({
			get value () {
				if (!paper)
					return undefined;

				const item = paper.getField(key);
				if (!item)
					return undefined;

				return item.value.exp;
			},

			set value (value) {
				console.assert(!!paper, "paper is null.");

				const item = paper.getField(key);
				if (item)
					item.value.exp = value;
				else
					paper.body.push(new Assignment({key, value: {proto: "Scheme", exp: value}}));
			},
		});

		let midiBlock = null;
		const scores = this.root.sections.filter(section => section instanceof Block && section.head === "\\score") as Block[];
		for (const score of scores) {
			midiBlock = score.body.find(term => term instanceof Block && term.head === "\\midi");
			if (midiBlock)
				break;
		}

		const midiTempo = {
			get value (): Tempo {
				return midiBlock && midiBlock.body.find(term => term instanceof Tempo);
			},

			set value (value: Tempo) {
				if (!midiBlock) {
					const score = this.root.getBlock("score");
					if (score) {
						midiBlock = new Block({block: "score", head: "\\midi", body: []});
						score.body.push(midiBlock);
					}
					else
						console.warn("no score block, midiTempo assign failed.");
				}

				if (midiBlock) {
					midiBlock.body = midiBlock.body.filter(term => !(term instanceof Tempo));
					midiBlock.body.push(value);
				}
			},
		};

		const attributes = {
			staffSize,
			midiTempo,
			title: header && header.getField("title"),
			composer: header && header.getField("composer"),
			paperWidth: paperPropertyCommon("paper-width"),
			paperHeight: paperPropertyCommon("paper-height"),
			topMargin: paperPropertyCommon("top-margin"),
			bottomMargin: paperPropertyCommon("bottom-margin"),
			leftMargin: paperPropertyCommon("left-margin"),
			rightMargin: paperPropertyCommon("right-margin"),
			systemSpacing: paperPropertySchemeToken("system-system-spacing.basic-distance"),
			topMarkupSpacing: paperPropertySchemeToken("top-markup-spacing.basic-distance"),
			raggedLast: paperPropertySchemeToken("ragged-last"),
		};

		if (readonly)
			Object.keys(attributes).forEach(key => attributes[key] = attributes[key] && attributes[key].value);

		return attributes;
	}


	getVariables (): Set<string> {
		const result: Set<string> = new Set();

		this.root.forEachTerm(Variable, variable => {
			result.add(variable.name);
		});

		return result;
	}


	updateChordChains () {
		this.root.forEachTopTerm(MusicBlock, block => block.updateChordChains());
	}


	getMusicTracks (): MusicBlock[] {
		const score = this.root.getBlock("score");
		if (!score)
			return null;

		const tracks = [];

		// extract sequential music blocks from score block
		score.forEachTopTerm(MusicBlock, block => {
			tracks.push(block.clone());
		});

		// expand variables in tracks
		tracks.forEach(track => track.expandVariables(this.root));

		return tracks;
	}


	removeStaffGroup () {
		const score = this.root.getBlock("score");
		if (score) {
			score.body.forEach(item => {
				if (item instanceof SimultaneousList)
					item.removeStaffGroup();
			});
		}
	}


	fixTinyTrillSpans () {
		// TODO: replace successive \startTrillSpan & \stopTrillSpan with ^\trill
	}


	removeMusicCommands (cmds: string | string[]) {
		cmds = Array.isArray(cmds) ? cmds : [cmds];

		const isToRemoved = item => (item instanceof Command) && cmds.includes(item.cmd);

		this.root.forEachTerm(MusicBlock, block => {
			block.body = block.body.filter(item => !isToRemoved(item));
		});
	}


	removeTrillSpans () {
		this.removeMusicCommands(["startTrillSpan", "stopTrillSpan"]);
	}


	removeBreaks () {
		this.removeMusicCommands("break");
	}


	removePageBreaks () {
		this.removeMusicCommands("pageBreak");
	}


	scoreBreakBefore (enabled = true) {
		const score = this.root.getBlock("score");
		if (score) {
			let header = score.entries.find((entry: any) => entry.head === "\\header") as Block;
			if (!header) {
				header = new Block({head: "\\header", body: []});
				score.body.push(header);
			}

			let breakbefore = header.getField("breakbefore");
			if (breakbefore) 
				breakbefore = breakbefore.value;
			
			else {
				breakbefore = new Scheme({exp: true});
				header.body.push(new Assignment({key: "breakbefore", value: breakbefore}));
			}

			breakbefore.exp = enabled;
		}
		else
			console.warn("no score block");
	}


	unfoldRepeats () {
		const score = this.root.getBlock("score");
		const musicList = score ? score.body : this.root.sections;

		let count = 0;

		musicList.forEach((term, i) => {
			if (term.isMusic && (term as Command).cmd !== "unfoldRepeats") {
				const unfold = new Command({cmd: "unfoldRepeats", args: [term]});
				musicList.splice(i, 1, unfold);

				++count;
			}
		});

		if (!count)
			console.warn("no music term to unfold");

		return count;
	}


	containsRepeat (): boolean {
		const termContainsRepeat = (term: BaseTerm): boolean => {
			if (!term.entries)
				return false;

			const subTerms = term.entries.filter(term => term instanceof BaseTerm);

			for (const term of subTerms) {
				if ((term as Command).cmd === "repeat")
					return true;
			}

			for (const term of subTerms) {
				if (termContainsRepeat(term))
					return true;
			}

			return false;
		};

		return termContainsRepeat(this.root);
	}


	removeEmptySubMusicBlocks () {
		this.root.forEachTerm(MusicBlock, block => {
			block.body = block.body.filter(term => !(term instanceof MusicBlock && term.body.length === 0));
		});
	}


	mergeContinuousGraces () {
		this.removeEmptySubMusicBlocks();

		const isGraceCommand = term => term instanceof Command && term.isGrace;
		const isGraceInnerTerm = term => isGraceCommand(term) || term instanceof Divide || term instanceof PostEvent;

		this.root.forEachTerm(MusicBlock, block => {
			const groups = [];
			let currentGroup = null;

			block.body.forEach((term, i) => {
				if (currentGroup) {
					if (isGraceInnerTerm(term)) {
						currentGroup.count++;

						if (currentGroup.count === 2)
							groups.push(currentGroup);
					}
					else
						currentGroup = null;
				}
				else {
					if (isGraceCommand(term))
						currentGroup = {start: i, count: 1};
				}
			});

			let offset = 0;
			groups.forEach(group => {
				const startIndex = group.start + offset;
				const mainBody = new MusicBlock({body: []});

				for (let i = startIndex; i < startIndex + group.count; ++ i) {
					const term = block.body[i];
					const music = isGraceCommand(term) ? term.args[0] : term;
					if (music instanceof MusicBlock)
						mainBody.body.push(...music.body);
					else
						mainBody.body.push(music);
				}

				block.body[startIndex].args[0] = mainBody;
				block.body.splice(startIndex + 1, group.count - 1);

				offset -= group.count - 1;
			});
		});
	}


	fixInvalidKeys (mode = "major") {
		this.root.forEachTerm(Command, cmd => {
			if (cmd.cmd === "key") {
				if (cmd.args[1] === "\\none")
					cmd.args[1] = "\\" + mode;
			}
		});
	}


	fixInvalidBriefChords () {
		this.root.forEachTerm(BriefChord, chord => {
			const items = chord.body.items;
			if (items) {
				// merge multiple ^ items
				while (items.filter(item => item === "^").length > 1) {
					const index = items.lastIndexOf("^");
					items.splice(index, 1, ".");
				}
			}
		});
	}


	fixInvalidMarkupWords () {
		this.root.forEachTerm(MarkupCommand, cmd => {
			//console.log("markup:", cmd);
			cmd.forEachTerm(InlineBlock, block => {
				// replace scheme expression by literal string
				block.body = block.body.map(term => {
					if (term instanceof Scheme)
						return LiteralString.fromString(term.join().replace(/\s+$/, ""));

					if (typeof term === "string" && term.includes("$"))
						return LiteralString.fromString(term);

					return term;
				});
			});
		});
	}


	fixNestedRepeat () {
		// \repeat { \repeat { P1 } \alternative { {P2} } } \alternative { {P3} }
		// ->
		// \repeat { P1 } \alternative { {P2} {P3} }
		this.root.forEachTerm(Command, cmd => {
			if (cmd.isRepeatWithAlternative) {
				const block = cmd.args[2];
				const alternative = cmd.args[3].args[0];
				const lastMusic = block.body[block.body.length - 1];
				if (lastMusic && lastMusic.isRepeatWithAlternative) {
					block.body.splice(block.body.length - 1, 1, ...lastMusic.args[2].body);
					alternative.body = [...lastMusic.args[3].args[0].body, ...alternative.body];
				}
			}
		});
	}


	fixEmptyContextedStaff () {
		// staff.1 << >>				staff.2 << voice.1 {} voice.2 {} >>
		// ->
		// staff.1 << voice.1 {} >>		staff.2 << voice.2 {} >>
		const subMusics = (simul: SimultaneousList) => simul.list.filter(term => term instanceof ContextedMusic);

		const score = this.root.getBlock("score");
		score.forEachTerm(SimultaneousList, simul => {
			const staves = simul.list.filter(term => term instanceof ContextedMusic && term.body instanceof SimultaneousList);
			if (staves.length > 1) {
				const staff1 = staves[0].body;
				const staff2 = staves[1].body;

				if (subMusics(staff1).length === 0 && subMusics(staff2).length > 1) {
					const index = staff2.list.findIndex(term => term instanceof ContextedMusic);
					const [music] = staff2.list.splice(index, 1);
					staff1.list.push(music);
				}
			}
		});
	}


	removeEmptyContextedStaff () {
		const subMusics = (simul: SimultaneousList) => simul.list.filter(term => term instanceof ContextedMusic);

		const score = this.root.getBlock("score");
		score.forEachTerm(SimultaneousList, simul => {
			simul.list = simul.list.filter(term => !(term instanceof ContextedMusic) || !(term.body instanceof SimultaneousList)
				|| subMusics(term.body).length > 0);
		});
	}


	redivide () {
		this.root.forEachTerm(MusicBlock, (block: MusicBlock) => {
			const isPostTerm = term => term instanceof PostEvent
				//|| (term as Primitive).exp === "]"
				|| (term as Primitive).exp === "~"
				//|| (term as Primitive).exp === ")"
				|| (term as Command).cmd === "bar"
				|| (term as Command).cmd === "arpeggio"
				|| (term as Command).cmd === "glissando"
				;

			const list = block.body.filter(term => !(term instanceof Divide));
			let measure = null;
			for (const term of list) {
				if (Number.isInteger(measure) && isPostTerm(term))
					term._measure = measure;
				else
					measure = term._measure;
			}

			const body: BaseTerm[] = [];
			const measures = new Set();

			list.reverse().forEach(term => {
				if (term instanceof BaseTerm) {
					const newMeasures = term.measures.filter(m => !measures.has(m));
					if (newMeasures.length) {
						if (body.length)
							body.push(new Divide({}));

						newMeasures.forEach(m => measures.add(m));
					}
				}

				body.push(term);
			});

			block.body = body.reverse();
		});
	}


	excludeChordTracksFromMIDI () {
		// if there is chord mode music in score, duplicate score block as a dedicated MIDI score which excludes chord mode music.
		let contains = false;

		const isChordMusic = term => term instanceof ContextedMusic
			&& term.head instanceof Command && term.head.args[0] === "ChordNames";

		const isBlock = (head, term) => term instanceof Block && term.head === head;

		const score = this.root.getBlock("score");
		const newScore = score.clone() as Block;
		newScore.forEachTerm(SimultaneousList, simul => {
			const trimmedList = simul.list.filter(term => !isChordMusic(term));
			if (trimmedList.length < simul.list.length) {
				simul.list = trimmedList;
				contains = true;
			}
		});

		if (contains) {
			const trimmedBody = score.body.filter(term => !isBlock("\\midi", term));
			if (trimmedBody.length < score.body.length) {
				score.body = trimmedBody;

				newScore.body = newScore.body.filter(term => !isBlock("\\layout", term));
				this.root.sections.push(newScore);
			}
		}
	}


	// generate tied notehead location candidates
	getTiedNoteLocations (source: TextSource): [number, number][] {
		const chordPairs: [Chord, Chord][] = [];

		const hasMusicBlock = term => {
			if (term instanceof MusicBlock)
				return true;

			if (term instanceof Command)
				return term.args.filter(arg => arg instanceof MusicBlock).length > 0;

			return false;
		};

		this.root.forEachTerm(MusicBlock, (block: MusicBlock) => {
			for (const voice of block.voices) {
				let lastChord: Chord = null;
				let tieing = false;
				let afterBlock = false;
				let atHead = true;

				for (const chunk of voice.body) {
					for (const term of chunk.terms) {
						if (term instanceof Primitive && term.exp === "~") {
							tieing = true;
							afterBlock = false;
						}
						else if (hasMusicBlock(term)) {
							afterBlock = true;
							tieing = false;
							//console.log("afterBlock:", term);
						}
						else if (term instanceof Chord) {
							if (tieing && lastChord) 
								chordPairs.push([lastChord, term]);
							// maybe there is a tie at tail of the last block
							else if (afterBlock)
								chordPairs.push([null, term]);
							// maybe there is a tie before the current block
							else if (atHead)
								chordPairs.push([null, term]);

							// PENDING: maybe some user-defined command block contains tie at tail.

							atHead = false;
							afterBlock = false;
							tieing = false;
							lastChord = term;

							if (term.post_events) {
								for (const event of term.post_events) {
									if (event.arg === "~")
										tieing = true;
								}
							}
						}
					}
				}
			}
		});

		//console.log("chordPairs:", chordPairs);

		const locations = [];

		chordPairs.forEach(pair => {
			const forePitches = pair[0] && new Set(pair[0].pitchNames);

			const chordSource = source.slice(pair[1]._location.lines, pair[1]._location.columns);
			const pitchColumns = TextSource.matchPositions(/\w+/g, chordSource);

			pair[1].pitchNames
				.map((pitch, index) => ({pitch, index}))
				.filter(({pitch}) => !forePitches || forePitches.has(pitch) || pitch === "q")
				.forEach(({index}) => locations.push([
					pair[1]._location.lines[0],	// line
					pair[1]._location.columns[0] + pitchColumns[index],	// column
				]));
		});

		return locations;
	}


	/*removeAloneSpacer () {
		this.root.forEachTopTerm(MusicBlock, block => {
			const aloneSpacers = cc(block.musicChunks.filter(chunk => chunk.size === 1 && chunk.terms[0].isSpacer).map(chunk => chunk.terms));
			//console.log("aloneSpacers:", aloneSpacers.map(s => s._location));

			if (aloneSpacers.length) {
				const removeInBlock = block => block.body = block.body.filter(term => !aloneSpacers.includes(term));

				removeInBlock(block);
				block.forEachTerm(MusicBlock, removeInBlock);
			}
		});
	}*/


	unfoldDurationMultipliers () {
		const unfoldChord = (term): BaseTerm[] => {
			if (!(term instanceof Chord) || !term.duration || !term.duration.multipliers.length)
				return [term];

			const factor = term.duration.multipliers.reduce((factor, multiplier) => factor * Number(multiplier), 1);
			if (!Number.isInteger(factor) || factor <= 0)
				return [term];

			const chord = term.clone() as Chord;
			chord.duration.multipliers = [];

			return Array(factor).fill(chord.clone());
		};

		this.root.forEachTerm(MusicBlock, block => {
			block.body = cc(block.body.map(unfoldChord));
		});
	}
};
