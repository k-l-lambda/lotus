
const removeComments = source => source.replace(/%.*\n/g, "\n");

const BRACKETS_BEGIN_PATTERNS = [
	/^([^{]*\s+)?(\w+\s+=[^{]*)\{(.*)$/s,
	/^([^{]*)(\\\w+[^\\]+)\{(.*)$/s,
];


class Block {
	get isNull () {
		return false;
	}


	get divided () {
		return false;
	}


	get measures () {
		return [];
	}


	get isDivider () {
		return false;
	}
};


class PlainBlock extends Block {
	content: string;


	constructor (content) {
		super();

		this.content = content.replace(/^\s+/, "").replace(/\s+$/, "");
	}


	get isNull () {
		return !this.content;
	}
};


class DividerBlock extends Block {
	get isDivider () {
		return true;
	}
}


class ScopedBlock extends Block {
	head?: string;
	blocks: Block[];


	constructor (head?: string) {
		super();

		this.head = head;
		this.blocks = [];
	}


	get instruction () {
		if (this.head) {
			const captures = this.head.match(/^\\(\w+)/);
			if (captures)
				return captures[1];
		}

		return null;
	}


	get divided () {
		return this.instruction === "repeat";
	}


	get measures () {
		const measures = [];
		let measure = [];

		for (const block of this.blocks) {
			if (block.divided)
				measures.push(...block.measures);
			else if (block.isDivider && measure.length > 0) {
				measures.push(measure);
				measure = [];
			}
			else
				measure.push(block);
		}

		if (measure.length > 0)
			measures.push(measure);

		return measures;
	}

	
	parse (source: string): string {
		let residual = source;
		while (residual) {
			if (residual && residual[0] === "}") {
				residual = residual.substring(1);
				break;
			}

			residual = this.parseSection(residual);
		}

		this.blocks = this.blocks.filter(block => !block.isNull);

		return residual;
	}


	parseSection (source: string): string {
		const dividePos = source.indexOf("|");
		const bracketsPos = source.indexOf("{");
		const endPos = source.indexOf("}");

		const firstSymbol = Math.min(...[dividePos, bracketsPos, endPos].filter(x => x >= 0));
		switch (firstSymbol) {
		case endPos:
			{
				const [_, pre, residual] = source.match(/^([^}]+)(\}.*)$/s);
				if (pre)
					this.blocks.push(new PlainBlock(pre));

				return residual;
			}

			break;
		case dividePos:
			{
				this.blocks.push(new PlainBlock(source.substr(0, dividePos)));
				this.blocks.push(new DividerBlock());

				return source.substr(dividePos + 1);
			}

			break;
		case bracketsPos:
			{
				const pattern = BRACKETS_BEGIN_PATTERNS.find(p => p.test(source));
				if (!pattern) {
					console.error("unepxect scoped source:", source);
					return null;
				}

				const [_, pre, head, body] = source.match(pattern);
				if (pre)
					this.blocks.push(new PlainBlock(pre));

				const block = new ScopedBlock(head);
				const residual = block.parse(body);
				this.blocks.push(block);
			
				return residual;
			}

			break;
		default:
			this.blocks.push(new PlainBlock(source));

			return null;
		}
	}
};


const parse = source => {
	const residual = removeComments(source);
	const block = new ScopedBlock();
	block.parse(residual);

	return block;
};



export {
	parse,
};
