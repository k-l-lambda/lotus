
import child_process from "child-process-promise";

import * as lilyParser from "../inc/lilyParser";



const testParserLoading = async revision => {
	child_process.spawn("git", ["checkout", revision, "./inc/lilyParser/lilypond.jison"]);
};



const main = async () => {
	await testParserLoading("0c587d698");
};

main();



// keep inspector connected
setTimeout(() => console.log("done."), 1e+8);
