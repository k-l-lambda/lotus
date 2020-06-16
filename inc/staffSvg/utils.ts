
const POS_PRECISION = 0.25;
const SIZE_PRECISION = 0.05;
const STROKE_PRECISION = 0.01;

const CLOSED_NOTEHEAD_INTERVAL_FIRST_DEG = 1.3052;

const NOTEHEAD_BASE_SCALE = 0.004;

// 2nd degree chord note head intervals for WHOLE : HALF : SOLID : CROSS = 1.81 : 1.32 : 1.25 : ?
const NOTE_TYPE_INTERVAL_FACTORS = [1.25 / 1.81, 1.25 / 1.32, 1, 1];

const NOTE_TYPE_WIDTHS = [1.81, 1.3232, 1.257, 1.257];

const MUSIC_FONT_NOTE_OFFSETS = [0.08, 0.05, -0.02, 0.3];

const ALTER_WIDTHS = {
	[-2]: 1.80,
	[-1]: 1.16,
	[0]: 1.05,
	[1]: 1.46,
	[2]: 1.39,
};


const constants = {
	CLOSED_NOTEHEAD_INTERVAL_FIRST_DEG,
	NOTE_TYPE_INTERVAL_FACTORS,
	NOTE_TYPE_WIDTHS,
	ALTER_WIDTHS,
	MUSIC_FONT_NOTE_OFFSETS,
};


const roundNumber = (x, precision, min = -Infinity) => Number(Math.max(Math.round(x / precision) * precision, min).toFixed(4));


// empirical formula for basic staff line stroke width
const sizeToStrokeWidth1 = size => 0.342842872995173 + 13.1430019250855 / size;
const sizeToStrokeWidth2 = size => (0.1342842872995173 + 1.31430019250855 / size) / 0.2;



export {
	POS_PRECISION,
	SIZE_PRECISION,
	STROKE_PRECISION,
	NOTEHEAD_BASE_SCALE,
	constants,
	roundNumber,
	sizeToStrokeWidth1,
	sizeToStrokeWidth2,
};
