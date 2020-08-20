
import {romanize} from "../romanNumeral";
import {WHOLE_DURATION_MAGNITUDE, lcmMulti, lcm} from "./utils";
import {parseRaw, getDurationSubdivider} from "./lilyTerms";
import LogRecorder from "../logRecorder";
import {StaffContext, PitchContextTable} from "../pitchContext";

import {
	// eslint-disable-next-line
	BaseTerm,
	LiteralString, Root, Block, MusicEvent, Repeat, Relative, TimeSignature, Partial, Times, Tuplet, Grace, AfterGrace, Clef, Scheme, Include, Rest,
	KeySignature, OctaveShift, Duration, Chord, MusicBlock, Assignment, Variable, Command, SimultaneousList, ContextedMusic, Primitive, Version,
	ChordMode, LyricMode, ChordElement, Language, PostEvent, Transposition,
} from "./lilyTerms";
// eslint-disable-next-line
import LilyDocument from "./lilyDocument";
// eslint-disable-next-line
import * as LilyNotation from "../lilyNotation";
// eslint-disable-next-line
import {NotationTrack} from "../pitchContext";



interface DurationContextStackStatus {
	factor?: {value: number};
};


type MusicTransformer = (music: BaseTerm, context: TrackContext) => BaseTerm[];
type MusicListener = (music: BaseTerm, context: TrackContext) => void;


type ContextDict = {[key: string]: string};


type NotationTrackGroup = {[key: string]: NotationTrack};


export class MusicTrack {
	block: MusicBlock;
	anchorPitch: ChordElement;
	contextDict?: ContextDict = null;

	name?: string;


	static fromBlockAnchor (block: MusicBlock, anchorPitch: ChordElement): MusicTrack {
		const track = new MusicTrack;

		track.block = block;
		track.anchorPitch = anchorPitch;

		const context = new TrackContext(track);
		context.execute(track.music);

		return track;
	}


	get music (): BaseTerm {
		if (!this.block._parent) {
			this.block._parent = new Relative({cmd: "relative", args: this.anchorPitch ? [this.anchorPitch.clone(), this.block] : [this.block]});
			this.block.updateChordAnchors();
		}

		return this.block._parent;
	}


	get noteDurationSubdivider (): number {
		return getDurationSubdivider(this.block);
	}


	get durationMagnitude (): number {
		return this.block && this.block.durationMagnitude;
	}


	transform (transformer: MusicTransformer) {
		new TrackContext(this, {transformer}).execute(this.music);
	}


	splitLongRests () {
		this.transform((term, context) => {
			if (!(term instanceof MusicEvent) || (!term.withMultiplier && !(term instanceof Rest)))
				return [term];

			const timeDenominator = context.time ? context.time.value.denominator : 4;
			const duration = term.durationValue;
			const denominator = Math.max(duration.denominator, timeDenominator);

			if (term.withMultiplier) {
				const factor = duration.multipliers.reduce((factor, multiplier) => factor * Number(multiplier), 1);
				if (!Number.isInteger(factor) || factor <= 0) {
					console.warn("invalid multiplier:", factor, duration.multipliers);
					return [term];
				}

				const event = term.clone() as MusicEvent;
				event.duration.multipliers = [];

				// break duration into multiple rest events
				const restCount = (event.duration.magnitude / WHOLE_DURATION_MAGNITUDE) * (factor - 1) * denominator;
				if (!Number.isInteger(restCount))
					console.warn("Rest count is not integear:", restCount, denominator, event.duration.magnitude, factor);

				const rests = Array(Math.floor(restCount)).fill(null).map(() =>
					new Rest({name: "s", duration: new Duration({number: denominator, dots: 0})}));

				return [event, ...rests];
			}
			else {
				const divider = lcm(duration.subdivider, denominator);
				const restCount = term.durationMagnitude * divider / WHOLE_DURATION_MAGNITUDE;
				console.assert(Number.isInteger(restCount), "rest count is not an integer:", restCount);

				return Array(restCount).fill(null).map(() =>
					new Rest({name: "s", duration: new Duration({number: divider, dots: 0})}));
			}
		});
	}


