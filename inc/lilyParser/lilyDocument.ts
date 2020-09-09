
import _ from "lodash";

import TextSource from "../textSource";
import {LILY_STAFF_SIZE_DEFAULT} from "../constants";
import {
	parseRaw,
	BaseTerm, Assignment, LiteralString, Command, Variable, MarkupCommand, Grace, AfterGrace, Include, Version, Block, InlineBlock,
	Scheme, Chord, BriefChord, MusicBlock, SimultaneousList, ContextedMusic, Divide, Tempo, PostEvent, Primitive, ChordElement, MusicEvent,
	SchemePointer, Comment, Language, StemDirection,
} from "./lilyTerms";
import LilyInterpreter from "./lilyInterpreter";

// eslint-disable-next-line
import {Root} from "./lilyTerms";



type AttributeValue = number | boolean | string | BaseTerm;

interface AttributeValueHandle {
	value: AttributeValue;
};


export interface LilyDocumentAttribute {
	[key: string]: AttributeValueHandle
};

export interface LilyDocumentAttributeReadOnly {
	[key: string]: AttributeValue
};



export default class LilyDocument {
	root: Root;

	cacheInterpreter?: LilyInterpreter;


	constructor (data: object) {
		//console.log("raw data:", data);
		this.root = parseRaw(data);
	}


	toString () {
		return this.root.join();
		//return this.root.serialize();
	}


	interpret ({useCached = true} = {}): LilyInterpreter {
		if (!useCached || !this.cacheInterpreter) {
			this.cacheInterpreter = new LilyInterpreter();
			this.cacheInterpreter.interpretDocument(this);
		}

		return this.cacheInterpreter;
	}


	globalAttributes ({readonly = false} = {}): LilyDocumentAttribute | LilyDocumentAttributeReadOnly {
		const globalStaffSize = this.root.getField("set-global-staff-size");
		const header = this.root.getBlock("header");
		let paper = this.root.getBlock("paper");
		const layoutStaffSize = paper && paper.getField("layout-set-staff-size");
		let staffSize = globalStaffSize || layoutStaffSize;

		if (!readonly) {
			let sectionsDirty = false;

			if (!staffSize) {
				this.root.sections.push(new Scheme({exp: {proto: "SchemeFunction", func: "set-global-staff-size", args: [LILY_STAFF_SIZE_DEFAULT]}}));
				staffSize = this.root.getField("set-global-staff-size");

				sectionsDirty = true;
			}

			// A4 paper size
			const DEFAULT_PAPER_WIDTH = {
				proto: "Assignment",
				key: "paper-width",
				value: {proto: "NumberUnit", number: 21, unit: "\\cm"},
			};
			const DEFAULT_PAPER_HEIGHT = {
				proto: "Assignment",
				key: "paper-height",
				value: {proto: "NumberUnit", number: 29.71, unit: "\\cm"},
			};

			if (!paper) {
				paper = new Block({
					block: "score",
					head: "\\paper",
					body: [DEFAULT_PAPER_WIDTH, DEFAULT_PAPER_HEIGHT],
				});
				this.root.sections.push(paper);

				sectionsDirty = true;
			}

			if (!paper.getField("paper-width")) 
				paper.body.push(parseRaw(DEFAULT_PAPER_WIDTH));

			if (!paper.getField("paper-height")) 
				paper.body.push(parseRaw(DEFAULT_PAPER_HEIGHT));

			if (sectionsDirty)
				this.root.reorderSections();
		}
		else
			staffSize = staffSize || {value: LILY_STAFF_SIZE_DEFAULT};

		const paperPropertyCommon = key => ({
			get value () {
				if (!paper)
					return undefined;

				const item = paper.getField(key);
				if (!item)
					return undefined;

				return item.value;
			},

			set value (value) {
				console.assert(!!paper, "paper is null.");

				const item = paper.getField(key);
				if (item)
					item.value = parseRaw(value);
				else
					paper.body.push(new Assignment({key, value}));
			},
		});

		const paperPropertySchemeToken = key => ({
			get value () {
				if (!paper)
					return undefined;

				const item = paper.getField(key);
				if (!item)
					return undefined;

				return item.value.exp;
			},

			set value (value) {
				console.assert(!!paper, "paper is null.");

				const item = paper.getField(key);
				if (item)
					item.value.exp = value;
				else
					paper.body.push(new Assignment({key, value: {proto: "Scheme", exp: value}}));
			},
		});

		let midiBlock = null;
		const scores = this.root.sections.filter(section => section instanceof Block && section.head === "\\score") as Block[];
		for (const score of scores) {
			midiBlock = score.body.find(term => term instanceof Block && term.head === "\\midi");
			if (midiBlock)
				break;
		}

		const midiTempo = {
			get value (): Tempo {
				return midiBlock && midiBlock.body.find(term => term instanceof Tempo);
			},

			set value (value: Tempo) {
				if (!midiBlock) {
					const score = this.root.getBlock("score");
					if (score) {
						midiBlock = new Block({block: "score", head: "\\midi", body: []});
						score.body.push(midiBlock);
					}
					else
						console.warn("no score block, midiTempo assign failed.");
				}

				if (midiBlock) {
					midiBlock.body = midiBlock.body.filter(term => !(term instanceof Tempo));
					midiBlock.body.push(value);
				}
			},
		};

		const assignments = this.root.entries.filter(term => term instanceof Assignment) as Assignment[];
		const assignmentTable = assignments.reduce((table, assign) => ((table[assign.key.toString()] = assign.query(assign.key)), table), {});

		const attributes = {
			staffSize,
			midiTempo,
			title: header && header.getField("title"),
			composer: header && header.getField("composer"),
			paperWidth: paperPropertyCommon("paper-width"),
			paperHeight: paperPropertyCommon("paper-height"),
			topMargin: paperPropertyCommon("top-margin"),
			bottomMargin: paperPropertyCommon("bottom-margin"),
			leftMargin: paperPropertyCommon("left-margin"),
			rightMargin: paperPropertyCommon("right-margin"),
			systemSpacing: paperPropertySchemeToken("system-system-spacing.basic-distance"),
			topMarkupSpacing: paperPropertySchemeToken("top-markup-spacing.basic-distance"),
			raggedLast: paperPropertySchemeToken("ragged-last"),
			raggedBottom: paperPropertySchemeToken("ragged-bottom"),
			raggedLastBottom: paperPropertySchemeToken("ragged-last-bottom"),
			printPageNumber: paperPropertySchemeToken("print-page-number"),
			...assignmentTable,
		};

		if (readonly)
			Object.keys(attributes).forEach(key => attributes[key] = attributes[key] && attributes[key].value);

		return attributes;
	}


