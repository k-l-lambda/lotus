
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


const cc = <T>(arrays: T[][]): T[] => [].concat(...arrays);


const joinSeries = (serieses: string[][], seperator: string): string[] => serieses.reduce((result, series) => {
	if (result.length)
		result.push(seperator);
	result.push(...series);

	return result;
}, []);


const serilizeTerms = (terms: lilyParser.BaseTerm[]): string[] => {
	const series0 = cc(terms.map(term => term.serialize()));
	const series1 = series0.map(token => Number.isFinite(token) ? token.toString() : token);
	const series2 = series1.filter(token =>
		typeof token === "string"
		&& !/^\s$/.test(token)
		&& token !== "\b");

	// split pitch word
	const series3: string[] = cc(series2.map(token => {
		if (/^[abcdefgh]/.test(token))
			return token.split("");

		return [token];
	}));

	return series3.map(token => token.replace(/\n/g, ""));
};


const melodySeriesFromSong = (song: BlockSong): string[] => {
	const measures = song.map(measure => serilizeTerms(measure[0].terms));

	return joinSeries(measures, "|");
};



export {
	blockizeLily,
	serilizeTerms,
	melodySeriesFromSong,
};