	spreadRelativeBlocks () {
		// check if traverse is nessary
		const term = this.block.findFirst(Relative);
		if (!term)
			return;

		this.transform((term, context) => {
			if (term instanceof Relative)
				return term.shiftBody(context.pitch);
			else
				return [term];
		});
	}


	spreadRepeatBlocks ({ignoreRepeat = true, keepTailPass = false} = {}) {
		// check if traverse is nessary
		const term = this.block.findFirst(Repeat);
		if (!term)
			return;

		this.transform(term => {
			if (term instanceof Repeat) {
				if (!ignoreRepeat)
					return term.getUnfoldTerms();
				else if (keepTailPass)
					return term.getTailPassTerms();
				else
					return term.getPlainTerms();
			}
			else
				return [term];
		});
	}


	flatten ({spreadRepeats = false} = {}) {
		this.splitLongRests();
		this.spreadRelativeBlocks();

		if (spreadRepeats)
			this.spreadRepeatBlocks();
	}


	sliceMeasures (start: number, count: number): MusicTrack {
		this.flatten({spreadRepeats: true});

		const context = new TrackContext(this);
		context.pitch = this.anchorPitch;
		this.block.updateChordAnchors();

		for (const term of this.block.body) {
			if (Number.isInteger(term._measure)) {
				if (term._measure < start)
					context.execute(term);
				else
					break;
			}
		}

		const terms = context.declarations.concat(this.block.body.filter(term => term._measure >= start && term._measure < start + count));
		const newBlock = new MusicBlock({body: terms.map(term => term.clone())});

		return MusicTrack.fromBlockAnchor(newBlock, context.pitch);
	}


	generateStaffTracks ({logger}: {logger?: LogRecorder} = {}): {group: NotationTrackGroup, notes: LilyNotation.Note[]} {
		const staves: {[key: string]: StaffContext} = {};
		const getCurrentStaffContext = (staffName: string): StaffContext => {
			if (!staves[staffName])
				staves[staffName] = new StaffContext({logger});

			return staves[staffName];
		};

		const notes: any[] = [];

		const listener = (term: BaseTerm, track: TrackContext) => {
			const context = getCurrentStaffContext(track.staffName);

			if (term instanceof Chord) {
				const index = context.snapshot({tick: term._tick});
				const ctx = context.track.contexts[index];

				term.pitchElements.forEach(pitch => notes.push({
					//channel: 0,
					//start: term._tick,
					//duration: term.durationMagnitude,
					startTick: term._tick,
					endTick: term._tick + term.durationMagnitude,
					pitch: pitch.absolutePitchValue + (pitch._transposition || 0),
					id: pitch.href,
					tied: pitch._tied,
					ctx,
					staffName: track.staffName,
				}));
			}
			else if (term instanceof Clef) {
				// TODO:
			}
			else if (term instanceof KeySignature) {
				// TODO:
			}
			else if (term instanceof OctaveShift) {
				// TODO:
			}
		};
		new TrackContext(this, {listener}).execute(this.music);

		return {
			group: Object.entries(staves).reduce((group, [name, context]) => ({...group, [name]: context.track}), {}),
			notes,
		};
	}
};


class TrackContext {
	track: MusicTrack;
	transformer?: MusicTransformer;
	listener?: MusicListener;

	stack: DurationContextStackStatus[] = [];

	// declarations
	staff: Command = null;
	clef: Clef = null;
	key: KeySignature = null;
	time: TimeSignature = null;
	octave: OctaveShift = null;

	pitch: ChordElement = null;

	staffName: string = null;
	voiceName: string = null;
	transposition: number = 0;

	// time status
	tick: number = 0;
	tickInMeasure: number = 0;
	measureSpan: number = WHOLE_DURATION_MAGNITUDE;
	measureIndex: number = 1;
	partialDuration: Duration = null;

	event: MusicEvent = null;
	tying: boolean = false;
	staccato: boolean = false;


	constructor (track = new MusicTrack, {transformer = null, listener = null, contextDict = null}:
		{
			transformer?: MusicTransformer,
			listener?: MusicListener,
			contextDict?: ContextDict,
		} = {}) {
		this.track = track;
		this.track.contextDict = contextDict || this.track.contextDict;

		this.transformer = transformer;
		this.listener = listener;

		if (this.track.contextDict) {
			this.staffName = this.track.contextDict.Staff;
			this.voiceName = this.track.contextDict.Voice;
		}
		//console.debug("contextDict:", contextDict);
	}


