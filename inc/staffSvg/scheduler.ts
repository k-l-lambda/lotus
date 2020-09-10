
// eslint-disable-next-line
declare class StaffToken {
	row: number;
	measure: number;
	x: number;
	endX: number;
};


interface TickItem {
	tick: number;
	endTick?: number;
	row: number;
	measure: number;
	x: number;
	endX: number;
};


interface SheetPosition {
	row: number,
	x: number,
};



export default class Scheduler {
	tickTable: TickItem[];


	static createFromNotation (midiNotation, tokenMap: Map<string, StaffToken>) {
		const tokenTable: {[key: number]: StaffToken[]} = {};

		midiNotation.notes.forEach(note => {
			if (note.ids) {
				tokenTable[note.startTick] = tokenTable[note.startTick] || [];
				const tokens = note.ids.map(id => tokenMap.get(id)).filter(t => t);
				tokenTable[note.startTick].push(...tokens);
			}
		});
		//console.log("tokenTable:", tokenTable);

		const tickTable: TickItem[] = Object.entries(tokenTable).map(([tick, tokens]) => {
			if (!tokens.length)
				return null;
	
			tokens.sort((t1, t2) => t1.row === t2.row ? t1.x - t2.x : t1.row - t2.row);
			const token = tokens[0];
	
			return {
				tick: Number(tick),
				row: token.row,
				measure: token.measure,
				x: token.x,
				endX: token.endX,
			};
		}).filter(item => item).sort((i1, i2) => i1.tick - i2.tick);
		//console.log("sequence:", sequence);

		tickTable.forEach((item, i) => {
			const nextItem = tickTable[i + 1];

			item.endTick = nextItem ? nextItem.tick : midiNotation.endTick;

			if (nextItem && item.row === nextItem.row && [0, 1].includes(nextItem.measure - item.measure))
				item.endX = nextItem.x;
		});

		return new Scheduler({
			tickTable,
		});
	}


	constructor ({tickTable}) {
		console.assert(tickTable.length > 0, "invalid tick table:", tickTable);

		this.tickTable = tickTable;
	}


	get startTick () {
		if (!this.tickTable[0])
			return null;

		return this.tickTable[0].tick;
	}


	get endTick () {
		if (!this.tickTable[0])
			return null;

		return this.tickTable[this.tickTable.length - 1].endTick;
	}


	lookupPosition (tick: number): SheetPosition {
		tick = Math.max(Math.min(tick, this.endTick), this.startTick);

		const item = this.tickTable.find(item => item.tick <= tick && item.endTick > tick) || this.tickTable[this.tickTable.length - 1];
		if (!item) {
			console.warn("cannot find tick item:", tick, this.tickTable);
			return null;
		}

		const x = item.x + (tick - item.tick) * (item.endX - item.x) / (item.endTick - item.tick);

		return {
			row: item.row,
			x,
		};
	}


	lookupTick (position: SheetPosition): number {
		const rowItems = this.tickTable.filter(item => item.row === position.row).sort((i1, i2) => i1.x - i2.x);
		let item = rowItems.find(item => item.x <= position.x && item.endX >= position.x);
		if (!item) {
			const firstItem = rowItems[0];
			if (firstItem && position.x < firstItem.endX)
				item = firstItem;
			else
				//console.warn("lookup position out of range:", position, this.tickTable);
				return null;
		}

		const tick = item.tick + Math.max(position.x - item.x, 0) * (item.endTick - item.tick) / (item.endX - item.x);

		return tick;
	}
};
