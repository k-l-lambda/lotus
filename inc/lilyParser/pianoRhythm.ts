
import {WHOLE_DURATION_MAGNITUDE, FractionNumber} from "./utils";
import {MusicBlock, LyricMode, ContextedMusic, Variable, Command, Duration, Lyric, Times, LiteralString} from "./lilyTerms";

// eslint-disable-next-line
import LilyInterpreter, {MusicTrack} from "./lilyInterpreter";
// eslint-disable-next-line
import {SimultaneousList} from "./lilyTerms";



const COLOR_NAMES = [
	"lyrGray",
	"lyrRed",
	"lyrGreen",
	"lyrYellow",
];


const createPianoRhythmTrack = ({ticks, durationMagnitude, subdivider, color = null}: {
	ticks: Set<number>,
	durationMagnitude: number,
	subdivider: number,
	color?: string,
}): LyricMode => {
	const granularity = WHOLE_DURATION_MAGNITUDE / subdivider;
	//console.log("ticks:", ticks, granularity);

	const denominator = 2 ** Math.floor(Math.log2(subdivider));
	const duration = new Duration({number: denominator, dots: 0});

	let body = [];
	if (color)
		body.push(new Variable({name: color}));

	for (let tick = 0; tick < durationMagnitude; tick += granularity) {
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


const createPianoNumberTrack = ({durationMagnitude, subdivider, measureTicks, trackTicks, colored}: {
	durationMagnitude: number,
	subdivider: number,
	measureTicks: [number, number][],
	trackTicks: Set<number>[],
	colored?: boolean,
}): LyricMode => {
	const granularity = WHOLE_DURATION_MAGNITUDE / subdivider;

	const denominator = 2 ** Math.floor(Math.log2(subdivider));
	const duration = new Duration({number: denominator, dots: 0});

	const words = [];
	let number = 1;
	for (let tick = 0; tick < durationMagnitude; tick += granularity) {
		// eslint-disable-next-line
		if (measureTicks.some(([_, t]) => t === tick))
			number = 1;

		let type = 0;
		trackTicks.forEach((track, i) => track.has(tick) && (type += 2 ** i));

		words.push({number, type});

		++number;
	}

	const body = [].concat(...words.map(({number, type}, i) => [
		colored ? new Variable({name: COLOR_NAMES[type]}) : null,
		new Lyric({content: LiteralString.fromString(number.toString()), duration: i === 0 ? duration.clone() : null}),
	])).map(term => term);

	return new LyricMode({cmd: "lyricmode", args: [new MusicBlock({body})]});
};


interface PianoRhythmOptions {
	colored?: boolean;
	numberTrack?: boolean;
	dotTracks?: boolean;
};


export const createPianoRhythm = (interpreter: LilyInterpreter, {dotTracks = true, numberTrack, colored}: PianoRhythmOptions = {}) => {
	console.assert(interpreter.scores.length, "interpreter.scores is empty.");

	const pianoMusic = interpreter.scores[0].findFirst(term => term instanceof ContextedMusic && term.type === "PianoStaff") as ContextedMusic;
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


	const layoutMusic = interpreter.layoutMusic;

	const trackTicks: Set<number>[] = staves.map(staff => {
		const variables = staff.findAll(Variable).map(variable => variable.name);
		const voices = layoutMusic.musicTracks.filter(track => variables.includes(track.name));

		return new Set([].concat(...voices.map(voice => voice.block.noteTicks)));
	});

	const subdivider = layoutMusic.getNoteDurationSubdivider();
	const durationMagnitude = layoutMusic.musicTracks[0].durationMagnitude;

	//console.log("staves:", staves);
	if (dotTracks) {
		trackTicks.forEach((ticks, i) => {
			const color = COLOR_NAMES[2 ** Math.min(i, 1)];

			const lyric = createPianoRhythmTrack({ticks, durationMagnitude, subdivider, color: colored ? color : null});
			// TODO: create with clause at pos[2] in \new command: \with { \override VerticalAxisGroup.staff-affinity = #UP }
			const music = new ContextedMusic({head: new Command({cmd: "new", args: ["Lyrics"]}), body: lyric});

			list.list.splice(upStaffPos + i, 0, music);
		});
	}

	if (numberTrack) {
		const pos = upStaffPos + (dotTracks ? 1 : 0);

		const measureTicks = layoutMusic.musicTracks[0].block.measureTicks;

		const lyric = createPianoNumberTrack({durationMagnitude, subdivider, measureTicks, trackTicks, colored});
		const music = new ContextedMusic({head: new Command({cmd: "new", args: ["Lyrics"]}), body: lyric});

		list.list.splice(pos, 0, music);
	}

	interpreter.addIncludeFile("rhythmSymbols.ly");
};
