
import fs from "fs";

import * as lilyParser from "../inc/lilyParser";



const grammar = fs.readFileSync("./inc/lilyParser/lilypond.jison").toString();
const source = fs.readFileSync("./tests/ly/test.ly").toString();

const parser = lilyParser.createParser(grammar);

const result = parser.parse(source);
console.log("result:", result);



// keep inspector connected
setTimeout(() => console.log("done."), 1e+8);
