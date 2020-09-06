
interface MeasureLayout {
	//serialize (type: string): number[];
};


type MeasureSeq = MeasureLayout[];


class SingleMLayout implements MeasureLayout {
	measure: number;

	constructor (measure: number) {
		this.measure = measure;
	}
};


class BlockMLayout implements MeasureLayout {
	seq: MeasureSeq = [];

	constructor (seq?: MeasureSeq) {
		if (seq) {
			// spread sub BlockMLayout
			const seq2 = [];
			for (const layout of seq) {
				if (layout instanceof BlockMLayout) {
					for (const sub of layout.seq)
						seq2.push(sub);
				}
				else
					seq2.push(layout);
			}

			// reduce duplicate single measures
			let measure = null;
			for (const layout of seq2) {
				if (layout instanceof SingleMLayout) {
					if (layout.measure !== measure) {
						this.seq.push(layout);
						measure = layout.measure;
					}
				}
				else
					this.seq.push(layout);
			}
		}
	}
};


class VoltaMLayout implements MeasureLayout {
	times: number;
	body: MeasureSeq = [];
	alternates: MeasureSeq[];
};


class ABAMLayout implements MeasureLayout {
	main: MeasureLayout;
	rest: MeasureSeq = [];
};



export {
	MeasureLayout,
	SingleMLayout,
	BlockMLayout,
	VoltaMLayout,
	ABAMLayout,
};
