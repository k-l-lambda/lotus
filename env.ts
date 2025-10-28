import fs from "fs";
import path from "path";
import { config } from "dotenv";
import { expand } from "dotenv-expand";



const appRoot = fs.realpathSync(__dirname);
process.env.APP_ROOT_PATH = appRoot;


const dotenvName = path.resolve(appRoot, ".env");

const dotenvFiles = [`${dotenvName}.local`, dotenvName, `${dotenvName}.default`].filter(Boolean);


dotenvFiles.forEach((path) => {
	if (fs.existsSync(path)) {
		expand(config({ path }));
	}
});
