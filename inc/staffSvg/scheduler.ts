
declare class StaffToken {
	row: number;
	x: number;
	endX: number;
};


interface TickItem {
	tick: number;
	row: number;
	x: number;
	endX: number;
};



export default class Scheduler {
	tickTable: TickItem[];


	static createFromNotation (midiNotation, tokenMap) {
		const tokenTable: {[key: number]: StaffToken[]} = {};

		midiNotation.notes.forEach(note => {
			tokenTable[note.startTick] = tokenTable[note.startTick] || [];
			const tokens = note.ids.map(id => tokenMap.get(id)).filter(t => t);
			tokenTable[note.startTick].push(...tokens);
		});
		//console.log("tokenTable:", tokenTable);
	
		const sequence = Object.entries(tokenTable).map(([tick, tokens]) => {
			if (!tokens.length)
				return null;
	
			tokens.sort((t1, t2) => t1.row === t2.row ? t1.x - t2.x : t1.row - t2.row);
			const token = tokens[0];
	
			return {
				tick: Number(tick),
				row: token.row,
				x: token.x,
				endX: token.endX,
			};
		}).filter(item => item);
		//console.log("sequence:", sequence);

		return new Scheduler(sequence);
	}


	constructor (tickTable) {
		this.tickTable = tickTable;
	}
};
