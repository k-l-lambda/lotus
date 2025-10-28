import fs from "fs";
import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// Load .env.local into process.env (minimal parser)
function loadLocalEnv() {
	const p = path.resolve(".env.local");
	if (!fs.existsSync(p)) return;
	const content = fs.readFileSync(p, "utf8");
	for (const line of content.split(/\r?\n/)) {
		const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
		if (!m) continue;
		const [, key, raw] = m;
		const val = raw.replace(/^"|"$/g, "").replace(/^'|'$/g, "");
		if (!(key in process.env)) process.env[key] = val;
	}
}

loadLocalEnv();


const proxyConfig = { target: `http://localhost:${process.env.PORT || 8080}`, changeOrigin: true };
const backendPaths = [
	"musicxml2ly",
	"midi2ly",
	"engrave",
	"engraveScm",
	"engraveMIDI",
	"advanced-engrave",
	"source-dir",
];



export default defineConfig({
	base: "./",
	plugins: [vue()],
	resolve: {
		alias: {
			vue: "@vue/compat",
			"@": path.resolve(__dirname, "app"),
		},
	},
	define: {
		__VUE_OPTIONS_API__: true,
		__VUE_PROD_DEVTOOLS__: false,
	},
	build: {
		outDir: "dist",
	},
	assetsInclude: ["**/*.jison"],
	server: {
		host: process.env.HOST || "127.0.0.1",
		// Keep Vite on a different port than backend to avoid "/" proxy loops
		port: (Number(process.env.PORT) || 8080) + 1,
		proxy: Object.fromEntries(backendPaths.map(p => [`/${p}`, proxyConfig])),
	},
});
