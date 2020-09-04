
import {romanize} from "../romanNumeral";
import {WHOLE_DURATION_MAGNITUDE, lcmMulti, lcm} from "./utils";
import {parseRaw, getDurationSubdivider} from "./lilyTerms";
import LogRecorder from "../logRecorder";
import {StaffContext, PitchContextTable} from "../pitchContext";
import * as idioms from "./idioms";

import {
	// eslint-disable-next-line
	BaseTerm,
	Root, Block, MusicEvent, Repeat, Relative, TimeSignature, Partial, Times, Tuplet, Grace, AfterGrace, Clef, Scheme, Include, Rest,
	KeySignature, OctaveShift, Duration, Chord, MusicBlock, Assignment, Variable, Command, SimultaneousList, ContextedMusic, Primitive, Version,
	ChordMode, LyricMode, ChordElement, Language, PostEvent, Transposition,
} from "./lilyTerms";
// eslint-disable-next-line
import LilyDocument from "./lilyDocument";
// eslint-disable-next-line
import * as LilyNotation from "../lilyNotation";



interface DurationContextStackStatus {
	factor?: {value: number};
};


type MusicTransformer = (music: BaseTerm, context: TrackContext) => BaseTerm[];
type MusicListener = (music: BaseTerm, context: TrackContext) => void;


type ContextDict = {[key: string]: string};


interface PitchContextTerm {
	staffName: string;

	tick?: number;
	event: MusicEvent;

	clef?: {
		y: number,
		value: number,
	};
	octaveShift?: number;
	key?: number;
	newMeasure?: boolean;
	pitches?: ChordElement[];
};


class LilyStaffContext extends StaffContext {
	staffTrack: number;
	notes: LilyNotation.Note[] = [];


	executeTerm (term: PitchContextTerm) {
		//console.log("executeTerm:", term);

		if (term.newMeasure)
			this.resetAlters();

		if (term.clef)
			this.setClef(term.clef.y, term.clef.value);
		if (Number.isFinite(term.octaveShift))
			this.setOctaveShift(-term.octaveShift);
		if (Number.isFinite(term.key)) {
			this.resetKeyAlters();

			if (term.key) {
				const step = term.key > 0 ? 1 : -1;
				for (let p = step; p / term.key <= 1; p += step) {
					const index = ((step > 0 ? p - 1 : p) + 70) % 7;
					const note = idioms.PHONETS.indexOf(idioms.FIFTH_PHONETS[index]);

					this.keyAlters[note] = (this.keyAlters[note] || 0) + step;
				}
				this.dirty = true;
			}
		}

		if (term.pitches) {
			// accidental alters
			term.pitches.forEach(pitch => {
				const note = pitch.absoluteNotePosition;
				const alter = this.alterOnNote(note);
				if (pitch.alterValue !== alter) {
					this.alters[note] = pitch.alterValue;
					this.dirty = true;
				}
			});

			const event = term.event;
			const contextIndex = this.snapshot({tick: event._tick});

			this.notes.push(...term.pitches.map(pitch => ({
				channel: 0,
				measure: event._measure,
				start: event._tick,
				duration: event.durationMagnitude,
				startTick: event._tick,
				endTick: event._tick + event.durationMagnitude,
				pitch: pitch.absolutePitchValue + (pitch._transposition || 0),
				velocity: 127,
				id: pitch.href,
				ids: [pitch.href],
				tied: !!pitch._tied,
				rest: event.isRest,
				staffTrack: this.staffTrack,
				contextIndex,
			})));

			term.pitches.forEach(pitch => {
				const tiedParent = pitch.tiedParent;
				if (tiedParent) {
					const note = this.notes.find(note => note.id === tiedParent.href);
					if (note)
						note.ids.push(pitch.href);
				}
			});
		}
	}


