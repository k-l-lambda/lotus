
const removeComments = source => source.replace(/%.*\n/g, "\n");


class Block {
	get isNull () {
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

	
	parse (source: string): string {
		let residual = source;
		while (residual) {
			if (residual && residual[0] === "}") {
				residual = residual.substring(1);
				break;
			}

			residual = this.parseSection(residual);
		}

		// TODO: mark measure block

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
				const pattern = /^([^{]*)(\\\w+[^\\]+)\{(.*)$/s;
				if (!pattern.test(source)) {
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
