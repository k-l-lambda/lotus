
interface LilyTerm {
	serialize () : string[];
	join () : string;

	query (key: string): any;
};


// concat array of array
const cc = arrays => [].concat(...arrays);


class BaseTerm implements LilyTerm {
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

		for (const word of words) {
			if (word === "\b") {
				// remove the last space
				result.pop();
				continue;
			}

			if (/^(\}|>>)/.test(word))
				result.pop(); // remove the last tab

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


	getBlock (head): BaseTerm {
		return this.entries.find((entry: any) => entry.head === head || (entry.head === "\\" + head));
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
	body: LilyTerm[];


	serialize () {
		return [
			"{\n",
			...cc(this.body.map(BaseTerm.optionalSerialize)),
			"\n",
			"}\n",
		];
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
	options: any;


	constructor (data: object) {
		super(data);

		if (this.options.post_events)
			this.options.post_events = this.options.post_events.map(parseRaw);
	}


	get single () {
		return this.pitches.length === 1;
	}


	serialize () {
		const pitches = (this.single && !this.options.withAngle) ? this.pitches : [
			"<", "\b", ...this.pitches, "\b", ">",
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
};


class NumberUnit extends BaseTerm {
	number: number;
	unit: string;


	serialize () {
		return [this.number, "\b", this.unit];
	}


	set (number, unit) {
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


class Unexpect extends BaseTerm {
	constructor (data) {
		super(data);

		console.warn("unexpected term", data);
	}
};


const termDictionary = {
	Root,
	Command,
	Block,
	InlineBlock,
	Scheme,
	SchemeFunction,
	SchemePair,
	SchemePointer,
	Assignment,
	Chord,
	NumberUnit,
	MusicBlock,
	SimultaneousList,
	ContextedMusic,
	Divide,
	Tempo,
	PostEvent,
	Fingering,
	Markup,
};


const parseRaw = data => {
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


	globalAttributes ({readonly = false} = {}) {
		const globalStaffSize = this.root.getField("set-global-staff-size");
		let paper: any = this.root.getBlock("paper");
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
				const item = paper.getField(key);
				if (!item)
					return null;

				return item.value;
			},

			set value (value) {
				const item = paper.getField(key);
				if (item)
					item.value = value;
				else
					paper.body.push(new Assignment({key, value: parseRaw(value)}));
			},
		});

		const paperPropertySchemeToken = key => ({
			get value () {
				const item = paper.getField(key);
				if (!item)
					return null;

				return item.value.exp;
			},

			set value (value) {
				const item = paper.getField(key);
				if (item)
					item.value.exp = value;
				else
					paper.body.push(new Assignment({key, value: {proto: "Scheme", exp: value}}));
			},
		});

		const attributes = {
			staffSize,
			paperWidth: paperPropertyCommon("paper-width"),
			paperHeight: paperPropertyCommon("paper-height"),
			topMargin: paperPropertyCommon("top-margin"),
			bottomMargin: paperPropertyCommon("bottom-margin"),
			leftMargin: paperPropertyCommon("left-margin"),
			rightMargin: paperPropertyCommon("right-margin"),
			systemSpacing: paperPropertySchemeToken("system-system-spacing.basic-distance"),
			raggedLast: paperPropertySchemeToken("ragged-last"),
		};

		if (readonly)
			Object.keys(attributes).forEach(key => attributes[key] = attributes[key] && attributes[key].value);

		return attributes;
	}
};
