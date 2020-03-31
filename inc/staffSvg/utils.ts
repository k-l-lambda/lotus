
const TOKEN_PRECISION = 0.25;
const SIZE_PRECISION = 0.05;


const roundNumber = (x, precision, min = -Infinity) => Number(Math.max(Math.round(x / precision) * precision, min).toFixed(4));



export {
	TOKEN_PRECISION,
	SIZE_PRECISION,
	roundNumber,
};