	get factor (): {value: number} {
		for (let i = this.stack.length - 1; i >= 0; i--) {
			const status = this.stack[i];
			if (status.factor)
				return status.factor;
		}

		return null;
	}


	get factorValue (): number {
		return this.factor ? this.factor.value : 1;
	}


	get currentMeasureSpan (): number {
		return Math.round(this.partialDuration ? this.partialDuration.magnitude : this.measureSpan);
	}


	setPitch (pitch: ChordElement) {
		if (!this.track.anchorPitch)
			this.track.anchorPitch = pitch;

		this.pitch = pitch;
	}


	elapse (duration: number) {
		const increment = duration * this.factorValue;

		this.tick += increment;

		this.tickInMeasure += increment;
		while (Math.round(this.tickInMeasure) >= this.currentMeasureSpan) {
			++this.measureIndex;
			this.tickInMeasure -= this.currentMeasureSpan;

			this.partialDuration = null;
		}
	}


	push (status: DurationContextStackStatus) {
		this.stack.push(status);
	}

	
	pop () {
		this.stack.pop();
	}


	processGrace (music: BaseTerm, factor = 1 / 4) {
		// pull back grace notes' ticks
		let events = [music];
		if (!(music instanceof MusicEvent))
			events = music.findAll(MusicEvent);

		let tick = this.tick;
		events.reverse().forEach(event => {
			tick -= event.durationMagnitude * factor;
			event._tick = tick;

			event.findAll(ChordElement).forEach(note => note._tick = tick);
		});
	}


	execute (term: BaseTerm) {
		if (!term) {
			console.warn("null term:", term);
			return;
		}

		if (!(term instanceof BaseTerm))
			return;

		term._measure = this.measureIndex;
		term._tick = this.tick;

		if (term instanceof MusicEvent) {
			term._previous = this.event;

			if (term instanceof Chord) {
				this.setPitch(term.absolutePitch);

				term.pitches.forEach(pitch => {
					this.execute(pitch);

					if (pitch instanceof ChordElement)
						pitch._transposition = this.transposition;
				});

				// update tied for ChordElement
				// TODO: staccato trigger condition?
				if (this.tying /*&& !this.staccato*/ && this.event && this.event instanceof Chord) {
					const pitches = new Set(this.event.pitchElements.map(pitch => pitch.absolutePitch.pitch));
					term.pitchElements.forEach(pitch => {
						if (pitches.has(pitch.absolutePitch.pitch))
							pitch._tied = true;
						//else
						//	console.log("missed tie:", `${pitch._location.lines[0]}:${pitch._location.columns[0]}`, pitch.absolutePitch.pitch, pitches);
					});

					if (this.staccato)
						console.warn("tie on staccato note:", term.href);
				}
				//console.log("chord:", term.pitches[0]);
			}

			this.event = term;

			this.elapse(term.durationMagnitude);

			this.tying = false;
			this.staccato = false;

			if (term.isTying)
				this.tying = true;
			if (term.isStaccato)
				this.staccato = true;
		}
		else if (term instanceof ChordElement) {
			// ignore
		}
		else if (term instanceof MusicBlock) {
			if (!this.track.block)
				this.track.block = term;

			term.updateChordAnchors();

			if (this.transformer) {
				const body = [];
				for (const subterm of term.body) {
					const terms = this.transformer(subterm, this);
					terms.forEach(t => this.execute(t));

					body.push(...terms);
				}
	
				term.body = body;
			}
			else {
				for (const subterm of term.body)
					this.execute(subterm);
			}
		}
		else if (term instanceof TimeSignature) {
			this.time = term;
			this.measureSpan = term.value.value * WHOLE_DURATION_MAGNITUDE;
		}
		else if (term instanceof Partial)
			this.partialDuration = term.duration;
		else if (term instanceof Repeat) {
			this.execute(term.bodyBlock);

			if (term.alternativeBlocks) {
				for (const block of term.alternativeBlocks)
					this.execute(block);
			}
		}
		else if (term instanceof Relative) {
			if (term.anchor)
				this.setPitch(term.anchor);

			this.execute(term.music);
		}
		else if (term instanceof LyricMode) {
			// ignore lyric mode
		}
		else if (term instanceof Command && term.cmd === "lyricsto") {
			// ignore lyric mode
		}
		else if (term instanceof ChordMode) {
			// ignore chord mode
		}
		else if (term instanceof Transposition)
			this.transposition = term.transposition;
		else if (term instanceof Times) {
			this.push({factor: term.factor});
			this.execute(term.music);
			this.pop();
		}
		else if (term instanceof Tuplet) {
			this.push({factor: term.divider.reciprocal});
			this.execute(term.music);
			this.pop();
		}
		else if (term instanceof Grace) {
			this.push({factor: {value: 0}});
			this.execute(term.music);
			this.pop();

			this.processGrace(term.music);
		}
		else if (term instanceof AfterGrace) {
			this.execute(term.body);

			this.push({factor: {value: 0}});
			this.execute(term.grace);
			this.pop();

			this.processGrace(term.grace);
		}
		else if (term instanceof Clef)
			this.clef = term;
		else if (term instanceof KeySignature)
			this.key = term;
		else if (term instanceof OctaveShift)
			this.octave = term;
		else if (term instanceof Command && term.cmd === "change") {
			const pair = term.getAssignmentPair();
			if (pair) {
				switch (pair.key) {
				case "Staff":
					this.staffName = pair.value.toString();
					this.staff = term;

					break;
				case "Voice":
					this.voiceName = pair.value.toString();

					break;
				}
			}
		}
		else if (term instanceof Primitive) {
			if (term.exp === "~")
				this.tying = true;
		}
		else if (term instanceof PostEvent) {
			if (term.isStaccato)
				this.staccato = true;
		}
		else {
			if (term.isMusic)
				console.warn("[TrackContext]	unexpected music term:", term);
		}

		if (this.listener)
			this.listener(term, this);
	}


