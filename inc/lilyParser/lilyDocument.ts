
interface LilyTerm {
	serilize () : string[];
};


class BaseTerm implements LilyTerm {
	constructor (data) {
		Object.assign(this, data);
	}


	serilize () {
		return [];
	}
}


class Command extends BaseTerm {
	cmd: object;
	args: any[];
};


class Block extends BaseTerm {
	data: object;
};


class SchemeExpression extends BaseTerm {
	func: (string | SchemeExpression);
	args: (string | SchemeExpression)[];
};


class Unexpect extends BaseTerm {
	data: any;


	constructor (data) {
		super(data);

		console.warn("unexpected term", data);
	}
};


const termDictionary = {
	Command,
	Block,
	SchemeExpression,
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
	switch (typeof data) {
	case "string":
	case "number":
	case "boolean":
		return data;
	
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
	}

	return new Unexpect(data); 
};



export default class LilyDocument {
	root: object;


	constructor (data) {
		this.root = parseRaw(data);
	}
};
