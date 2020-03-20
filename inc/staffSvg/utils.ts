
const TOKEN_PRECISION = 0.25;


const roundNumber = (x, precision, min = -Infinity) => Math.max(Math.round(x / precision) * precision, min);



export {
	TOKEN_PRECISION,
	roundNumber,
};
