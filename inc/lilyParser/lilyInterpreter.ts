
import {WHOLE_DURATION_MAGNITUDE} from "./utils";
import {parseRaw, Primitive} from "./lilyTerms";

// eslint-disable-next-line
import {BaseTerm, Root, Block, MusicEvent, Repeat, Relative, TimeSignature, Partial, Times, Tuplet, Grace, Clef, KeySignature, OctaveShift, Duration, ChordElement, Chord, MusicBlock, Assignment, Variable, Command, SimultaneousList, ContextedMusic} from "./lilyTerms";



interface DurationContextStackStatus {
	factor?: {value: number};
};


class StaffContext {
	track: MusicBlock = null;

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


	constructor ({anchorPitch = null} = {}) {
		this.pitch = anchorPitch;
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
			if (term instanceof Chord) {
				this.pitch = term.absolutePitch;

				// update tied for ChordElement
				if (this.event && this.event instanceof Chord) {
					const pitches = new Set(this.event.pitches.map(pitch => pitch.absolutePitch.pitch));
					term.pitches.forEach(pitch => {
						if (pitches.has(pitch.absolutePitch.pitch))
							pitch._tied = true;
					});
				}
			}

			term._previous = this.event;
			this.event = term;

			this.elapse(term.durationMagnitude);

			this.tying = false;
			const wave = term.post_events && term.post_events.find(e => e.arg === "~");
			if (wave)
				this.tying = true;
		}
		else if (term instanceof MusicBlock) {
			if (!this.track)
				this.track = term;

			term.updateChordAnchors();

			for (const subterm of term.body)
				this.execute(subterm);
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
				this.pitch = term.anchor;

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

	musicTracks: MusicBlock[] = [];


	eval (term: BaseTerm): BaseTerm {
		return this.execute(term.clone());
	}


	interpretMusic (music: BaseTerm) {
		//console.log("interpretMusic:", music);
		const context = new StaffContext();
		context.execute(music);

		this.musicTracks.push(context.track);
	}


	execute (term: BaseTerm, {execMusic = false} = {}): BaseTerm {
		if (!term)
			return term;

		if (term instanceof Root) {
			for (const section of term.sections) 
				this.execute(section, {execMusic: true});
		}
		else if (term instanceof Assignment) {
			const value = this.execute(term.value);
			this.variableTable.set(term.key as string, value);
		}
		else if (term instanceof Block) {
			if (term.block === "score") {
				for (const subterm of term.body) 
					this.execute(subterm, {execMusic: true});
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
			if (execMusic)
				this.interpretMusic(result);

			return result;
		}
		else if (term instanceof SimultaneousList)
			return new SimultaneousList({list: term.list.map(subterm => this.execute(subterm, {execMusic})).filter(term => term)});
		else if (term instanceof ContextedMusic)
			return new ContextedMusic({head: this.execute(term.head), lyrics: this.execute(term.lyrics), body: this.execute(term.body, {execMusic})});
		else if (term instanceof Command) {
			const result = parseRaw({proto: term.proto, cmd: term.cmd, args: term.args.map(arg => this.execute(arg))});
			if (execMusic && result.isMusic)
				this.interpretMusic(result);

			return result;
		}

		return term;
	}
};
