
class DictArray extends Array {
	constructor (jsonObj?: object) {
		super();

		if (jsonObj) {
			console.assert(typeof jsonObj === "object", "invalid input type:", jsonObj);

			if (Array.isArray(jsonObj))
				jsonObj.forEach((v, i) => this[i] = v);
			else
				Object.entries(jsonObj).forEach(([key, value]) => this[key] = value);
		}
	}


	toJSON () {
		return Object.keys(this).reduce((dict, index) => (dict[index] = this[index], dict), {__prototype: "DictArray"});
	}
};



export default DictArray;
