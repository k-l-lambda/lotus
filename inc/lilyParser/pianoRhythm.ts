
import {MusicBlock, LyricMode, ContextedMusic, Variable, Assignment, Command, Duration, Lyric, Times, FractionNumber} from "./lilyDocument";
import {WHOLE_DURATION_MAGNITUDE} from "./utils";

// eslint-disable-next-line
import LilyDocument, {SimultaneousList} from "./lilyDocument";



const createPianoRhythmTrack = (voices: MusicBlock[], subdivider: number): LyricMode => {
	const ticks = new Set([].concat(...voices.map(voice => voice.ticks)));
	const granularity = WHOLE_DURATION_MAGNITUDE / subdivider;
	//console.log("ticks:", ticks, granularity);

	const denominator = 2 ** Math.floor(Math.log2(subdivider));
	const duration = new Duration({number: denominator, dots: 0});

	let body = [];
	for (let tick = 0; tick < voices[0].durationMagnitude; tick += granularity) {
		const variable = new Variable({name: ticks.has(tick) ? "dotB" : "dotW"});
		const lyric = new Lyric({content: variable, duration: tick === 0 ? duration.clone() : null});
		body.push(lyric);
	}

	if (denominator !== subdivider) {
		const fraction = new FractionNumber(denominator, subdivider).reduced;
		const times = new Times({cmd: "times", args: [fraction.toString(), new MusicBlock({body})]});
		body = [times];
	}

	return new LyricMode({cmd: "lyricmode", args: [new MusicBlock({body})]});
};


export const createPianoRhythm = (doc: LilyDocument) => {
	const score = doc.root.getBlock("score");
	if (!score) {
		console.warn("no score block");
		return;
	}

	const pianoMusic = score.findFirst(term => term instanceof ContextedMusic && term.type === "PianoStaff") as ContextedMusic;
	//console.log("pianoMusic:", pianoMusic);
	if (!pianoMusic) {
		console.warn("no pianoMusic");
		return;
	}

	const list = pianoMusic.body as SimultaneousList;

	// remove lyrics tracks
	list.list = list.list.filter(music => !(music instanceof ContextedMusic) || music.type !== "Lyrics");

	const staves = list.list.filter(music => music instanceof ContextedMusic &&  music.type === "Staff");
	const upStaffPos = list.list.indexOf(staves[0]) + 1;

	//console.log("staves:", staves);
	staves.forEach((staff, i) => {
		const variables = staff.findAll(Variable).map(variable => variable.name);
		const voices = doc.root.sections.filter(term => term instanceof Assignment && variables.includes(term.key) && term.value.music)
			.map((assignment: Assignment) => assignment.value.music) as MusicBlock[];
		//console.log("voices", voices);

		voices.forEach(voice => voice.allocateMeasures());

		const lyric = createPianoRhythmTrack(voices, doc.noteDurationSubdivider);
		// TODO: create with clause at pos[2] in \new command: \with { \override VerticalAxisGroup.staff-affinity = #UP }
		const music = new ContextedMusic({head: new Command({cmd: "new", args: ["Lyrics"]}), body: lyric});

		list.list.splice(upStaffPos + i, 0, music);
	});

	doc.appendIncludeFile("rhythmSymbols.ly");
};
