
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
		return this.serilize().join(" ");
	}


	static isTerm (x) {
		return typeof x === "object" && x instanceof BaseTerm;
	}
}


class Root extends BaseTerm {
	sections: LilyTerm[];


	serilize () {
		return [].concat(...this.sections.map(section => section.serilize()));
	}
};


class Command extends BaseTerm {
	cmd: string;
	args: any[];


	serilize () {
		return [this.cmd, ...[].concat(...this.args.map(arg => BaseTerm.isTerm(arg) ? arg.serilize() : [arg]))];
	}
};


class Block extends BaseTerm {
	head: string;
	body: LilyTerm[];
	mods?: LilyTerm[];


	serilize () {
		// TODO: handle mods
		return [this.head, ...[].concat(...this.body.map(arg => arg.serilize()))];
	}
};


class SchemeExpression extends BaseTerm {
	func: (string | SchemeExpression);
	args: (string | SchemeExpression)[];
};


class Assignment extends BaseTerm {
	key: string;
	value: object;
};


class Chord extends BaseTerm {
	pitches: string[];
	duration: string;
};


class Unexpect extends BaseTerm {
	data: any;


	constructor (data) {
		super(data);

		console.warn("unexpected term", data);
	}
};


const termDictionary = {
	Root,
	Command,
	Block,
	SchemeExpression,
	Assignment,
	Chord,
};


const parseRaw = data => {
	/*switch (context) {
	case "root":
		return data.map(section => parseRaw(section, "toplevel_block"));

	case "toplevel_block":
		if (data.version)
			return new Command("version", [data.version]);
		else if (data.block)
			return new Block(data);

		break;
	}*/
	if (!data)
		return data;

	switch (typeof data) {
	case "object":
		if (Array.isArray(data))
			return data.map(item => parseRaw(item));

		const {proto, ...fields} = data;
		if (proto) {
			const termClass = termDictionary[data.proto];
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
		this.root = parseRaw(data);
	}


	toString () {
		//return this.root.join();
		return this.root.serilize();
	}
};
