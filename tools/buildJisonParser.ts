
import fs from "fs";

import loadJisonParser from "../backend/loadJisonParserNode";


// Browser-compatible exports wrapper
// Replaces the default jison CommonJS exports to work in both Node.js and browser (via bundler)
const BROWSER_COMPATIBLE_EXPORTS = `
// Exports for both Node.js and browser (via bundler)
if (typeof exports !== 'undefined') {
  exports.parser = lilyParser;
  exports.Parser = lilyParser.Parser;
  exports.parse = function () { return lilyParser.parse.apply(lilyParser, arguments); };
  // Node.js only: main function that uses fs
  if (typeof window === 'undefined' && typeof require !== 'undefined') {
    exports.main = function commonjsMain (args) {
      if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
      }
      var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
      return exports.parser.parse(source);
    };
    if (typeof module !== 'undefined' && require.main === module) {
      exports.main(process.argv.slice(1));
    }
  }
}
`;

const build = async (jison: string, target?: string, browserCompatible = false): Promise<void> => {
	const parser = await loadJisonParser(jison);
	let code = parser.generate();

	// Replace default CommonJS exports with browser-compatible version
	if (browserCompatible) {
		// Remove the default jison exports block
		code = code.replace(
			/if \(typeof require !== 'undefined' && typeof exports !== 'undefined'\) \{[\s\S]*?\n\}/,
			BROWSER_COMPATIBLE_EXPORTS
		);
	}

	if (target)
		fs.writeFileSync(target, code);
	else
		console.log("code:", code);
};


const main = async () => {
	// Emit prebuilt parsers to public so Vite serves them at /lib/* in dev and build
	// Use browserCompatible=true for lilyParser to make it work in both Node.js and browser
	await build("./jison/lilypond.jison", "./public/lib/lilyParser.js", true);
	await build("./jison/measureLayout.jison", "./public/lib/measureLayoutParser.js");

	console.log("Done.");
};



main();
