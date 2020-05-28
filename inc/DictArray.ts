
class DictArray extends Array {
	constructor (jsonObj?: object) {
		super();

		if (jsonObj) {
			console.assert(typeof jsonObj === "object", "invalid input type:", jsonObj);

			if (Array.isArray(jsonObj))
				Object.keys(jsonObj).forEach(index => this[index] = jsonObj[index]);
			else
				Object.entries(jsonObj).forEach(([key, value]) => this[key] = value);
		}
	}


	toJSON () {
		return Object.keys(this).reduce((dict, index) => (dict[index] = this[index], dict), {__prototype: "DictArray"});
	}


	clear () {
		Object.keys(this).forEach(index => delete this[index]);
		this.length = 0;
	}


	clone () {
		return new DictArray(this);
	}
};



export default DictArray;
