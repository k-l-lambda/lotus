
import {romanize} from "../romanNumeral";
import {WHOLE_DURATION_MAGNITUDE} from "./utils";
import {parseRaw} from "./lilyTerms";

// eslint-disable-next-line
import {BaseTerm, Root, Block, MusicEvent, Repeat, Relative, TimeSignature, Partial, Times, Tuplet, Grace, Clef, KeySignature, OctaveShift, Duration, ChordElement, Chord, MusicBlock, Assignment, Variable, Command, SimultaneousList, ContextedMusic, Primitive, Version, Scheme, Include, Rest} from "./lilyTerms";
// eslint-disable-next-line
import LilyDocument from "./lilyDocument";


interface DurationContextStackStatus {
	factor?: {value: number};
};


type MusicTransformer = (music: BaseTerm, context: StaffContext) => BaseTerm[];


class MusicTrack {
	block: MusicBlock;
	anchorPitch: ChordElement;


	get music (): BaseTerm {
		if (!this.block._parent)
			this.block._parent = new Relative({cmd: "relative", args: [this.anchorPitch.clone(), this.block]});

		return this.block._parent;
	}


	transform (transformer: MusicTransformer) {
		new StaffContext(this, {transformer}).execute(this.music);
	}


	unfoldDurationMultipliers () {
		this.transform((term, context) => {
			if (!(term instanceof MusicEvent) || !term.duration || !term.duration.multipliers || !term.duration.multipliers.length)
				return [term];

			const factor = term.duration.multipliers.reduce((factor, multiplier) => factor * Number(multiplier), 1);
			if (!Number.isInteger(factor) || factor <= 0) {
				console.warn("invalid multiplier:", factor, term.duration.multipliers);
				return [term];
			}

			const timeDenominator = context.time ? context.time.value.denominator : 4;
			const denominator = Math.max(term.duration.denominator, timeDenominator);

			const event = term.clone() as MusicEvent;
			event.duration.multipliers = [];

			// break duration into multiple rest events
			const restCount = (event.duration.magnitude / WHOLE_DURATION_MAGNITUDE) * (factor - 1) * denominator;
			if (!Number.isInteger(restCount))
				console.warn("Rest count is not integear:", restCount, denominator, event.duration.magnitude, factor);

			const rests = Array(Math.floor(restCount)).fill(null).map(() =>
				new Rest({name: "s", duration: new Duration({number: denominator, dots: 0})}));

			return [event, ...rests];
		});
	}


	spreadRelativeBlocks () {
		this.transform((term, context) => {
			if (term instanceof Relative)
				return term.shiftBody(context.pitch);
			else
				return [term];
		});
	}


	spreadRepeatBlocks ({ignoreRepeat = true, keepTailPass = false} = {}) {
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
		this.unfoldDurationMultipliers();
		this.spreadRelativeBlocks();

		if (spreadRepeats)
			this.spreadRepeatBlocks();
	}
};


class StaffContext {
	track: MusicTrack;
	transformer?: MusicTransformer;

	stack: DurationContextStackStatus[] = [];

	// declarations
	clef: Clef = null;
	key: KeySignature = null;
	time: TimeSignature = null;
	octave: OctaveShift = null;

	pitch: ChordElement = null;

	// time status
	tick: number = 0;
	tickInMeasure: number = 0;
	measureSpan: number = WHOLE_DURATION_MAGNITUDE;
	measureIndex: number = 1;
	partialDuration: Duration = null;

	event: MusicEvent = null;
	tying: boolean = false;


	constructor (track = new MusicTrack, {transformer = null}: {transformer?: MusicTransformer} = {}) {
		this.track = track;
		this.transformer = transformer;
	}


	get factor () {
		for (let i = this.stack.length - 1; i >= 0; i--) {
			const status = this.stack[i];
			if (status.factor)
				return status.factor;
		}

		return null;
	}


	get factorValue () {
		return this.factor ? this.factor.value : 1;
	}


