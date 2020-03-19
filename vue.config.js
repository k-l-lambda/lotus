
const htmlCommonTemplate = "./app/html/CommonTemplate.html";



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
		config;
		/*// binary file loader
		config.module
			.rule("raw-binary")
			.test(/\.(dat)$/)
			.use("url-loader")
			.loader("url-loader");

		// ignore third-party packed js
		config.module
			.rule("js")
			.exclude
			.add(/.*\.min\.js$/)
			.end();*/
	},
	devServer: {
		//proxy: `http://localhost:${process.env.PORT}`,
		https: !!process.env.HTTPS,
	},
};
