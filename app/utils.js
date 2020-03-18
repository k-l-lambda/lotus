
if (typeof File === "function") {
	File.prototype.readAs = function (type) {
		return new Promise(resolve => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);

			reader[`readAs${type}`](this);
		});
	};
}