	get currentMeasureSpan () {
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


	execute (term: BaseTerm) {
		if (!term) {
			console.warn("null term:", term);
			return;
		}

		term._measure = this.measureIndex;
		term._tick = this.tick;

		if (term instanceof MusicEvent) {
			term._previous = this.event;

			if (term instanceof Chord) {
				this.setPitch(term.absolutePitch);

				// update tied for ChordElement
				if (this.tying && this.event && this.event instanceof Chord) {
					const pitches = new Set(this.event.pitches.map(pitch => pitch.absolutePitch.pitch));
					term.pitches.forEach(pitch => {
						if (pitches.has(pitch.absolutePitch.pitch))
							pitch._tied = true;
						//else
						//	console.log("missed tie:", `${pitch._location.lines[0]}:${pitch._location.columns[0]}`, pitch.absolutePitch.pitch, pitches);
					});
				}
			}

			this.event = term;

			this.elapse(term.durationMagnitude);

			this.tying = false;
			const wave = term.post_events && term.post_events.find(e => e.arg === "~");
			if (wave)
				this.tying = true;
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
		else if (term instanceof TimeSignature)
			this.measureSpan = term.value.value * WHOLE_DURATION_MAGNITUDE;
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
		}
		else if (term instanceof Clef)
			this.clef = term;
		else if (term instanceof KeySignature)
			this.key = term;
		else if (term instanceof TimeSignature)
			this.time = term;
		else if (term instanceof OctaveShift)
			this.octave = term;
		else if (term instanceof Primitive) {
			if (term.exp === "~")
				this.tying = true;
		}
		else {
			if (term.isMusic)
				console.warn("unexpected music term:", term);
		}
	}


	get declarations (): BaseTerm[] {
		return [this.clef, this.key, this.time, this.octave].filter(term => term);
	}
};



export default class LilyInterpreter {
	variableTable: Map<string, BaseTerm> = new Map();

	musicTracks: MusicTrack[] = [];

	version: Version = null;
	header: Block = null;
	statements: BaseTerm[] = [];
	paper: Block = null;
	layout: Block = null;
	score: Block = null;


	static trackName (index: number): string {
		return `Voice_${romanize(index)}`;
	};


	/*eval (term: BaseTerm): BaseTerm {
		return this.execute(term.clone());
	}*/


	interpretMusic (music: BaseTerm): Variable {
		//console.log("interpretMusic:", music);
		const context = new StaffContext();
		context.execute(music.clone());

		this.musicTracks.push(context.track);

		const varName = LilyInterpreter.trackName(this.musicTracks.length);

		return new Variable({name: varName});
	}


	interpretDocument (doc: LilyDocument): this {
		this.execute(doc.root);

		return this;
	}


	execute (term: BaseTerm, {execMusic = false} = {}): BaseTerm {
		if (!term)
			return term;

		if (term instanceof Root) {
			for (const section of term.sections) {
				const sec = this.execute(section, {execMusic: true});
				if (sec instanceof Version)
					this.version = sec;
				else if (sec instanceof Scheme)
					this.statements.push(sec);
				else if (sec instanceof Include)
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
			const result = new MusicBlock({body: term.body.map(subterm => this.execute(subterm)).filter(term => term)});
			if (execMusic) {
				const variable = this.interpretMusic(result);
				return new MusicBlock({body: [variable]});
			}

			return result;
		}
		else if (term instanceof SimultaneousList)
			return new SimultaneousList({list: term.list.map(subterm => this.execute(subterm, {execMusic})).filter(term => term)});
		else if (term instanceof ContextedMusic)
			return new ContextedMusic({head: this.execute(term.head), lyrics: this.execute(term.lyrics), body: this.execute(term.body, {execMusic})});
		else if (term instanceof Command)
			return parseRaw({proto: term.proto, cmd: term.cmd, args: term.args.map(arg => this.execute(arg, {execMusic}))});

		return term;
	}


	toDocument (): LilyDocument {
		// append music track assignments
		this.musicTracks.forEach((track, i) => this.variableTable.set(LilyInterpreter.trackName(i + 1), track.music));

		const variables = [].concat(...[this.paper, this.layout, this.score].map(block => block.findAll(Variable).map(variable => variable.name)));
		const assignments = variables.map(name => new Assignment({key: name, value: this.variableTable.get(name)}));

		const root = new Root({sections: [
			this.version,
			this.header,
			...this.statements,
			...assignments,
			this.paper,
			this.layout,
			this.score,
		].filter(section => section)});

		return new LilyDocument(root);
	}
};
