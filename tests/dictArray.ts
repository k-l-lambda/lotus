
import DictArray from "../inc/DictArray";



const main = () => {
	const a1 = new DictArray();

	a1[1] = 1;
	a1[2] = 2;
	a1[-1] = "minus";
	a1[-2] = -2;

	const json = a1.toJSON();
	const jsonStr = JSON.stringify(a1);

	const {__prototype, ...fields} = json;
	const a2 = new DictArray(fields);

	console.log("a1:", a1);
	console.log("json:", json);
	console.log("jsonStr:", jsonStr);
	console.log("a2:", a2);

	a1.clear();
	console.log("a1.clear:", a1, a1.length);

	const x = {
		d: new DictArray([1,2,3]),
	};
	const json2 = JSON.stringify(x);
	console.log("json2:", json2);

	const x2 = {
		d: new DictArray([1,2,3]),

		toJSON () {
			return {d: this.d};
		},
	};
	const json3 = JSON.stringify(x2);
	console.log("json3:", json3);

	const a3 = a2.clone();
	console.log("a3:", a3);
};



main();
