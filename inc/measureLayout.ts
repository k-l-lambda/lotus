
import {SimpleClass} from "./jsonRecovery";



enum LayoutType {
	Ordinary = "ordinary",
	Full = "full",
	Conservative = "conservative",
	Once = "once",
};


interface MeasureLayout {
	serialize (type: LayoutType): number[];

	seq: MeasureSeq;
	code: string;
};


type MeasureSeq = MeasureLayout[];


const spreadMeasureSeq = (seq: MeasureSeq, type: LayoutType = LayoutType.Ordinary): number[] => [].concat(...seq.map(layout => layout.serialize(type)));


const seqToCode = (seq: MeasureSeq, {withBrackets = false}: {withBrackets?: boolean} = {}): string => {
	const code = seq.map(layout => layout.code).join(", ");

	return withBrackets ? `[${code}]` : code;
};


class SingleMLayout extends SimpleClass implements MeasureLayout {
	static className = "SingleMLayout";


	measure: number;


	static from (measure: number) {
		const layout = new SingleMLayout();
		layout.measure = measure;

		return layout;
	}


	serialize (): number[] {
		return [this.measure];
	}


	get seq (): MeasureSeq {
		return [this];
	}


	get code (): string {
		return this.measure.toString();
	}
};


class BlockMLayout extends SimpleClass implements MeasureLayout {
	static className = "BlockMLayout";


	seq: MeasureSeq;


	static trimSeq (seq: MeasureSeq): MeasureSeq {
		const seq2 = [];
		for (const layout of seq) {
			if (layout instanceof BlockMLayout) {
				for (const sub of layout.seq)
					seq2.push(sub);
			}
			else
				seq2.push(layout);
		}

		// reduce duplicated or backwards single measures
		const seq3 = [];
		let measure = null;
		for (const layout of seq2) {
			if (layout instanceof SingleMLayout) {
				if (layout.measure > measure) {
					seq3.push(layout);
					measure = layout.measure;
				}
			}
			else
				seq3.push(layout);
		}

		return seq3;
	}


	static fromSeq (seq: MeasureSeq): BlockMLayout {
		const layout = new BlockMLayout();
		layout.seq = BlockMLayout.trimSeq(seq);

		return layout;
	}


	serialize (type: LayoutType): number[] {
		return spreadMeasureSeq(this.seq, type);
	}


	get code (): string {
		return seqToCode(this.seq, {withBrackets: true});
	}
};


class VoltaMLayout extends SimpleClass implements MeasureLayout {
	static className = "VoltaMLayout";


	times: number;
	body: MeasureSeq;
	alternates: MeasureSeq[];


	serialize (type: LayoutType): number[] {
		const bodySeq = spreadMeasureSeq(this.body);

		if (this.alternates) {
			const alternateSeqs = this.alternates.map(seq => spreadMeasureSeq(seq));
			const lastAlternateSeq = alternateSeqs[alternateSeqs.length - 1];

			switch (type) {
			case LayoutType.Ordinary:
				return bodySeq.concat(...alternateSeqs);

			case LayoutType.Conservative:
			case LayoutType.Full: {
				const priorSeq = [].concat(...Array(this.times - 1).fill(null).map((_, i) => [
					...bodySeq,
					...alternateSeqs[i % (this.times - 1)],
				]));

				return [
					...priorSeq,
					...bodySeq,
					...lastAlternateSeq,
				];
			}

			case LayoutType.Once:
				return [
					...bodySeq,
					...lastAlternateSeq,
				];
			}
		}
		else {
			switch (type) {
			case LayoutType.Ordinary:
			case LayoutType.Conservative:
			case LayoutType.Once:
				return bodySeq;

			case LayoutType.Full:
				return [].concat(...Array(this.times).fill(null).map(() => bodySeq));
			}
		}

		console.warn("the current case not handled:", type, this);
	}


	get seq (): MeasureSeq {
		const alternates = this.alternates ? this.alternates[this.alternates.length - 1] : [];

		return [
			...this.body,
			...alternates,
		];
	}


	get code (): string {
		const body = seqToCode(this.body, {withBrackets: true});

		let code = `${this.times}*${body}`;
		if (this.alternates)
			code += "{" + this.alternates.map(seq => seqToCode(seq, {withBrackets: seq.length > 1})).join(", ") +"}";

		return code;
	}
};


class ABAMLayout extends SimpleClass implements MeasureLayout {
	static className = "ABAMLayout";


	main: MeasureLayout;
	rest: MeasureSeq;


	serialize (type: LayoutType): number[] {
		const seqA = this.main.serialize(type);
		const seqA_ = spreadMeasureSeq(this.main.seq, LayoutType.Once);
		const seqB = spreadMeasureSeq(this.rest, type);

		switch (type) {
		case LayoutType.Ordinary:	// A B
			return [
				...seqA,
				...seqB,
			];

		case LayoutType.Once:	// B A'
			return [
				...seqB,
				...seqA_,
			];

		case LayoutType.Conservative: // A B A'
		case LayoutType.Full:	// A B A'
			return [
				...seqA,
				...seqB,
				...seqA_,
			];

		default:
			console.warn("the current case not handled:", type, this);
		}
	}


	get seq (): MeasureSeq {
		return [
			this.main,
			...this.rest,
		];
	}


	get code (): string {
		return "<" + this.main.code + ", " + seqToCode(this.rest) + ">";
	}
};



export {
	LayoutType,
	MeasureLayout,
	SingleMLayout,
	BlockMLayout,
	VoltaMLayout,
	ABAMLayout,
};
