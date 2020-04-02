
import "../env.js";

import * as lilyCommands from "../backend/lilyCommands";



const testStaffSize = async size => {
	const source = `
		#(set-global-staff-size ${size})

		\\new PianoStaff <<
			\\relative c''{c1}
			\\relative c'{r}
		>>
	`;

	const result = await lilyCommands.engraveSvg(source);
	//console.log("result:", result);

	const doc = result.svgs[0];

	const strokeWidth = Number(doc.match(/stroke-width="([-.\d]+)"/)[1]);

	const ws: number[] = doc.match(/width="[-.\d]+"/g).map(str => Number(str.match(/"([-.\d]+)"/)[1]));
	const wss = Array.from(new Set(ws)).sort((x1, x2) => x1 - x2);

	return {strokeWidth, wss};
};


const main = async () => {
	const results = [];
	for (let i = 1; i <= 200; ++i) {
		results.push((await testStaffSize(i)));
		if (i % 10 === 0)
			console.log(i);
	}

	console.log("results:", results);
};



main();



// keep inspector connected
setTimeout(() => console.log("done."), 1e+8);
