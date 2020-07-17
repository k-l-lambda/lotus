
import LilyDocument, {MusicBlock, LyricMode, ContextedMusic, SimultaneousList} from "./lilyDocument";



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
	console.log("staves:", staves);
	//staves.forEach(staff => {
	// TODO: createPianoRhythmTrack for all voice in this staff
	//});
};
