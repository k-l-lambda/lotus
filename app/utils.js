
if (typeof File === "function") {
	File.prototype.readAs = function (type) {
		return new Promise(resolve => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);

			reader[`readAs${type}`](this);
		});
	};
}



export const downloadUrl = (url, filename) => {
	const a = document.createElement("a");
	a.setAttribute("download", filename);
	a.href = url;
	a.click();
};
