
import _ from "lodash";

import {WHOLE_DURATION_MAGNITUDE, FractionNumber, lcmMulti} from "./utils";



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


const PHONETS = "cdefgab";
const PHONETS_ALIAS = {
	h: "b",
};

const phonetDifferToShift = differ => differ > 3 ? -1 : (differ < -3 ? 1 : 0);


export const getDurationSubdivider = (term: BaseTerm): number => {
	if (term instanceof MusicEvent)
		return term.duration.subdivider;
	else if (term instanceof MusicBlock)
		return lcmMulti(...term.body.map(getDurationSubdivider));
	else if (term instanceof MusicChunk)
		return lcmMulti(...term.terms.map(getDurationSubdivider));
	else if ((term instanceof Times) || (term instanceof Tuplet)) {
		const divider = term instanceof Tuplet ? term.divider : term.factor.reciprocal;
		divider.numerator *= getDurationSubdivider(term.music);

		return divider.reduced.numerator;
	}
	else if (term instanceof Repeat)
		return getDurationSubdivider(term.bodyBlock);
	else if (term instanceof Relative)
		return getDurationSubdivider(term.music);
	else if (term.isMusic)
		console.warn("unexpected music term:", term);

	return 1;
};


interface DurationContextStatus {
	factor?: {value: number};
};


class DurationContext {
	stack: DurationContextStatus[] = [];
	tick: number = 0;
	measureLength: number = WHOLE_DURATION_MAGNITUDE;
	measureIndex: number = 1;
	measureTick: number = 0;


	get factor () {
		for (let i = this.stack.length - 1; i >= 0; i--) {
			const status = this.stack[i];
			if (status.factor)
				return status.factor;
		}

		return null;
	}


	get factorValue () {
		return this.factor ? this.factor.value : 1;
	}


	elapse (duration: number) {
		const increment = duration * this.factorValue;

		this.tick += increment;

		this.measureTick += increment;
		while (Math.round(this.measureTick) >= Math.round(this.measureLength)) {
			++this.measureIndex;
			this.measureTick -= this.measureLength;
		}
	}


	push (status: DurationContextStatus) {
		this.stack.push(status);
	}

	
	pop () {
		this.stack.pop();
	}
};


class StaffContext {
	clef?: Clef;
	key?: KeySignature;
	time?: TimeSignature;
	octave?: OctaveShift;

	pitch?: ChordElement;


	constructor ({anchorPitch = null} = {}) {
		this.pitch = anchorPitch;
	}


	append (term: BaseTerm) {
		if (term instanceof Clef)
			this.clef = term;
		else if (term instanceof KeySignature)
			this.key = term;
		else if (term instanceof TimeSignature)
			this.time = term;
		else if (term instanceof OctaveShift)
			this.octave = term;
		else if (term instanceof Chord)
			this.pitch = term.absolutePitch;
		else if (term.isMusic) {
			term.forEachTopTerm(MusicBlock, block => {
				for (const subterm of block.body)
					this.append(subterm);
			});
		}
	}


	get declarations (): BaseTerm[] {
		return [this.clef, this.key, this.time, this.octave].filter(term => term);
	}
};


export class BaseTerm {
	_location?: Location;
	_measure?: number;
	_tick?: number;
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


	findFirst (condition: Function): BaseTerm {
		if (!this.entries)
			return null;

		if (BaseTerm.isPrototypeOf(condition)) {
			const termClass = condition;
			condition = term => term instanceof termClass;
		}
	
		for (const entry of this.entries) {
			if (condition(entry))
				return entry;
	
			if (entry instanceof BaseTerm) {
				const result = entry.findFirst(condition);
				if (result)
					return result;
			}
		}
	}


	findLast (condition: any): BaseTerm {
		if (!this.entries)
			return null;

		if (BaseTerm.isPrototypeOf(condition)) {
			const termClass = condition;
			condition = term => term instanceof termClass;
		}
	
		const reversedEntries = [...this.entries];
		reversedEntries.reverse();

		for (const entry of reversedEntries) {
			if (condition(entry))
				return entry;
	
			if (entry instanceof BaseTerm) {
				const result = entry.findLast(condition);
				if (result)
					return result;
			}
		}
	}


