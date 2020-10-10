
import path from "path";



const LY_INCLUDE_FOLDERS = ["../ly"].map(folder => path.resolve(process.env.TEMP_DIR, folder));



export {
	LY_INCLUDE_FOLDERS,
};
