
import LilyDocument, {MusicBlock, LyricMode, ContextedMusic, SimultaneousList, Variable, Assignment, Command} from "./lilyDocument";



const createPianoRhythmTrack = (voices: MusicBlock[]): LyricMode => {
	// TODO:

	return new LyricMode({cmd: "lyricmode", args: [new MusicBlock({body: []})]});
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

		const lyric = createPianoRhythmTrack(voices);
		// TODO: create with clause at pos[2] in \new command: \with { \override VerticalAxisGroup.staff-affinity = #UP }
		const music = new ContextedMusic({head: new Command({cmd: "new", args: ["Lyrics"]}), body: lyric});

		list.list.splice(upStaffPos + i, 0, music);
	});
};
