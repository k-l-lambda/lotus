import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			vue: "@vue/compat",
		},
		extensions: [".ts", ".js", ".vue", ".json"],
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: "modern-compiler", // Use modern Sass API instead of legacy
			},
		},
	},
	build: {
		lib: {
			entry: resolve(__dirname, "index.browser.ts"),
			name: "lotus",
			formats: ["es", "umd"],
			fileName: (format) => `lotus.${format}.js`,
		},
		rollupOptions: {
			// Externalize deps that shouldn't be bundled
			external: ["vue"],
			output: {
				// Global vars to use in UMD build for externalized deps
				globals: {
					vue: "Vue",
				},
			},
		},
		outDir: "lib.browser",
		sourcemap: true,
	},
});
