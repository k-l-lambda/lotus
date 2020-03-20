
import * as fs from "fs";
import * as glob from "glob";
import * as formidable from "formidable";
import * as child_process from "child-process-promise";



const TEMP_DIR = "./temp/";


const asyncCall = (func, ...args): Promise<any> => new Promise((resolve, reject) => func(...args, (err, data) => {
	if (err)
		reject(err);
	else
		resolve(data);
}));


const formidableHandle = (name, req, res, handle) =>
	new formidable.IncomingForm().parse(req, async (err, fields, files) => {
		try {
			if (err)
				throw err;

			const result = await handle(fields, files);

			const resultObj = (typeof result === "string" || result instanceof Buffer) ? {body: result} : result;

			res.writeHead(resultObj.body ? 200 : 404, resultObj.header);
			res.write(resultObj.body);
			res.end();
		}
		catch (error) {
			console.error(`${name} error:`, error);

			res.writeHead(500);
			res.write(error.toString());
			res.end();
		}
	});


const genHashString = (len = 8) => Buffer.from(Math.random().toString()).toString("base64").substr(3, 3 + len);


const main = async () => {
	// empty temporary directory
	try {
		await child_process.exec(`rm ${TEMP_DIR}*`);
	}
	catch (_) {
	}
};

main();



export default {
	"/musicxml2ly": {
		post: (req, res) => formidableHandle("musicxml2ly", req, res,
			async ({xml}) => {
				//console.log("files:", xml);

				const hash = genHashString();
				const xmlFileName = `${TEMP_DIR}xml2ly-${hash}.xml`;
				await asyncCall(fs.writeFile, xmlFileName, xml);

				const lyFileName = `${TEMP_DIR}xml2ly-${hash}.ly`;

				await child_process.exec(`musicxml2ly ${xmlFileName} -o ${lyFileName}`);
				//console.log("musicxml2ly:", result.stdout, result.stderr);

				const ly = await asyncCall(fs.readFile, lyFileName);

				return ly;
			}),
	},


	"/engrave": {
		post: (req, res) => formidableHandle("engrave", req, res,
			async ({source}) => {
				//console.log("files:", xml);

				const hash = genHashString();
				const sourceFilename = `${TEMP_DIR}engrave-${hash}.ly`;
				//const outputFilename = `./engrave-${hash}`;

				await asyncCall(fs.writeFile, sourceFilename, source);

				const result = await child_process.exec(`cd ${TEMP_DIR} && lilypond -dbackend=svg .${sourceFilename}`);

				const svgFiles: string[] = await asyncCall(glob, `${TEMP_DIR}engrave-${hash}*.svg`);
				svgFiles.sort();

				const svgs = await Promise.all(svgFiles.map(filename => asyncCall(fs.readFile, filename)));

				return JSON.stringify({
					logs: result.stderr,
					svgs: svgs.map(svg => svg.toString()),
				});
			}),
	},
};
