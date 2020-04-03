
import express from "express";
import http from "http";

import "./env.js";
import backend from "./backend";



const app = express();


// refuse direct access to .html files
app.use("*.html", (_, res) => {
	res.writeHead(404);
	res.end();
});


app.use("/", express.static("./dist"));


Object.entries(backend)
	.forEach(([path, value]) => Object.entries(value)
		.forEach(([method, handler]) => app[method](path, handler)));


const httpServer = http.createServer(app);

const port = Number(process.env.PORT);
httpServer.listen(port, process.env.HOST, () => {
	console.log("Lotus server online:", `http://${process.env.HOST}:${port}`);
});