	get declarations (): BaseTerm[] {
		return [this.staff, this.clef, this.key, this.time, this.octave].filter(term => term);
	}
};



export default class LilyInterpreter {
	variableTable: Map<string, BaseTerm> = new Map();

	musicTracks: MusicTrack[] = [];

	version: Version = null;
	language: Language = null;
	header: Block = null;
	includeFiles: Set<string> = new Set;
	statements: BaseTerm[] = [];
	paper: Block = null;
	layout: Block = null;
	score: Block = null;
	staffNames: string[] = [];


	static trackName (index: number): string {
		return `Voice_${romanize(index)}`;
	};


	/*eval (term: BaseTerm): BaseTerm {
		return this.execute(term.clone());
	}*/


	interpretMusic (music: BaseTerm, contextDict: ContextDict): Variable {
		//console.log("interpretMusic:", music);
		const context = new TrackContext(undefined, {contextDict});
		//context.execute(music.clone());
		context.execute(music);

		context.track.spreadRelativeBlocks();
		this.musicTracks.push(context.track);

		const varName = LilyInterpreter.trackName(this.musicTracks.length);

		context.track.name = varName;

		return new Variable({name: varName});
	}


	interpretDocument (doc: LilyDocument): this {
		this.execute(doc.root);

		return this;
	}


