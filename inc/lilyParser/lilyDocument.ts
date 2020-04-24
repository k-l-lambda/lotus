
interface LilyTerm {
	serilize () : string[];
	join () : string;
};


class BaseTerm implements LilyTerm {
	constructor (data: object) {
		//Object.assign(this, data);
		for (const key in data) 
			this[key] = parseRaw(data[key]);
	}


	serilize () {
		console.warn("unimplemented serilization:", this);
		return [];
	}


	join () {
		const words = this.serilize();
		let indent = 0;
		const result = [];

		for (const word of words) {
			if (word === "\b") {
				// remove the last space
				result.pop();
				continue;
			}

			if (/^\}/.test(word))
				result.pop(); // remove the last tab

			result.push(word);

			if (/\n$/.test(word)) {
				if (/\{\n$/.test(word))
					++indent;
				else if (/^\}/.test(word)) 
					--indent;

				if (indent)
					result.push(...Array(indent).fill("\t"));
			}
			else
				result.push(" ");
		}

		return result.join("");
	}


	static isTerm (x) {
		return typeof x === "object" && x instanceof BaseTerm;
	}


	static optionalSerialize (item : any) {
		return BaseTerm.isTerm(item) ? (item as LilyTerm).serilize() : [item];
	}
}


class Root extends BaseTerm {
	sections: LilyTerm[];


	serilize () {
		return [].concat(...this.sections.map(section => [...section.serilize(), "\n\n\n"]));
	}
};


class Command extends BaseTerm {
	cmd: string;
	args: any[];


	serilize () {
		return [
			this.cmd,
			...[].concat(...this.args.map(arg => BaseTerm.optionalSerialize(arg))),
		];
	}
};


class Block extends BaseTerm {
	head: string;
	body: LilyTerm[];
	mods?: LilyTerm[];


	serilize () {
		// TODO: handle mods
		return [
			this.head,
			"{\n",
			...[].concat(...this.body.map(section => [...BaseTerm.optionalSerialize(section), "\n"])),
			"}\n",
		];
	}
};


class MusicBlock extends BaseTerm {
	body: LilyTerm[];


	serilize () {
		return [
			"{\n",
			...[].concat(...this.body.map(section => BaseTerm.optionalSerialize(section))),
			"\n",
			"}\n",
		];
	}
};


class Divide extends BaseTerm {
	serilize () {
		return ["|\n"];
	}
}


class Scheme extends BaseTerm {
	exp: SchemeExpression;


	serilize () {
		return ["#" + this.exp.serilize().join(" ")];
	}
};


class SchemeExpression extends BaseTerm {
	func: (string | SchemeExpression);
	args: (string | SchemeExpression)[];


	serilize () {
		return [
			"(",
			...BaseTerm.optionalSerialize(this.func),
			...[].concat(...this.args.map(arg => BaseTerm.optionalSerialize(arg))),
			")",
		];
	}
};


class Assignment extends BaseTerm {
	key: string;
	value: object;


	serilize () {
		return [
			this.key,
			"=",
			...BaseTerm.optionalSerialize(this.value),
		];
	}
};


class Chord extends BaseTerm {
	pitches: string[];
	duration: string;
	options: any;


	get single () {
		return this.pitches.length === 1;
	}


	serilize () {
		const pitches = this.single ? this.pitches : [
			"<", "\b", ...this.pitches, "\b", ">",
		];

		const {exclamations, questions, rest, post_events} = this.options;
		const postfix = [].concat(...[exclamations, questions, this.duration, rest, post_events]
			.filter(item => item)
			.map(item => ["\b", item]));

		return [
			...pitches,
			...postfix,
		];
	}
};


class NumberUnit extends BaseTerm {
	number: number;
	unit: string;


	serilize () {
		return [`${this.number}${this.unit}`];
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
	Command,
	Block,
	Scheme,
	SchemeExpression,
	Assignment,
	Chord,
	NumberUnit,
	MusicBlock,
	Divide,
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
		//return this.root.serilize();
	}
};
