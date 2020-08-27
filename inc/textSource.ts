
type Position = [number, number];



export default class TextSource {
	source: string;
	linePositions: number[];


	static matchPositions (regex: RegExp, source: string) {
		const positions = [];

		let match;
		while(match = regex.exec(source))
			positions.push(match.index);

		return positions;
	}


	constructor (source) {
		this.source = source;

		const newlines = TextSource.matchPositions(/\n/g, source);

		this.linePositions = [0, ...newlines.map(p => p + 1)];
	}


	slice (lines: number | Position, columns: Position): string {
		if (!Array.isArray(lines))
			lines = [lines, lines];

		const start = this.linePositions[lines[0] - 1] + columns[0];
		const end = this.linePositions[lines[1] - 1] + columns[1];

		return this.source.substr(start, end - start);
	}


	charsToPosition (chars: number): Position {
		let lines = this.linePositions.findIndex(p => p > chars);
		lines = lines < 0 ? this.linePositions.length : lines;

		const columns = chars - this.linePositions[lines - 1];

		return [lines, columns];
	}


	positionToChars ([lines, columns]: Position): number {
		if (lines >= this.linePositions.length)
			return NaN;

		return this.linePositions[lines - 1] + columns;
	}
};
