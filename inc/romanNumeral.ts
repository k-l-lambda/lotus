
function romanize (num) {
	if (!Number.isFinite(num))
		return "E_NaN";

	if (num > 1e+6)
		return "E_LARGE";

	if (num <= 0)
		return "E_NON_POSITIVE";

	const lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
	let roman = "";
	for (const word in lookup) {
		while (num >= lookup[word]) {
			roman += word;
			num -= lookup[word];
		}
	}

	return roman;
}



export default romanize;