	getVariables (): Set<string> {
		return new Set(this.root.findAll(Variable).map(variable => variable.name));
	}


	// deprecated
	getMusicTracks ({expand = false} = {}): MusicBlock[] {
		const score = this.root.getBlock("score");
		if (!score)
			return null;

		let tracks = [];

		// extract sequential music blocks from score block
		score.forEachTopTerm(MusicBlock, block => {
			tracks.push(block);
		});

		// expand variables in tracks
		if (expand)
			tracks = tracks.map(track => track.clone().expandVariables(this.root));

		return tracks;
	}


	getLocationTickTable (): {[key: string]: number} {
		const notes = this.root.findAll(term => (term instanceof ChordElement) || (term instanceof MusicEvent));

		return notes.reduce((table, note) => {
			if (note._location && Number.isFinite(note._tick))
				table[`${note._location.lines[0]}:${note._location.columns[0]}`] = note._tick;

			return table;
		}, {});
	}


	appendIncludeFile (filename: string) {
		if (!this.root.includeFiles.includes(filename)) {
			const versionPos = this.root.sections.findIndex(term => term instanceof Version);
			this.root.sections.splice(versionPos + 1, 0,
				new Include({cmd: "include", args: [LiteralString.fromString(filename)]}));
		}
	}


	removeStaffGroup () {
		const score = this.root.getBlock("score");
		if (score) {
			score.body.forEach(item => {
				if (item instanceof SimultaneousList)
					item.removeStaffGroup();
			});
		}
	}


	fixTinyTrillSpans () {
		// TODO: replace successive \startTrillSpan & \stopTrillSpan with ^\trill
	}


	removeMusicCommands (cmds: string | string[]) {
		cmds = Array.isArray(cmds) ? cmds : [cmds];

		const isToRemoved = item => (item instanceof Command) && cmds.includes(item.cmd);

		this.root.forEachTerm(MusicBlock, block => {
			block.body = block.body.filter(item => !isToRemoved(item));
		});
	}


