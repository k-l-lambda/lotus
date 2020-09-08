
const WHOLE_DURATION_MAGNITUDE = 128 * 3 * 5;


const GRACE_DURATION_FACTOR = 0.2246;


// Greatest common divisor & Least common multiple
const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
/*const gcd = (a: number, b: number): number => {
	if (!Number.isFinite(a) || !Number.isFinite(b)) {
		console.warn("NAN:", a, b);
		debugger;
		return NaN;
	}
	return b === 0 ? a : gcd(b, a % b);
};*/
const lcm = (a: number, b: number): number => a * b / gcd(a, b);
const lcmMulti: (...numbers: number[]) => number = (a, b, ...numbers) => Number.isFinite(b) ? (numbers.length ? lcmMulti(lcm(a, b), ...numbers) : lcm(a, b)) : (Number.isFinite(a) ? a : 1);


class FractionNumber {
	denominator: number;
	numerator: number;


	static fromExpression (exp: string): FractionNumber {
		const [numerator, denominator] = exp.match(/\d+/g);

		return new FractionNumber(Number(numerator), Number(denominator));
	}


	constructor (numerator, denominator) {
		this.numerator = numerator;
		this.denominator = denominator;
	}


	toString (): string {
		return `${this.numerator}/${this.denominator}`;
	}


	get value () {
		return this.numerator / this.denominator;
	}


	get reciprocal (): FractionNumber {
		return new FractionNumber(this.denominator, this.numerator);
	}


	get reduced (): FractionNumber {
		const divider = gcd(this.denominator, this.numerator);

		return new FractionNumber(this.numerator / divider, this.denominator / divider);
	}
};


const replaceSourceToken = (source: string, token: string): string => {
	let placeholder = "";

	if (token.length < 4)
		placeholder = Array(token.length).fill(" ").join("");
	else
		placeholder = "%{" + Array(token.length - 4).fill("-").join("") + "%}";

	let result = source;
	while (result.includes(token))
		result = result.replace(token, placeholder);

	return result;
};



export {
	WHOLE_DURATION_MAGNITUDE,
	GRACE_DURATION_FACTOR,
	gcd,
	lcm,
	lcmMulti,
	FractionNumber,
	replaceSourceToken,
};