	findAll (condition: any): any[] {
		if (!this.entries)
			return [];

		if (BaseTerm.isPrototypeOf(condition)) {
			const termClass = condition;
			condition = term => term instanceof termClass;
		}

		const result = [];

		for (const entry of this.entries) {
			if (condition(entry))
				result.push(entry);
	
			if (entry instanceof BaseTerm)
				result.push(...entry.findAll(condition));
		}

		return result;
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
		const fields = Object.keys(this).filter(key => !/^_/.test(key));
		const data = _.pick(this, fields);

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
		return BaseTerm.isTerm(item) ? (item as BaseTerm).serialize() : (item === undefined ? [] : [item]);
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


	get includeFiles (): string[] {
		return this.sections.filter(section => section instanceof Include).map((include: Include) => include.filename);
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


	/*get isGrace () {
		return GRACE_COMMANDS.includes(this.cmd);
	}*/


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
		// TODO: refine this in Times
		case "times": {
			const factor = eval(this.args[0]);
			return this.args[1].durationMagnitude * factor;
		}

		// TODO: refine this in Tuplet
		case "tuplet": {
			const factor = 1 / eval(this.args[0]);
			return this.args[this.args.length - 1].durationMagnitude * factor;
		}

		case "afterGrace":
			return this.args[0].durationMagnitude;

		default:
			if (this instanceof Grace)
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
	static makeBlock (block: MusicBlock, {anchor}: {anchor?: ChordElement} = {}): Relative {
		if (!anchor) {
			const chord = block.findFirst(Chord) as Chord;
			anchor = chord && chord.anchorPitch;
		}

		return new Relative({cmd: "relative", args: [anchor, block].filter(term => term)});
	}


	get anchor (): ChordElement {
		if (this.args[0] instanceof ChordElement)
			return this.args[0];

		return null;
	}


	get music (): BaseTerm {
		return this.args[this.args.length - 1];
	}


	get headChord (): Chord {
		return this.findFirst(Chord) as Chord;
	}


	get tailPitch (): ChordElement {
		const tail = this.findLast(Chord) as Chord;

		return tail && tail.absolutePitch;
	}


	// with side effect
	shiftBody (newAnchor?: ChordElement): BaseTerm[] {
		const headChord = this.headChord;
		if (newAnchor && headChord)
			headChord.shiftAnchor(newAnchor);

		const music = this.music;
		if (music instanceof MusicBlock)
			return music.body;

		return [music];
	}
}


export class TimeSignature extends Command {
	get value (): FractionNumber {
		return FractionNumber.fromExpression(this.args[0]);
	}
};


export class Partial extends Command {
	get duration (): Duration {
		return this.args[0];
	}
};


export class Times extends Command {
	get factor (): FractionNumber {
		return FractionNumber.fromExpression(this.args[0]);
	}


	get music (): BaseTerm {
		return this.args[this.args.length - 1];
	}
};


export class Tuplet extends Command {
	get divider (): FractionNumber {
		return FractionNumber.fromExpression(this.args[0]);
	}


	get music (): BaseTerm {
		return this.args[this.args.length - 1];
	}
};


export class Grace extends Command {
	get music (): BaseTerm {
		return this.args[this.args.length - 1];
	}
};


export class Clef extends Command {
};


export class KeySignature extends Command {
};


export class OctaveShift extends Command {
};


export class Include extends Command {
	get filename (): string {
		return this.args[0].toString();
	}
};


export class Version extends Command {
	get version (): string {
		return this.args[0].toString();
	}
};


export class LyricMode extends Command {
	get block (): MusicBlock {
		return this.args[0];
	}
};


export class ChordMode extends Command {
	get block (): MusicBlock {
		return this.args[0];
	}
};


export class Block extends BaseTerm {
	block: string;
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


	clone (): this {
		if (this._parent) {
			const parent = this._parent.clone();
			const block = parent.findFirst(MusicBlock);
			console.assert(block && block._parent === parent, "invalid block-parent relation", parent, block);

			return block as this;
		}

		return BaseTerm.prototype.clone.call(this) as this;
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


	get ticks (): number[] {
		const ticks = this.body.filter(term => Number.isFinite(term._tick)).map(term => term._tick);

		this.forEachTopTerm(MusicBlock, block => ticks.push(...block.ticks));

		return Array.from(new Set(ticks)).sort((t1, t2) => t1 - t2);
	}


	updateChordAnchors () {
		const chord = this.findFirst(Chord) as Chord;
		if (chord)
			chord._anchorPitch = chord._anchorPitch || this.anchorPitch;
	}


	updateChordChains () {
		let previous: MusicEvent = null;

		this.updateChordAnchors();

		this.forEachTerm(MusicBlock, block => block.updateChordAnchors());

		this.forEachTerm(MusicEvent, event => {
			event._previous = previous;

			previous = event;
		});
	}


	// with side effect
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


	// with side effect
	spreadRelativeBlocks (): this {
		this.forEachTerm(MusicBlock, block => block.spreadRelativeBlocks());

		let anchorPitch = null;

		this.body = cc(this.body.map(term => {
			if (term instanceof Relative) {
				const list = term.shiftBody(anchorPitch);

				anchorPitch = term.tailPitch || anchorPitch;

				return list;
			}
			else
				return [term];
		}));

		return this;
	}


	// with side effect
	unfoldDurationMultipliers (): this {
		let timeDenominator = 4;

		const unfoldMultipliers = (term): BaseTerm[] => {
			if (term instanceof TimeSignature)
				timeDenominator = term.value.denominator;

			if (!(term instanceof MusicEvent) || !term.duration || !term.duration.multipliers || !term.duration.multipliers.length)
				return [term];

			const factor = term.duration.multipliers.reduce((factor, multiplier) => factor * Number(multiplier), 1);
			if (!Number.isInteger(factor) || factor <= 0)
				return [term];

			const denominator = Math.max(term.duration.denominator, timeDenominator);

			const event = term.clone() as MusicEvent;
			event.duration.multipliers = [];

			// break duration into multiple rest events
			const restCount = (event.duration.magnitude / WHOLE_DURATION_MAGNITUDE) * (factor - 1) * denominator;
			if (!Number.isInteger(restCount))
				console.warn("Rest count is not integear:", restCount, denominator, event.duration.magnitude, factor);

			const rests = Array(Math.floor(restCount)).fill(null).map(() => 
				new Rest({name: "s", duration: new Duration({number: denominator, dots: 0})}));

			return [event, ...rests];
		};

		this.body = cc(this.body.map(unfoldMultipliers));

		return this;
	}


	// pure
	flatten ({spreadRepeats = false} = {}): Relative {
		this.updateChordChains();

		const chord = this.findFirst(Chord) as Chord;
		const anchor = this.anchorPitch || (chord && chord.anchorPitch);

		const block = this.clone();
		if (spreadRepeats)
			block.spreadRepeatBlocks();
		block.spreadRelativeBlocks();
		block.unfoldDurationMultipliers();

		return Relative.makeBlock(block, {anchor: anchor && anchor.clone()});
	}


	// with side effect
	expandVariables (dict: BaseTerm): this {
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

		return this;
	}


	// allocate measure number according to duration
	allocateMeasures (context: DurationContext = new DurationContext()) {
		this.unfoldDurationMultipliers();

		const elpaseMusic = (music: BaseTerm) => {
			if (music instanceof MusicEvent) {
				music._measure = context.measureIndex;
				music._tick = context.tick;
				context.elapse(music.durationMagnitude);
			}
			else if (music instanceof MusicBlock)
				music.allocateMeasures(context);
			else
				console.warn("unexpected music term:", music);
		};

		for (const term of this.body) {
			if (!term)
				console.warn("null term:", term, this);
			else if (term instanceof MusicEvent)
				elpaseMusic(term);
			else if (term instanceof MusicBlock)
				term.allocateMeasures(context);
			else if (term instanceof TimeSignature) {
				term._measure = context.measureIndex;
				context.measureLength = term.value.value * WHOLE_DURATION_MAGNITUDE;
			}
			else if (term instanceof Repeat) {
				term.bodyBlock.allocateMeasures(context);

				if (term.alternativeBlocks) {
					for (const block of term.alternativeBlocks)
						block.allocateMeasures(context);
				}
			}
			else if (term instanceof Relative) 
				elpaseMusic(term.music);
			
			else if (term instanceof Times) {
				term._measure = context.measureIndex;
				term._tick = context.tick;

				context.push({factor: term.factor});
				elpaseMusic(term.music);
				context.pop();
			}
			else if (term instanceof Tuplet) {
				term._measure = context.measureIndex;
				term._tick = context.tick;

				context.push({factor: term.divider.reciprocal});
				elpaseMusic(term.music);
				context.pop();
			}
			else if (term instanceof Grace) {
				term._measure = context.measureIndex;
				term._tick = context.tick;

				context.push({factor: {value: 0}});
				elpaseMusic(term.music);
				context.pop();
			}
			else {
				if (term.isMusic)
					console.warn("unexpected music term:", term);

				term._measure = context.measureIndex;
				term._tick = context.tick;
			}
		}
	}


	// with side effects
	redivide ({recursive = true} = {}) {
		if (recursive)
			this.forEachTerm(MusicBlock, block => block.redivide());

		const isPostTerm = term => !term
			|| term instanceof PostEvent
			|| (term as Primitive).exp === "~"
			|| (term as Command).cmd === "bar"
			|| (term as Command).cmd === "arpeggio"
			|| (term as Command).cmd === "glissando"
			;

		const list = this.body.filter(term => !(term instanceof Divide));
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

		this.body = body.reverse();
	}


	// pure
	sliceMeasures (start: number, count: number): Relative {
		const flatten = this.flatten({spreadRepeats: true});
		const block = flatten.music as MusicBlock;
		block.updateChordChains();
		block.allocateMeasures();

		const context = new StaffContext({anchorPitch: block.anchorPitch});
		for (const term of block.body) {
			if (Number.isInteger(term._measure)) {
				if (term._measure < start)
					context.append(term);
				else
					break;
			}
		}

		const terms = context.declarations.concat(block.body.filter(term => term._measure >= start && term._measure < start + count));
		const anchor = context.pitch;

		const newBlock = new MusicBlock({body: terms.map(term => term.clone())});

		return new Relative({cmd: "relative", args: [anchor, newBlock].filter(term => term)});
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
	head: Command;
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


	get type (): string {
		return this.head.args[0];
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
	exp: (boolean|BaseTerm);


	serialize () {
		if (BaseTerm.isTerm(this.exp))
			return ["#", "\b", ...(this.exp as BaseTerm).serialize()];
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
	value: any;


	constructor (data) {
		super(data);

		if (this.value instanceof BaseTerm)
			this.value._parent = this;
	}


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


	constructor (data) {
		super(data);

		this.pitches[0]._parent = this;
		for (let i = 1; i < this.pitches.length; ++i)
			this.pitches[i]._previous = this.pitches[i - 1];
	}


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


	get pitchNames () {
		return this.pitches.map(elem => elem.pitch.replace(/'|,/g, ""));
	}


	get basePitch () {
		return this.pitches[0];
	}


	get absolutePitch (): ChordElement {
		/*const base = this.basePitch;
		if (base.phonet === "q")
			return this.anchorPitch;

		const octave = base.absoluteOctave(this.anchorPitch);

		return ChordElement.from({phonet: base.phonet, alters: base.alters, octave});*/
		return this.basePitch.absolutePitch;
	}


	get anchorPitch (): ChordElement {
		if (this._anchorPitch)
			return this._anchorPitch;

		const previous = this.getPreviousT(Chord);
		if (previous)
			return previous.absolutePitch;

		return this.basePitch;
	}


	shiftAnchor (newAnchor: ChordElement) {
		const shift = phonetDifferToShift(this.basePitch.phonetStep - newAnchor.phonetStep);
		const relativeOctave = this.basePitch.absoluteOctave(this.anchorPitch) - newAnchor.octave - shift;

		this.pitches[0] = ChordElement.from({phonet: this.basePitch.phonet, alters: this.basePitch.alters, octave: relativeOctave});
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

	_parent?: Chord;
	_previous?: ChordElement;
	_tied?: boolean;


	static from ({phonet, alters, octave, options = {}}): ChordElement {
		const octaveString = octave ? Array(Math.abs(octave)).fill(octave > 0 ? "'" : ",").join("") : "";
		const pitch = phonet + (alters || "") + octaveString;

		return new ChordElement({pitch, options: {...options, proto: "_PLAIN"}});
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


	get alteredPhonet (): string {
		const captures = this.pitch.match(/^\w+/);
		return captures && captures[0];
	}


	get anchorPitch (): ChordElement {
		if (this._previous)
			return this._previous.absolutePitch;

		if (this._parent)
			return this._parent.anchorPitch;

		return this;
	}


	get absolutePitch (): ChordElement {
		if (this.phonet === "q")
			return this.anchorPitch;

		const octave = this.absoluteOctave(this.anchorPitch);

		return ChordElement.from({phonet: this.phonet, alters: this.alters, octave});
	}


	absoluteOctave (anchor: ChordElement): number {
		if (this.phonet === "q")
			return anchor.octave;

		const phonetDiffer = this.phonetStep - anchor.phonetStep;
		const shift = phonetDifferToShift(phonetDiffer);

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


	// how many smallest rhythm unit in a whole note
	get subdivider (): number {
		return this.denominator * (2 ** this.dots);
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
	arg: string | BaseTerm;


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
	body: (string|BaseTerm);


	serialize () {
		return [
			...cc(this.head.map(BaseTerm.optionalSerialize)),
			...BaseTerm.optionalSerialize(this.body),
		];
	}
};


export class Lyric extends MusicEvent {
	content: string | LiteralString;


	serialize () {
		return [
			...BaseTerm.optionalSerialize(this.content),
			...BaseTerm.optionalSerialize(this.duration),
			...cc((this.post_events || []).map(BaseTerm.optionalSerialize)),
		];
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
	TimeSignature,
	Partial,
	Times,
	Tuplet,
	Grace,
	Clef,
	KeySignature,
	OctaveShift,
	Include,
	Version,
	LyricMode,
	ChordMode,
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


export const parseRaw = data => {
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