	removeTrillSpans () {
		this.removeMusicCommands(["startTrillSpan", "stopTrillSpan"]);
	}


	removeBreaks () {
		this.removeMusicCommands("break");
	}


	removePageBreaks () {
		this.removeMusicCommands("pageBreak");
	}


	scoreBreakBefore (enabled = true) {
		const score = this.root.getBlock("score");
		if (score) {
			let header = score.entries.find((entry: any) => entry.head === "\\header") as Block;
			if (!header) {
				header = new Block({head: "\\header", body: []});
				score.body.push(header);
			}

			let breakbefore = header.getField("breakbefore");
			if (breakbefore) 
				breakbefore = breakbefore.value;
			
			else {
				breakbefore = new Scheme({exp: true});
				header.body.push(new Assignment({key: "breakbefore", value: breakbefore}));
			}

			breakbefore.exp = enabled;
		}
		else
			console.warn("no score block");
	}


	unfoldRepeats () {
		const score = this.root.getBlock("score");
		const musicList = score ? score.body : this.root.sections;

		let count = 0;

		musicList.forEach((term, i) => {
			if (term.isMusic && (term as Command).cmd !== "unfoldRepeats") {
				const unfold = new Command({cmd: "unfoldRepeats", args: [term]});
				musicList.splice(i, 1, unfold);

				++count;
			}
		});

		if (!count)
			console.warn("no music term to unfold");

		return count;
	}


	containsRepeat (): boolean {
		const termContainsRepeat = (term: BaseTerm): boolean => {
			if (!term.entries)
				return false;

			const subTerms = term.entries.filter(term => term instanceof BaseTerm);

			for (const term of subTerms) {
				if ((term as Command).cmd === "repeat")
					return true;
			}

			for (const term of subTerms) {
				if (termContainsRepeat(term))
					return true;
			}

			return false;
		};

		return termContainsRepeat(this.root);
	}


	removeEmptySubMusicBlocks () {
		this.root.forEachTerm(MusicBlock, block => {
			block.body = block.body.filter(term => !(term instanceof MusicBlock && term.body.length === 0));
		});
	}


	mergeContinuousGraces () {
		this.removeEmptySubMusicBlocks();

		const isGraceCommand = term => term instanceof Grace;
		const isGraceInnerTerm = term => isGraceCommand(term) || term instanceof Divide || term instanceof PostEvent;

		this.root.forEachTerm(MusicBlock, block => {
			const groups = [];
			let currentGroup = null;

			block.body.forEach((term, i) => {
				if (currentGroup) {
					if (isGraceInnerTerm(term)) {
						currentGroup.count++;

						if (currentGroup.count === 2)
							groups.push(currentGroup);
					}
					else
						currentGroup = null;
				}
				else {
					if (isGraceCommand(term))
						currentGroup = {start: i, count: 1};
				}
			});

			let offset = 0;
			groups.forEach(group => {
				const startIndex = group.start + offset;
				const mainBody = new MusicBlock({body: []});

				for (let i = startIndex; i < startIndex + group.count; ++ i) {
					const term = block.body[i];
					const music = isGraceCommand(term) ? term.args[0] : term;
					if (music instanceof MusicBlock)
						mainBody.body.push(...music.body);
					else
						mainBody.body.push(music);
				}

				block.body[startIndex].args[0] = mainBody;
				block.body.splice(startIndex + 1, group.count - 1);

				offset -= group.count - 1;
			});
		});
	}


	mergeContinuousEmptyAfterGraces () {
		const isEmptyAfterGrace = term => term instanceof AfterGrace && term.args[0] instanceof MusicBlock && term.args[0].body.length === 0;
		const isGraceInnerTerm = term => isEmptyAfterGrace(term) || term instanceof Divide || term instanceof PostEvent;

		this.root.forEachTerm(MusicBlock, block => {
			const groups = [];
			let currentGroup = null;

			block.body.forEach((term, i) => {
				if (currentGroup) {
					if (isGraceInnerTerm(term)) {
						currentGroup.count++;

						if (currentGroup.count === 2)
							groups.push(currentGroup);
					}
					else
						currentGroup = null;
				}
				else {
					if (isEmptyAfterGrace(term))
						currentGroup = {start: i, count: 1};
				}
			});

			let offset = 0;
			groups.forEach(group => {
				const startIndex = group.start + offset;
				const mainBody = new MusicBlock({body: []});

				for (let i = startIndex; i < startIndex + group.count; ++ i) {
					const term = block.body[i];
					const music = isEmptyAfterGrace(term) ? term.args[1] : term;
					if (music instanceof MusicBlock)
						mainBody.body.push(...music.body);
					else
						mainBody.body.push(music);
				}

				block.body[startIndex].args[1] = mainBody;
				block.body.splice(startIndex + 1, group.count - 1);

				offset -= group.count - 1;
			});
		});
	}


