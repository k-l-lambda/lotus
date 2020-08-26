
import path from "path";
import express from "express";
import http from "http";
import * as webEditor from "@k-l-lambda/web-editor";
import serveHandler from "serve-handler";

import "./env.js";
import {service} from "./backend";



const app = express();


// refuse direct access to .html files
app.use("*.html", (_, res) => {
	res.writeHead(404);
	res.end();
});


app.use("/", express.static("./dist"));


Object.entries(service)
	.forEach(([path, value]) => Object.entries(value)
		.forEach(([method, handler]) => app[method](path, handler)));


const httpServer = http.createServer(app);

const port = Number(process.env.PORT);
httpServer.listen(port, process.env.HOST, () => {
	console.log("Lotus server online:", `http://${process.env.HOST}:${port}`);
});


if (process.env.SOURCE_EDITOR_DIR) {
	const editorDir = process.env.SOURCE_EDITOR_DIR.replace(/^~/, process.env.HOME);
	const editorApiPath = "/source-dir";

	webEditor.service.createServer(httpServer, {rootDir: editorDir});

	// source directory list handler
	app.use(`${editorApiPath}/*`, (req, res) => {
		req.url = "/" + path.relative(`${editorApiPath}/`, req.baseUrl);

		// modify link URL origin
		const responseProxy = new Proxy(res, {
			get (res, prop) {
				//console.log("proxy.get:", prop);
				switch (prop) {
				case "end":
					return (content) => {
						//console.log("end with:", content);
						const html = content.replace(/href="/g, `href="${editorApiPath}`);

						res.end(html);
					};
				}

				if (typeof res[prop] === "function")
					return res[prop].bind(res);

				return res[prop];
			},
		});

		serveHandler(req, responseProxy, {
			public: editorDir,
			//symlinks: true,
		});
	});
}
