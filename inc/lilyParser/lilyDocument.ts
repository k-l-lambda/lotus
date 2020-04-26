
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
		const words = this.serialize().filter(word => word !== null);
		let indent = 0;
		const result = [];

		for (const word of words) {
			if (word === "\b") {
				// remove the last space
				result.pop();
				continue;
			}

			if (/^(\}\n|>>)/.test(word))
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


	get entries (): LilyTerm[] {
		return null;
	}


	getField (key) {
		console.assert(this.entries, "[BaseTerm.getField] term's entries is null:", this);

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
	sections: LilyTerm[];


	serialize () {
		return [].concat(...this.sections.map(section => [...section.serialize(), "\n\n"]));
	}


	get entries (): LilyTerm[] {
		return this.sections;
	}


	getBlock (head) {
		return this.entries.find((entry: any) => entry.head === head || entry.head === "\\" + head);
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
	body: LilyTerm[];


	serialize () {
		const heads = Array.isArray(this.head) ? this.head : (this.head ? [this.head] : []);

		return [
			...heads,
			"{\n",
			...[].concat(...this.body.map(section => [...BaseTerm.optionalSerialize(section), "\n"])),
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
			...[].concat(...this.body.map(BaseTerm.optionalSerialize)),
			"}",
		];
	}
};


class MusicBlock extends BaseTerm {
	body: LilyTerm[];


	serialize () {
		return [
			"{\n",
			...[].concat(...this.body.map(BaseTerm.optionalSerialize)),
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
			...[].concat(...this.list.map(item => [...BaseTerm.optionalSerialize(item), "\n"])),
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
			return ["##", "\b", this.exp ? "t" : "f"];
		else
			return ["#", "\b", this.exp];
	}


	query (key: string): any {
		if (this.exp instanceof SchemeExpression)
			return this.exp.query(key);
	}
};


class SchemeExpression extends BaseTerm {
	func: (string | SchemeExpression);
	args: (string | SchemeExpression)[];


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
			//return {value: this.args.length === 1 ? this.args[0] : this.args};
			const term = this;

			return {
				get value () {
					return term.args.length === 1 ? term.args[0] : term.args;
				},

				set value (value) {
					if (term.args.length === 1)
						term.args[0] = value as string|SchemeExpression;
					else
						term.args = value as (string|SchemeExpression)[];
				},
			};
		}
	}
};


class Assignment extends BaseTerm {
	key: (string|any[]);
	value: object;


	serialize () {
		const keys = (Array.isArray(this.key) ? this.key : [this.key]).map(BaseTerm.optionalSerialize);

		return [
			...cc(keys),
			"=",
			...BaseTerm.optionalSerialize(this.value),
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
		const pitches = this.single ? this.pitches : [
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
	SchemeExpression,
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
	root: LilyTerm;


	constructor (data) {
		console.log("raw data:", data);
		this.root = parseRaw(data);
	}


	toString () {
		return this.root.join();
		//return this.root.serialize();
	}
};