	fixInvalidKeys (mode = "major") {
		this.root.forEachTerm(Command, cmd => {
			if (cmd.cmd === "key") {
				if (cmd.args[1] === "\\none")
					cmd.args[1] = "\\" + mode;
			}
		});
	}


	fixInvalidBriefChords () {
		this.root.forEachTerm(BriefChord, chord => {
			const items = chord.body.items;
			if (items) {
				// merge multiple ^ items
				while (items.filter(item => item === "^").length > 1) {
					const index = items.lastIndexOf("^");
					items.splice(index, 1, ".");
				}
			}
		});
	}


	fixInvalidMarkupWords () {
		this.root.forEachTerm(MarkupCommand, cmd => {
			//console.log("markup:", cmd);
			cmd.forEachTerm(InlineBlock, block => {
				// replace scheme expression by literal string
				block.body = block.body.map(term => {
					if (term instanceof Scheme)
						return LiteralString.fromString(term.join().replace(/\s+$/, ""));

					if (typeof term === "string" && term.includes("$"))
						return LiteralString.fromString(term);

					return term;
				});
			});
		});
	}


	fixNestedRepeat () {
		// \repeat { \repeat { P1 } \alternative { {P2} } } \alternative { {P3} }
		// ->
		// \repeat { P1 } \alternative { {P2} {P3} }
		this.root.forEachTerm(Command, cmd => {
			if (cmd.isRepeatWithAlternative) {
				const block = cmd.args[2];
				const alternative = cmd.args[3].args[0];
				const lastMusic = block.body[block.body.length - 1];
				if (lastMusic && lastMusic.isRepeatWithAlternative) {
					block.body.splice(block.body.length - 1, 1, ...lastMusic.args[2].body);
					alternative.body = [...lastMusic.args[3].args[0].body, ...alternative.body];
				}
			}
		});
	}


	fixEmptyContextedStaff () {
		// staff.1 << >>				staff.2 << voice.1 {} voice.2 {} >>
		// ->
		// staff.1 << voice.1 {} >>		staff.2 << voice.2 {} >>
		const subMusics = (simul: SimultaneousList) => simul.list.filter(term => term instanceof ContextedMusic);

		const score = this.root.getBlock("score");
		score.forEachTerm(SimultaneousList, simul => {
			const staves = simul.list.filter(term => term instanceof ContextedMusic && term.body instanceof SimultaneousList);
			if (staves.length > 1) {
				const staff1 = staves[0].body;
				const staff2 = staves[1].body;

				if (subMusics(staff1).length === 0 && subMusics(staff2).length > 1) {
					const index = staff2.list.findIndex(term => term instanceof ContextedMusic);
					const [music] = staff2.list.splice(index, 1);
					staff1.list.push(music);
				}
			}
		});
	}


	removeEmptyContextedStaff () {
		const subMusics = (simul: SimultaneousList) => simul.list.filter(term => term instanceof ContextedMusic);

		const score = this.root.getBlock("score");
		score.forEachTerm(SimultaneousList, simul => {
			simul.list = simul.list.filter(term => !(term instanceof ContextedMusic) || !(term.body instanceof SimultaneousList)
				|| subMusics(term.body).length > 0);
		});
	}


	redivide () {
		this.root.forEachTopTerm(MusicBlock, (block: MusicBlock) => block.redivide());
	}


	makeMIDIDedicatedScore (): Block {
		const block = this.root.findFirst(term => term instanceof Block && term.head === "\\score" && term.isMIDIDedicated) as Block;
		if (block)
			return block;

		const score = this.root.getBlock("score");
		const newScore = score.clone();

		newScore.body = newScore.body.filter(term => !(term instanceof Block && term.head === "\\layout"));
		score.body = score.body.filter(term => !(term instanceof Block && term.head === "\\midi"));

		this.root.sections.push(newScore);

		return newScore;
	}


