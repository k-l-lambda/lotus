
enum LayoutType {
	Ordinary = "ordinary",
	Full = "full",
	Conservative = "conservative",
	Once = "once",
};


interface MeasureLayout {
	serialize (type: LayoutType): number[];

	seq: MeasureSeq;
};


type MeasureSeq = MeasureLayout[];


const spreadMeasureSeq = (seq: MeasureSeq, type: LayoutType = LayoutType.Ordinary): number[] => [].concat(...seq.map(layout => layout.serialize(type)));


class SingleMLayout implements MeasureLayout {
	measure: number;

	constructor (measure: number) {
		this.measure = measure;
	}


	serialize (): number[] {
		return [this.measure];
	}


	get seq (): MeasureSeq {
		return [this];
	}
};


class BlockMLayout implements MeasureLayout {
	seq: MeasureSeq = [];


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


	constructor (seq?: MeasureSeq) {
		if (seq)
			this.seq = BlockMLayout.trimSeq(seq);
	}


	serialize (type: LayoutType): number[] {
		return spreadMeasureSeq(this. seq, type);
	}
};


class VoltaMLayout implements MeasureLayout {
	times: number;
	body: MeasureSeq = [];
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
};


class ABAMLayout implements MeasureLayout {
	main: MeasureLayout;
	rest: MeasureSeq = [];


	serialize (type: LayoutType): number[] {
		const seqA = this.main.serialize(type);
		const seqA_ = spreadMeasureSeq(this.main.seq);
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
};



export {
	LayoutType,
	MeasureLayout,
	SingleMLayout,
	BlockMLayout,
	VoltaMLayout,
	ABAMLayout,
};
