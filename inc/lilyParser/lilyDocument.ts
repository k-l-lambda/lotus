
interface LilyTerm {
	isMusic?: boolean;

	serialize () : string[];
	join () : string;

	query (key: string): any;
};


// concat array of array
const cc = arrays => [].concat(...arrays);


class BaseTerm implements LilyTerm {
	isMusic?: boolean;

	constructor (data: object) {
		//Object.assign(this, data);
		for (const key in data) 
			this[key] = parseRaw(data[key]);
	}


	serialize () {
		console.warn("unimplemented serilization:", this);
		return [];
	}


	join () {
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


	get entries (): BaseTerm[] {
		return null;
	}


	getField (key) {
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


	static isTerm (x) {
		return typeof x === "object" && x instanceof BaseTerm;
	}


	static optionalSerialize (item : any) {
		return BaseTerm.isTerm(item) ? (item as LilyTerm).serialize() : (item === undefined ? [] : [item]);
	}
}


class Root extends BaseTerm {
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


class LiteralString extends BaseTerm {
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


class Command extends BaseTerm {
	cmd: string;
	args: any[];


	serialize () {
		return [
			"\\" + this.cmd,
			...[].concat(...this.args.map(BaseTerm.optionalSerialize)),
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
};


class MarkupCommand extends Command {
	toString () {
		const strs = [];
		this.forEachTerm(LiteralString, term => strs.push(term.toString()));

		return strs.join("\n");
	}
};


class Block extends BaseTerm {
	head: (string|string[]);
	body: BaseTerm[];


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


class InlineBlock extends Block {
	serialize () {
		return [
			"{",
			...cc(this.body.map(BaseTerm.optionalSerialize)),
			"}",
		];
	}
};


class MusicBlock extends BaseTerm {
	body: BaseTerm[];


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
};


class SimultaneousList extends BaseTerm {
	list: LilyTerm[];


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
};


class ContextedMusic extends BaseTerm {
	head: LilyTerm;
	body: LilyTerm;
	lyrics?: LilyTerm;


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
};


class Divide extends BaseTerm {
	serialize () {
		return ["|\n"];
	}
}


class Scheme extends BaseTerm {
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


class SchemeFunction extends BaseTerm {
	func: (string | BaseTerm);
	args: (string | BaseTerm)[];


	serialize () {
		return [
			"(", "\b",
			...BaseTerm.optionalSerialize(this.func),
			...cc(this.args.map(BaseTerm.optionalSerialize)),
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
};


class SchemePair extends BaseTerm {
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


class SchemePointer extends BaseTerm {
	value: any;


	serialize () {
		return [
			"'", "\b", ...BaseTerm.optionalSerialize(this.value),
		];
	}
};


class Assignment extends BaseTerm {
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


class Chord extends BaseTerm {
	pitches: string[];
	duration: string;
	options: {
		exclamations?: string[],
		questions?: string[],
		post_events?: PostEvent[],
		rest?: string,
		withAngle?: boolean,
		location?: string,
	};


	constructor (data: object) {
		super(data);

		if (this.options.post_events)
			this.options.post_events = this.options.post_events.map(parseRaw);
	}


	get single () {
		return this.pitches.length === 1;
	}


	get entries () {
		if (this.options && this.options.post_events)
			return this.options.post_events;

		return null;
	}


	serialize () {
		const pitches = (this.single && !this.options.withAngle) ? this.pitches : [
			"<", "\b", ...cc(this.pitches.map(BaseTerm.optionalSerialize)), "\b", ">",
		];

		const {exclamations, questions, rest, post_events} = this.options;
		const postfix = [].concat(...[...(exclamations || []), ...(questions || []), this.duration, rest]
			.filter(item => item)
			.map(item => ["\b", item]))
			.concat(...(post_events || []).map(BaseTerm.optionalSerialize));

		return [
			...pitches,
			...postfix,
		];
	}


	toJSON () {
		// exclude options.location
		let options = this.options;
		if (options && options.location) {
			const {location, ...rest} = options;
			void location;
			options = rest;
		}

		return {
			pitches: this.pitches,
			duration: this.duration,
			options,
		};
	}


	get isMusic () {
		return true;
	}
};


interface BriefChordBody {
	pitch: string;
	duration: string;
	separator: string;
	items: string[];
};


class BriefChord extends BaseTerm {
	body: BriefChordBody;
	post_events: any[];


	serialize () {
		const {pitch, duration, separator, items} = this.body;

		return [
			[pitch, duration, separator, ...(items || [])].join(""),
			...cc((this.post_events || []).map(BaseTerm.optionalSerialize)),
		];
	}


	get isMusic () {
		return true;
	}
};


class NumberUnit extends BaseTerm {
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


class Tempo extends BaseTerm {
	beatsPerMinute?: number;
	unit?: number;
	text?: string;


	serialize () {
		const assignment = Number.isFinite(this.beatsPerMinute) ? [this.unit, "=", this.beatsPerMinute] : [];

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


class PostEvent extends BaseTerm {
	direction: string;
	arg: LilyTerm;


	serialize () {
		return [DIRECTION_CHAR[this.direction], "\b", ...BaseTerm.optionalSerialize(this.arg)];
	}


	get entries () {
		if (this.arg instanceof BaseTerm)
			return [this.arg];

		return null;
	}
};


class Fingering extends BaseTerm {
	value: number;


	serialize () {
		return [this.value];
	}
};


class Markup extends BaseTerm {
	head: any[];
	body: (string|LilyTerm);


	serialize () {
		return [
			...cc(this.head.map(BaseTerm.optionalSerialize)),
			BaseTerm.optionalSerialize(this.body),
		];
	}
};


class Lyric extends BaseTerm {
	content: string | LiteralString;
	duration?: string;
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
}


class Unexpect extends BaseTerm {
	constructor (data) {
		super(data);

		console.warn("unexpected term", data);
	}
};


const termDictionary = {
	Root,
	LiteralString,
	Command,
	MarkupCommand,
	Block,
	InlineBlock,
	Scheme,
	SchemeFunction,
	SchemePair,
	SchemePointer,
	Assignment,
	Chord,
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
				this.root.sections.push(new Scheme({exp: {proto: "SchemeFunction", func: "set-global-staff-size", args: [24]}}));
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

		const attributes = {
			staffSize,
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

		const isGraceCommand = term => term instanceof Command && GRACE_COMMANDS.includes(term.cmd);
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
				const mainBody = new MusicBlock({proto: "MusicBlock", body: []});

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
};
