
const POS_PRECISION = 0.25;
const SIZE_PRECISION = 0.05;
const STROKE_PRECISION = 0.01;


const roundNumber = (x, precision, min = -Infinity) => Number(Math.max(Math.round(x / precision) * precision, min).toFixed(4));


// empirical formula for basic staff line stroke width
const sizeToStrokeWidth = size => 0.342842872995173 + 13.1430019250855 / size;



export {
	POS_PRECISION,
	SIZE_PRECISION,
	STROKE_PRECISION,
	roundNumber,
	sizeToStrokeWidth,
};