	execute (term: BaseTerm, {execMusic = false, contextDict = {}}: {execMusic?: boolean, contextDict?: ContextDict} = {}): BaseTerm {
		if (!term)
			return term;

		if (term instanceof Root) {
			for (const section of term.sections) {
				const sec = this.execute(section, {execMusic: true});
				if (sec instanceof Version)
					this.version = sec;
				else if (sec instanceof Language)
					this.language = sec;
				else if (sec instanceof Scheme)
					this.statements.push(sec);
				else if (sec instanceof Block) {
					switch (sec.head) {
					case "\\header":
						this.header = sec;

						break;
					case "\\paper":
						this.paper = sec;

						break;
					case "\\layout":
						this.layout = sec;

						break;
					case "\\score":
						this.score = sec;

						break;
					}
				}
			}
		}
		else if (term instanceof Assignment) {
			const value = this.execute(term.value);
			this.variableTable.set(term.key as string, value);
		}
		else if (term instanceof Block) {
			if (term.head === "\\score") {
				return new Block({
					block: term.block,
					head: term.head,
					body: term.body.map(subterm => this.execute(subterm, {execMusic: true})),
				});
			}
		}
		else if (term instanceof Variable) {
			const result = this.variableTable.get(term.name);
			if (!result)
				console.warn("uninitialized variable is referred:", term);

			return result;
		}
		else if (term instanceof MusicBlock) {
			const result = new MusicBlock({
				_parent: term._parent,
				body: term.body.map(subterm => this.execute(subterm)).filter(term => term),
			});
			if (execMusic) {
				const variable = this.interpretMusic(result, contextDict);
				return new MusicBlock({body: [variable]});
			}

			return result;
		}
		else if (term instanceof SimultaneousList)
			return new SimultaneousList({list: term.list.map(subterm => this.execute(subterm, {execMusic, contextDict})).filter(term => term)});
		else if (term instanceof ContextedMusic) {
			if (term.contextDict && term.contextDict.Staff)
				this.staffNames.push(term.contextDict.Staff);

			return new ContextedMusic({
				head: this.execute(term.head),
				lyrics: this.execute(term.lyrics),
				body: this.execute(term.body, {execMusic, contextDict: {...contextDict, ...term.contextDict}}),
			});
		}
		else if (term instanceof Include)
			this.includeFiles.add(term.filename);
		else if (term instanceof Command)
			return parseRaw({proto: term.proto, cmd: term.cmd, args: term.args.map(arg => this.execute(arg, {execMusic, contextDict}))});

		return term;
	}


	updateTrackAssignments () {
		this.musicTracks.forEach((track, i) => this.variableTable.set(LilyInterpreter.trackName(i + 1), track.music));
	}


	toDocument (): LilyDocument {
		this.updateTrackAssignments();

		const variables = [].concat(...[this.paper, this.layout, this.score].filter(block => block).map(block => block.findAll(Variable).map(variable => variable.name)));
		const assignments = variables.filter(name => this.variableTable.get(name)).map(name => new Assignment({key: name, value: this.variableTable.get(name)}));
		const includes = Array.from(this.includeFiles).map(filename => new Include({cmd: "include", args: [LiteralString.fromString(filename)]}));

		const root = new Root({sections: [
			this.version,
			this.language,
			this.header,
			...includes,
			...this.statements,
			this.paper,
			this.layout,
			...assignments,
			this.score,
		].filter(section => section)});

		return new LilyDocument(root);
	}


	getNoteDurationSubdivider (): number {
		const subdivider = lcmMulti(...this.musicTracks.map(track => track.noteDurationSubdivider));

		return subdivider;
	}


	sliceMeasures (start: number, count: number) {
		this.musicTracks = this.musicTracks.map(track => {
			const newTrack = track.sliceMeasures(start, count);
			newTrack.name = track.name;	// inherit name

			return newTrack;
		});
	}


	addIncludeFile (filename: string) {
		this.includeFiles.add(filename);
	}


	getNotation ({logger = new LogRecorder()} = {}): LilyNotation.Notation {
		const pitchContexts = this.staffNames.map(name => ({
			name,
			items: [],
		}));

		const tracks = this.musicTracks.map((track, i) => {
			const {notes, group} = track.generateStaffTracks({logger});
			//console.log("group:", group);

			pitchContexts.forEach(({name, items}) => {
				const track = group[name];
				if (track) {
					items.push(...track.contexts.map(context => ({
						tick: context.tick,
						context,
					})));
				}
			});

			return notes.map(note => ({track: i, ...note}));
		});
		const notes = [].concat(...tracks).sort((n1, n2) => n1.startTick - n2.startTick);

		const pitchContextGroup = pitchContexts.map(({items}) => {
			items.sort((i1, i2) => i1.tick - i2.tick);
			items.forEach((item, i) => {
				item.endTick = (i + 1 < items.length ? items[i + 1].tick : Infinity);
				item.context.index = i;
			});

			return new PitchContextTable({items});
		});

		const staffNamesIndices = this.staffNames.reduce((indices, name, index) => ({...indices, [name]: index}), {});

		notes.forEach(note => {
			note.staffTrack = staffNamesIndices[note.staffName];
			note.contextIndex = note.ctx.index;

			// clear temporary fields
			delete note.staffName;
			delete note.ctx;
		});

		return {
			notes,
			pitchContextGroup,
		};
	}
};
