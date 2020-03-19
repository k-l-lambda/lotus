
const fs = require("fs");
const path = require("path");



const appRoot = fs.realpathSync(__dirname);


const dotenvName = path.resolve(appRoot, ".env");


const dotenvFiles = [
	`${dotenvName}.local`,
	dotenvName,
].filter(Boolean);


dotenvFiles.forEach(path => {
	if (fs.existsSync(path)) {
		require("dotenv-expand")(
			require("dotenv").config({ path })
		);
	}
});
