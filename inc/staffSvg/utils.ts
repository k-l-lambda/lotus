
const POS_PRECISION = 0.25;
const SIZE_PRECISION = 0.05;
const STROKE_PRECISION = 0.01;


const roundNumber = (x, precision, min = -Infinity) => Number(Math.max(Math.round(x / precision) * precision, min).toFixed(4));


// empirical formula for basic staff line stroke width
const sizeToStrokeWidth1 = size => 0.342842872995173 + 13.1430019250855 / size;
const sizeToStrokeWidth2 = size => (0.1342842872995173 + 1.31430019250855 / size) / 0.2;



export {
	POS_PRECISION,
	SIZE_PRECISION,
	STROKE_PRECISION,
	roundNumber,
	sizeToStrokeWidth1,
	sizeToStrokeWidth2,
};
