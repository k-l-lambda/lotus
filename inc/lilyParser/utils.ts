
const WHOLE_DURATION_MAGNITUDE = 128 * 3 * 5;


// Greatest common divisor & Least common multiple
const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
const lcm = (a: number, b: number): number => a * b / gcd(a, b);
const lcmMulti: (...numbers: number[]) => number = (a, b, ...numbers) => numbers.length ? lcmMulti(lcm(a, b), ...numbers) : lcm(a, b);


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



export {
	WHOLE_DURATION_MAGNITUDE,
	gcd,
	lcm,
	lcmMulti,
	FractionNumber,
};