	get pitchContextTable (): PitchContextTable {
		const items = this.track.contexts.map(context => ({
			tick: context.tick,
			endTick: null,
			context,
		}));
		items.forEach((item, i) => {
			item.endTick = (i + 1 < items.length ? items[i + 1].tick : Infinity);
		});

		return new PitchContextTable({items});
	}
};



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


	generateStaffTracks (): PitchContextTerm[] {
		const pcTerms: PitchContextTerm[] = [];

		let currentTerm = null;
		const commitTerm = () => {
			if (currentTerm) {
				pcTerms.push(currentTerm);
				currentTerm = null;
			}
		};
		const getCurrentTerm = (staffName: string): PitchContextTerm => {
			if (currentTerm && currentTerm.staffName !== staffName)
				commitTerm();

			if (!currentTerm)
				currentTerm = {staffName};

			return currentTerm;
		};

		let measureIndex = 0;

		const listener = (term: BaseTerm, track: TrackContext) => {
			getCurrentTerm(track.staffName).tick = term._tick;

			if (term._measure !== measureIndex) {
				getCurrentTerm(track.staffName).newMeasure = true;
				commitTerm();

				measureIndex = term._measure;
			}

			if (term instanceof Chord) {
				const pcTerm = getCurrentTerm(track.staffName);
				pcTerm.event = term;
				pcTerm.pitches = term.pitchElements;

				commitTerm();
			}
			else if (term instanceof Clef) {
				//console.log("clef:", term.clefName);
				switch (term.clefName) {
				case "treble":
					// a treble (G4) on the 2nd staff line
					getCurrentTerm(track.staffName).clef = {y: 1, value: 4};

					break;
				case "bass":
					// a bass (F3) on the 4th staff line
					getCurrentTerm(track.staffName).clef = {y: -1, value: -4};

					break;
				case "tenor":
					// a tenor (C4) on the 3rd staff line
					getCurrentTerm(track.staffName).clef = {y: 0, value: 0};

					break;
				}
			}
			else if (term instanceof KeySignature)
				getCurrentTerm(track.staffName).key = term.key;
			else if (term instanceof OctaveShift)
				getCurrentTerm(track.staffName).octaveShift = term.value;
		};
		new TrackContext(this, {listener}).execute(this.music);

		return pcTerms;
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
	tying: MusicEvent = null;
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
			tick -= event.durationMagnitude * factor * this.factorValue;
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
							pitch._tied = this.tying;
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

			this.tying = null;
			this.staccato = false;

			if (term.isTying)
				this.tying = term;
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
				this.tying = this.event;
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


class MusicPerformance {
	staffNames: string[] = [];
	musicTracks: MusicTrack[] = [];


	getNotation ({logger = new LogRecorder()} = {}): LilyNotation.Notation {
		const pcTerms: PitchContextTerm[] = [].concat(...this.musicTracks.map((track, i) =>
			track.generateStaffTracks().map(term => ({track: i, ...term}))));
		//console.log("pcTerms:", pcTerms);

		const termsToContexts = (staffTerms, trackIndex) => {
			staffTerms.forEach(term => {
				if (term.event)
					term.tick = term.event._tick;
			});
			staffTerms.sort((t1, t2) => t1.tick - t2.tick);

			const context = new LilyStaffContext({logger});
			context.staffTrack = trackIndex;

			logger.append("staffTerms", staffTerms);
			//console.debug("staffTerms:", staffTerms);
			staffTerms.forEach(term => context.executeTerm(term));

			return context;
		};

		const staffContexts: LilyStaffContext[] = [];
		if (this.staffNames.length) {
			this.staffNames.forEach((name, trackIndex) => {
				const staffTerms = pcTerms.filter(term => term.staffName === name);
				staffContexts.push(termsToContexts(staffTerms, trackIndex));
			});
		}
		else
			staffContexts.push(termsToContexts(pcTerms, 0));

		const notes = []
			.concat(...staffContexts.map(context => context.notes))
			.sort((n1, n2) => n1.startTick - n2.startTick);

		const pitchContextGroup = staffContexts.map(context => context.pitchContextTable);

		return {
			notes,
			pitchContextGroup,
		};
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
};



export default class LilyInterpreter {
	variableTable: Map<string, BaseTerm> = new Map();

	// temporary status
	musicTracks: MusicTrack[] = [];
	staffNames: string[] = [];
	musicTrackIndex: number = 0;
	musicPerformance: MusicPerformance;

	version: Version = null;
	language: Language = null;
	header: Block = null;
	includeFiles: Set<string> = new Set;
	statements: BaseTerm[] = [];
	paper: Block = null;
	layout: Block = null;
	scores: Block[] = [];

	layoutMusic: MusicPerformance;
	midiMusic: MusicPerformance;


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

		const varName = LilyInterpreter.trackName(++this.musicTrackIndex);

		context.track.name = varName;

		return new Variable({name: varName});
	}


	interpretDocument (doc: LilyDocument): this {
		this.execute(doc.root);

		return this;
	}


	createMusicPerformance () {
		if (this.musicTracks.length) {
			if (!this.musicPerformance)
				this.musicPerformance = new MusicPerformance();

			this.staffNames.forEach(name => {
				if (!this.musicPerformance.staffNames.some(sn => sn === name))
					this.musicPerformance.staffNames.push(name);
			});
			this.musicTracks.forEach(track => this.musicPerformance.musicTracks.push(track));

			this.staffNames = [];
			this.musicTracks = [];
		}
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
						this.scores.push(sec);

						break;
					}
				}

				this.createMusicPerformance();

				if (this.musicPerformance) {
					this.layoutMusic = this.musicPerformance;
					this.midiMusic = this.musicPerformance;

					this.musicPerformance = null;
				}
			}
		}
		else if (term instanceof Assignment) {
			if (term.key) {
				const value = this.execute(term.value);
				this.variableTable.set(term.key as string, value);
			}
		}
		else if (term instanceof Block) {
			switch (term.head) {
			case "\\score":
				const body = term.body.map(subterm => this.execute(subterm, {execMusic: true}));

				this.musicPerformance = null;

				return new Block({
					block: term.block,
					head: term.head,
					body,
				});
			case "\\layout":
				this.layoutMusic = this.musicPerformance;

				break;
			case "\\midi":
				this.midiMusic = this.musicPerformance;

				break;
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
		else if (term instanceof SimultaneousList) {
			const list = term.list.map(subterm => this.execute(subterm, {execMusic, contextDict})).filter(term => term);
			this.createMusicPerformance();

			return new SimultaneousList({list});
		}
		else if (term instanceof ContextedMusic) {
			if (term.contextDict && typeof term.contextDict.Staff === "string")
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
		if (this.layoutMusic)
			this.layoutMusic.musicTracks.forEach((track, i) => this.variableTable.set(LilyInterpreter.trackName(i + 1), track.music));

		// TODO: process midiMusic
	}


	toDocument (): LilyDocument {
		this.updateTrackAssignments();

		const variables = [].concat(...[this.paper, this.layout, ...this.scores].filter(block => block).map(block => block.findAll(Variable).map(variable => variable.name)));
		const assignments = variables.filter(name => this.variableTable.get(name)).map(name => new Assignment({key: name, value: this.variableTable.get(name)}));
		const includes = Array.from(this.includeFiles).map(filename => Include.create(filename));

		const root = new Root({sections: [
			this.version,
			this.language,
			this.header,
			...includes,
			...this.statements,
			this.paper,
			this.layout,
			...assignments,
			...this.scores,
		].filter(section => section)});

		return new LilyDocument(root);
	}


	sliceMeasures (start: number, count: number) {
		if (this.layoutMusic)
			this.layoutMusic.sliceMeasures(start, count);

		if (this.midiMusic && this.midiMusic !== this.layoutMusic)
			this.midiMusic.sliceMeasures(start, count);
	}


	addIncludeFile (filename: string) {
		this.includeFiles.add(filename);
	}


	getNotation ({logger = new LogRecorder()} = {}): LilyNotation.Notation {
		if (this.midiMusic)
			return this.midiMusic.getNotation({logger});

		return null;
	}
};
