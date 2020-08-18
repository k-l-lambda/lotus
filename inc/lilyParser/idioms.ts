
const PHONETS = "cdefgab";
const PHONETS_ALIAS = {
	h: "b",
};

const phonetDifferToShift = differ => differ > 3 ? -1 : (differ < -3 ? 1 : 0);


const SHARP_ALTERS = [
	"is", "d", "s", "iss", "k", "sharp",
];
const FLAT_ALTERS = [
	"es", "b", "f", "ess", "flat",
];
// in Dutch, 'as', 'es' means a flat/e flat, that's not supported here

const DOUBLE_SHARP_ALTERS = [
	...SHARP_ALTERS.map(word => word + word), "x",
];
const DOUBLE_FLAT_ALTERS = [
	...FLAT_ALTERS.map(word => word + word), "ses",
];

const alterTablize = (list, value) => list.reduce((table, word) => ((table[word] = value), table), {});


const ALTER_VALUES = {
	...alterTablize(SHARP_ALTERS, 1),
	...alterTablize(FLAT_ALTERS, -1),
	...alterTablize(DOUBLE_SHARP_ALTERS, 2),
	...alterTablize(DOUBLE_FLAT_ALTERS, -2),
};



export {
	PHONETS,
	PHONETS_ALIAS,
	phonetDifferToShift,
	ALTER_VALUES,
};
