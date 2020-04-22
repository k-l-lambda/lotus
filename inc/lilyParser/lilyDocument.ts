
const parseRaw = data => {
	// TODO:
	return data;
};



export default class LilyDocument {
	root: any;


	constructor (data) {
		this.root = parseRaw(data);
	}
};
