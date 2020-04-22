
class Block {
	data: object;


	constructor (data) {
		this.data = data;
	}
};


const parseRaw = (data, context) => {
	switch (context) {
	case "root":
		return data.map(block => parseRaw(block, "toplevel_block"));

	case "toplevel_block":
		return new Block(data);

	default:
		return data;
	}
};



export default class LilyDocument {
	root: object;


	constructor (data) {
		this.root = parseRaw(data, "root");
	}
};