	excludeChordTracksFromMIDI () {
		// if there is chord mode music in score, duplicate score block as a dedicated MIDI score which excludes chord mode music.
		let contains = false;

		const isChordMusic = term => term instanceof ContextedMusic
			&& term.head instanceof Command && term.head.args[0] === "ChordNames";

		const isBlock = (head, term) => term instanceof Block && term.head === head;

		const score = this.root.getBlock("score");
		const newScore = score.clone() as Block;
		newScore.forEachTerm(SimultaneousList, simul => {
			const trimmedList = simul.list.filter(term => !isChordMusic(term));
			if (trimmedList.length < simul.list.length) {
				simul.list = trimmedList;
				contains = true;
			}
		});
		newScore._headComment = Comment.createSingle(" midi output");

		if (contains) {
			const trimmedBody = score.body.filter(term => !isBlock("\\midi", term));
			if (trimmedBody.length < score.body.length) {
				score.body = trimmedBody;

				newScore.body = newScore.body.filter(term => !isBlock("\\layout", term));
				this.root.sections.push(newScore);
			}
		}
	}


	// generate tied notehead location candidates
	getTiedNoteLocations (source: TextSource): [number, number][] {
		const chordPairs: [Chord, Chord][] = [];

		const hasMusicBlock = term => {
			if (term instanceof MusicBlock)
				return true;

			if (term instanceof Command)
				return term.args.filter(arg => arg instanceof MusicBlock).length > 0;

			return false;
		};

		this.root.forEachTerm(MusicBlock, (block: MusicBlock) => {
			for (const voice of block.voices) {
				let lastChord: Chord = null;
				let tying = false;
				let afterBlock = false;
				let atHead = true;

				for (const chunk of voice.body) {
					for (const term of chunk.terms) {
						if (term instanceof Primitive && term.exp === "~") {
							tying = true;
							afterBlock = false;
						}
						else if (hasMusicBlock(term)) {
							afterBlock = true;
							tying = false;
							//console.log("afterBlock:", term);
						}
						else if (term instanceof Chord) {
							if (tying && lastChord) 
								chordPairs.push([lastChord, term]);
							// maybe there is a tie at tail of the last block
							else if (afterBlock)
								chordPairs.push([null, term]);
							// maybe there is a tie before the current block
							else if (atHead)
								chordPairs.push([null, term]);

							// PENDING: maybe some user-defined command block contains tie at tail.

							atHead = false;
							afterBlock = false;
							tying = false;
							lastChord = term;

							if (term.post_events) {
								for (const event of term.post_events) {
									if (event.arg === "~")
										tying = true;
								}
							}
						}
					}
				}
			}
		});

		//console.log("chordPairs:", chordPairs);

		const locations = [];

		chordPairs.forEach(pair => {
			const forePitches = pair[0] && new Set(pair[0].pitchNames);

			const chordSource = source.slice(pair[1]._location.lines, pair[1]._location.columns);
			const pitchColumns = TextSource.matchPositions(/\w+/g, chordSource);

			pair[1].pitchNames
				.map((pitch, index) => ({pitch, index}))
				.filter(({pitch}) => !forePitches || forePitches.has(pitch) || pitch === "q")
				.forEach(({index}) => locations.push([
					pair[1]._location.lines[0],	// line
					pair[1]._location.columns[0] + pitchColumns[index],	// column
				]));
		});

		return locations;
	}


	// generate tied notehead location candidates
	getTiedNoteLocations2 (): [number, number][] {
		const locations = [];

		this.root.forEachTerm(Chord, chord => chord.pitches.forEach(pitch => {
			if (pitch._tied)
				locations.push([pitch._location.lines[0], pitch._location.columns[0]]);
		}));

		return locations;
	}


	/*removeAloneSpacer () {
		this.root.forEachTopTerm(MusicBlock, block => {
			const aloneSpacers = cc(block.musicChunks.filter(chunk => chunk.size === 1 && chunk.terms[0].isSpacer).map(chunk => chunk.terms));
			//console.log("aloneSpacers:", aloneSpacers.map(s => s._location));

			if (aloneSpacers.length) {
				const removeInBlock = block => block.body = block.body.filter(term => !aloneSpacers.includes(term));

				removeInBlock(block);
				block.forEachTerm(MusicBlock, removeInBlock);
			}
		});
	}*/


