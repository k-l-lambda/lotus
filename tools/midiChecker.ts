
import fs from "fs";
import {argv} from "yargs";
import {MIDI} from "@k-l-lambda/web-widgets";

import "../env.js";
import * as ScoreMaker from "../backend/scoreMaker";
import loadLilyParser from "../backend/loadLilyParserNode";



const main = async () => {
	const lilyParser = await loadLilyParser();

	if (argv.inputLy) {
		const source = fs.readFileSync(argv.inputLy).toString();
		const midi = await ScoreMaker.makeMIDI(source, lilyParser);
		//console.log("midi:", midi);

		if (argv.outputMIDI) {
			const buffer = Buffer.from(MIDI.encodeMidiFile(midi));
			fs.writeFileSync(argv.outputMIDI, buffer);
		}
	}

	console.log("Done.");
};



main();
