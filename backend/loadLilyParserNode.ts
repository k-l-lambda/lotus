
import loadJisonParser from "./loadJisonParserNode";

import {Parser} from "../inc/jisonWrapper";



export default (): Promise<Parser> => loadJisonParser("./jison/lilypond.jison");