	unfoldDurationMultipliers () {
		this.root.forEachTerm(MusicBlock, block => {
			block.unfoldDurationMultipliers();
		});
	}


	useMidiInstrumentChannelMapping () {
		const midiBlock = this.root.findFirst(term => term instanceof Block && term.head === "\\midi") as Block;
		if (!midiBlock) {
			console.warn("no MIDI block found.");
			return;
		}

		const channelMapping = midiBlock.findFirst(term => term instanceof Assignment && term.key === "midiChannelMapping") as Assignment;
		if (channelMapping)
			channelMapping.value = new Scheme({exp: new SchemePointer({value: "instrument"})});
		else {
			midiBlock.body.push(parseRaw({
				proto: "Block",
				block: "context",
				head: "\\context",
				body: [
					{proto: "Command",cmd: "Score",args: []},
					{proto: "Assignment", key: "midiChannelMapping", value: {proto: "Scheme", exp: {proto: "SchemePointer", value: "instrument"}}},
				],
			}));
		}
	}


	formalize () {
		if (!this.root.findFirst(Version))
			this.root.sections.unshift(Version.default);

		if (!this.root.findFirst(Language))
			this.root.sections.splice(1, 0, Language.make("english"));

		if (!this.root.getBlock("header"))
			this.root.sections.splice(2, 0, new Block({block: "header", head: "\\header", body:[]}));

		if (!this.root.getBlock("score")) {
			const topMusics = this.root.sections.filter(section => section.isMusic);
			this.root.sections = this.root.sections.filter(section => !section.isMusic);

			const score = new Block({block: "score", head: "\\score", body: [
				...topMusics,
				new Block({block: "score", head: "\\layout", body: []}),
				new Block({block: "score", head: "\\midi", body: []}),
			]});

			this.root.sections.push(score);
		}
	}


	convertStaffToPianoStaff () {
		const score = this.root.getBlock("score");
		if (score) {
			const pstaff = score.findFirst(term => term instanceof ContextedMusic && term.head.cmd === "new" && term.head.args[0] === "Staff") as ContextedMusic;
			if (pstaff) {
				pstaff.head.args[0] = "PianoStaff";

				if (pstaff.body instanceof SimultaneousList) {
					pstaff.body.list = [].concat(...pstaff.body.list.map(term => {
						if (term instanceof ContextedMusic) {
							const subMusics = term.list.filter(sub => sub instanceof ContextedMusic);

							return subMusics.map(music => {
								const staff = term.clone();
								staff.list = [
									...term.list.filter(sub => !(sub instanceof ContextedMusic)),
									music,
								];

								staff.head.cmd = "new";

								return staff;
							});
						}
						else
							return [term];
					}));
				}
			}
		}
	}


	pruneStemDirections () {
		this.root.forEachTerm(MusicBlock, block => {
			let direction = null;
			const redundants = [];

			block.body.forEach(term => {
				if (term instanceof StemDirection) {
					if (term.direction === direction)
						redundants.push(term);
					else
						direction = term.direction;
				}
				else if (term instanceof Command && term.findFirst(MusicBlock))
					direction = null;
			});

			block.body = block.body.filter(term => !redundants.includes(term));
		});
	}


	removeRepeats () {
		this.root.forEachTerm(MusicBlock, block => block.spreadRepeatBlocks());
	}


	articulateMIDIOutput () {
		const ARTICULATE_FILENAME = "articulate.ly";

		const midiScore = this.makeMIDIDedicatedScore();

		if (!this.root.includeFiles.includes(ARTICULATE_FILENAME)) {
			let pos = this.root.sections.indexOf(midiScore);
			if (pos < 0)
				pos = Math.min(this.root.sections.length, 3);
			this.root.sections.splice(pos, 0, Include.create(ARTICULATE_FILENAME));
		}

		midiScore.body = midiScore.body.map(term => {
			if (term.isMusic && !(term instanceof Command && term.cmd === "articulate"))
				return new Command({cmd: "articulate", args: [term]});

			return term;
		});
	}
};
