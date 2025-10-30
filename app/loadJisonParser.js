
const parsers = new Map();

async function loadPrebuiltParser(key) {
	const path = key === "lilypond" ? "/lib/lilyParser.js" : "/lib/measureLayoutParser.js";
	const res = await fetch(path);
	if (!res.ok) {
		throw new Error(`Failed to fetch prebuilt parser at ${path}. Did you run yarn build:lib?`);
	}
	const code = await res.text();
	// Strip potential HTML error (dev server root) by checking first non-space char
	const first = code.trim()[0];
	if (first === '<')
		throw new Error(`Unexpected HTML at ${path}. Ensure Vite serves /public/lib/* and open the Vite URL (not backend).`);
	const module = { exports: {} };
	const parser = (new Function("module", "exports", "require", code + "\nreturn module.exports;"))(module, module.exports, {});
	if (!parser || typeof parser.parse !== "function")
		throw new Error("Invalid prebuilt parser module content");
	return parser;
}

/**
 * Extracts the parser name from a grammar URL.
 * Handles both development and production URLs with hash suffixes.
 *
 * Examples:
 * - "../../jison/lilypond.jison" → "lilypond"
 * - "/assets/lilypond-McRWYSMJ.jison" → "lilypond"
 * - "http://host:port/assets/lilypond-McRWYSMJ.jison" → "lilypond"
 * - "/assets/measureLayout-abc123.jison" → "measureLayout"
 */
function extractParserName(grammarURL) {
	// Extract filename from URL (handle full URLs and relative paths)
	const filename = grammarURL.split('/').pop();

	// Remove extension (.jison)
	const basename = filename.replace(/\.jison$/, '');

	// Remove Vite hash suffix (e.g., "-McRWYSMJ")
	// Hash format: dash followed by 8 alphanumeric characters
	const nameWithoutHash = basename.replace(/-[a-zA-Z0-9]{8}$/, '');

	return nameWithoutHash;
}

export default async function load(grammarModule) {
	if (!parsers.get(grammarModule)) {
		const { default: grammarURL } = await grammarModule;
		const parserName = extractParserName(grammarURL);

		// Map parser name to key used in loadPrebuiltParser
		const key = parserName;

		const t0 = performance.now();
		const parser = await loadPrebuiltParser(key);
		parsers.set(grammarModule, parser);
		const t1 = performance.now();
		console.debug(`Prebuilt parser "${parserName}" load cost:`, t1 - t0);
	}

	return parsers.get(grammarModule);
}
