
import {MusicNotation} from "@k-l-lambda/music-widgets";

import {ChordPosition} from "./notation";



declare class StaffToken {
	system?: number;
	measure?: number;
	x: number;
	endX?: number;
};


interface TickItem {
	tick: number;
	endTick?: number;
	system: number;
	measure: number;
	x: number;
	endX: number;
};


interface SheetPosition {
	system: number,
	x: number,
};


interface Note extends MusicNotation.Note {
	chordPosition?: ChordPosition;
	measure?: number;
};


interface Notation {
	notes: Note[];
	endTick: number;
};



export default class Scheduler {
	tickTable: TickItem[];


	static createFromNotation (midiNotation: Notation, tokenMap: Map<string, StaffToken>): Scheduler {
		const tokenTable: {[key: number]: StaffToken[]} = {};
		const idSet = new Set<string>();
		let measureIndex = 0;

		midiNotation.notes.filter(note => !note.chordPosition || note.chordPosition.index === 0).forEach(note => {
			if (note.ids) {
				if (note.measure !== measureIndex) {
					idSet.clear();
					measureIndex = note.measure;
				}
				else if (note.ids.some(id => idSet.has(id)))
					return;
				note.ids.forEach(idSet.add.bind(idSet));

				tokenTable[note.startTick] = tokenTable[note.startTick] || [];
				const tokens = note.ids.map(id => tokenMap.get(id)).filter(t => t);
				tokenTable[note.startTick].push(...tokens);
			}
		});
		//console.log("tokenTable:", tokenTable);

		return Scheduler.createFromTokenTable(tokenTable, midiNotation.endTick);
	}


	static createFromTokenTable (tokenTable: {[key: number]: StaffToken[]}, endTick: number): Scheduler {
		const tickTable: TickItem[] = Object.entries(tokenTable).map(([tick, tokens]) => {
			if (!tokens.length)
				return null;
	
			tokens.sort((t1, t2) => t1.system === t2.system ? t1.x - t2.x : t1.system - t2.system);
			const token = tokens[0];
	
			return {
				tick: Number(tick),
				system: token.system,
				measure: token.measure,
				x: token.x,
				endX: token.endX,
			};
		}).filter(Boolean).sort((i1, i2) => i1.tick - i2.tick);
		//console.log("sequence:", sequence);

		tickTable.forEach((item, i) => {
			const nextItem = tickTable[i + 1];

			item.endTick = nextItem ? nextItem.tick : endTick;
			console.assert(item.endTick > item.tick, "invalid tick item, tick span is non-positive:", item, tokenTable[item.tick]);

			if (nextItem && item.system === nextItem.system && [0, 1].includes(nextItem.measure - item.measure))
				item.endX = nextItem.x;
		});

		return new Scheduler({
			tickTable,
		});
	}


	constructor ({tickTable}: {tickTable: TickItem[]}) {
		console.assert(tickTable.length > 0, "invalid tick table:", tickTable);

		this.tickTable = tickTable;
	}


	get startTick (): number {
		if (!this.tickTable[0])
			return null;

		return this.tickTable[0].tick;
	}


	get endTick (): number {
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
			system: item.system,
			x,
		};
	}


	lookupTick (position: SheetPosition): number {
		const rowItems = this.tickTable.filter(item => item.system === position.system).sort((i1, i2) => i1.x - i2.x);
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
