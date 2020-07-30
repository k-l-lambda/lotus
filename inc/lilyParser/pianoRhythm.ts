
import {WHOLE_DURATION_MAGNITUDE, FractionNumber} from "./utils";
import {MusicBlock, LyricMode, ContextedMusic, Variable, Command, Duration, Lyric, Times} from "./lilyTerms";

// eslint-disable-next-line
import LilyInterpreter, {MusicTrack} from "./lilyInterpreter";
// eslint-disable-next-line
import {SimultaneousList} from "./lilyTerms";



const createPianoRhythmTrack = (voices: MusicTrack[], subdivider: number, {color = null}: {color?: string} = {}): LyricMode => {
	const ticks = new Set([].concat(...voices.map(voice => voice.block.noteTicks)));	// TODO: use voice.noteTicks
	const granularity = WHOLE_DURATION_MAGNITUDE / subdivider;
	//console.log("ticks:", ticks, granularity);

	const denominator = 2 ** Math.floor(Math.log2(subdivider));
	const duration = new Duration({number: denominator, dots: 0});

	let body = [];
	if (color)
		body.push(new Variable({name: color}));

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


interface PianoRhythmOptions {
	colored?: boolean;
	numberTrack?: boolean;
	dotTracks?: boolean;
};


export const createPianoRhythm = (interpreter: LilyInterpreter, {dotTracks = true, numberTrack, colored}: PianoRhythmOptions = {}) => {
	console.assert(!!interpreter.score, "interpreter.score is null.");

	const pianoMusic = interpreter.score.findFirst(term => term instanceof ContextedMusic && term.type === "PianoStaff") as ContextedMusic;
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

	interpreter.updateTrackAssignments();

	//console.log("staves:", staves);
	if (dotTracks) {
		staves.forEach((staff, i) => {
			const variables = staff.findAll(Variable).map(variable => variable.name);
			const voices = interpreter.musicTracks.filter(track => variables.includes(track.name));

			const color = i ? "lyrGreen" : "lyrRed";

			const lyric = createPianoRhythmTrack(voices, interpreter.getNoteDurationSubdivider(), {color: colored ? color : null});
			// TODO: create with clause at pos[2] in \new command: \with { \override VerticalAxisGroup.staff-affinity = #UP }
			const music = new ContextedMusic({head: new Command({cmd: "new", args: ["Lyrics"]}), body: lyric});

			list.list.splice(upStaffPos + i, 0, music);
		});
	}

	if (numberTrack) {
		const pos = upStaffPos + (dotTracks ? 1 : 0);

		// TODO: fill the music body with numbers
		const lyric = new LyricMode({cmd: "lyricmode", args: [new MusicBlock({body: []})]});
		const music = new ContextedMusic({head: new Command({cmd: "new", args: ["Lyrics"]}), body: lyric});

		list.list.splice(pos, 0, music);
	}

	interpreter.addIncludeFile("rhythmSymbols.ly");
};
