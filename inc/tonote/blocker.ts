
import * as lilyParser from "../lilyParser";



interface VoiceMeasure {
	terms: lilyParser.BaseTerm[];
	staff: string;
};

type SystemMeasure = VoiceMeasure[];
type BlockSong = SystemMeasure[];


const blockizeLily = (doc: lilyParser.LilyDocument): BlockSong => {
	const interpreter = doc.interpret();
	const tracks = interpreter.layoutMusic.musicTracks;
	/*for (const track of tracks) {
		track.flatten({spreadRepeats: true});
		const chunkMap = track.block.measureChunkMap;
		console.log("chunkMap:", chunkMap);
	}*/

	const measureCount = Math.max(...tracks[0].block.measures);
	const song: BlockSong = Array(measureCount).fill(null).map(() => []);

	tracks.forEach((track, i) => {
		track.flatten({spreadRepeats: true});
		const chunkMap = track.block.measureChunkMap;

		for (const [m, chunk] of chunkMap.entries()) {
			const mi = Number(m) - 1;
			song[mi][i] = {
				staff: track.contextDict.Staff,
				terms: chunk.terms,
			};
		}
	});

	return song;
};



export {
	blockizeLily,
};
