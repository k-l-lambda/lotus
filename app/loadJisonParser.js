
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

export default async function load(grammarModule) {
	if (!parsers.get(grammarModule)) {
		const { default: grammarURL } = await grammarModule;
		const key = /lilypond\.jison$/.test(grammarURL) ? "lilypond" : "measureLayout";
		const t0 = performance.now();
		const parser = await loadPrebuiltParser(key);
		parsers.set(grammarModule, parser);
		const t1 = performance.now();
		console.debug("Prebuilt parser load cost:", t1 - t0);
	}

	return parsers.get(grammarModule);
}
