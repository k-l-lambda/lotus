
const BRACKETS_BEGIN_PATTERNS = [
	/^([^{]*\s+)?(\w+\s+=[^{]*)\{(.*)$/s,
	/^([^{]*)(\\\w+[^\\]+)\{(.*)$/s,
];

const SINGLE_COMMENT = /%.*\n/;
const SINGLE_COMMENT_G = /%.*\n/g;
const SCOPED_COMMENT = /%\{.*?%\}/s;
const SCOPED_COMMENT_G = /%\{.*?%\}/gs;


const removeComments = source => source.replace(SCOPED_COMMENT_G, "").replace(SINGLE_COMMENT_G, "\n");


const escapeComments = source => {
	let residual = source;
	const comments = [];

	while (SCOPED_COMMENT.test(residual)) {
		const comment = residual.match(SCOPED_COMMENT)[0];
		residual = residual.replace(SCOPED_COMMENT, `$$${comments.length}$$`);

		comments.push(comment);
	}

	while (SINGLE_COMMENT.test(residual)) {
		const comment = residual.match(SINGLE_COMMENT)[0];
		residual = residual.replace(SINGLE_COMMENT, `$$${comments.length}$$\n`);

		comments.push(comment);
	}

	return {
		residual,
		comments,
	};
};


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


	stringify () : string {
		return "";
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


	stringify () {
		return this.content;
	}
};


class DividerBlock extends Block {
	get isDivider () {
		return true;
	}


	stringify () {
		return " |\n";
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


	stringify () {
		return (this.head || "") + " {"
			+ this.blocks.reduce((source, block) => source + block.stringify(), "")	// TODO: add indents
			+ "\n}\n";
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
	const {residual, comments} = escapeComments(source);
	const block = new ScopedBlock();
	block.parse(residual);

	return {block, comments};
};


const getGlobalAttributes = source => {
	const code = removeComments(source);

	let staffSize = 20;

	const cap1 = code.match(/set-global-staff-size\s+([\d.]+)/);
	if (cap1)
		staffSize = Number(cap1[1]);

	const cap2 = code.match(/layout-set-staff-size\s+([\d.]+)/);
	if (cap2)
		staffSize = Number(cap2[1]);

	return {
		staffSize,
	};
};



export {
	parse,
	getGlobalAttributes,
};