
const fs = require("fs");


const htmlCommonTemplate = "./app/html/CommonTemplate.html";


if (process.env.SOURCE_EDITOR_DIR)
	process.env.VUE_APP_USE_SOURCE_EDITOR = true;

if (fs.existsSync("./demo.local.ly"))
	process.env.VUE_APP_DEMO_SCORE = fs.readFileSync("./demo.local.ly", "utf8");



module.exports = {
	publicPath: "./",
	outputDir: "dist",
	pages: {
		index: {
			entry: "./app/index.ts",
			template: htmlCommonTemplate,
			title: "Lotus",
		},
	},
	chainWebpack: config => {
		// text file loader
		config.module
			.rule("raw-text")
			.test(/\.jison$/)
			.use("url-loader")
			.loader("url-loader");

		config.externals({
			musicWidgets: "@k-l-lambda/music-widgets",
		});
	
		/*// ignore third-party packed js
		config.module
			.rule("js")
			.exclude
			.add(/.*\.min\.js$/)
			.end();*/
	},
	css: {
		extract: false,
	},
	devServer: {
		//proxy: `http://localhost:${process.env.PORT}`,
		proxy: {
			"/": {
				target: `http://localhost:${process.env.PORT}`,
			},
		},
		https: !!process.env.HTTPS,
	},
};
