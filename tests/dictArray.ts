
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
};



main();
