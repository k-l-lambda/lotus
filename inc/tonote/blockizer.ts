
import * as lilyParser from "../lilyParser";



interface VoiceMeasure {
	terms: lilyParser.BaseTerm[];
	staff: string;
};

type SystemMeasure = VoiceMeasure[];

interface BlockSong {
	measures: SystemMeasure[];
	anchors: string[];
};


const blockizeLily = (doc: lilyParser.LilyDocument): BlockSong => {
	const interpreter = doc.interpret();
	const tracks = interpreter.layoutMusic.musicTracks;

	const measureCount = Math.max(...tracks[0].block.measures);
	const song: BlockSong = {
		anchors: [],
		measures: Array(measureCount).fill(null).map(() => []),
	};

	tracks.forEach((track, i) => {
		if (!track.anchorPitch)
			return;
		song.anchors.push(track.anchorPitch.pitch);

		track.flatten({spreadRepeats: true});
		const chunkMap = track.block.measureChunkMap;

		for (const [m, chunk] of chunkMap.entries()) {
			const mi = Number(m) - 1;
			if (!song.measures[mi]) {
				console.warn("missing measure:", mi, song.measures.length);
				break;
			}
			song.measures[mi][i] = {
				staff: track.contextDict.Staff,
				terms: chunk.terms,
			};
		}
	});

	song.measures = song.measures.filter(measure => measure.length);

	return song;
};


const cc = <T>(arrays: T[][]): T[] => [].concat(...arrays);


const joinSeries = (serieses: string[][], seperator: string): string[] => serieses.reduce((result, series) => {
	if (result.length)
		result.push(seperator);
	result.push(...series);

	return result;
}, []);


const splitPitch = (token: string): string[] => {
	if (/^[abcdefgh]/.test(token)) {
		const chars = token.split("");

		return chars.reduce((series, char) => series.length === 1 && /[a-z]/.test(char) ? [series[0] + char] : [...series, char], []);
	}

	return [token];
};


const serilizeTerms = (terms: lilyParser.BaseTerm[]): string[] => {
	const series0 = cc(terms.map(term => term.serialize()));
	const series1 = series0.map(token => Number.isFinite(token) ? token.toString() : token);
	const series2 = series1.filter(token =>
		typeof token === "string"
		&& !/^\s$/.test(token)
		&& token !== "\b");

	// split pitch word
	const series3: string[] = cc(series2.map(splitPitch));

	return series3.map(token => token.replace(/\n/g, ""));
};


const serilizeAnchor = (anchor: string): string[] => ["<anchor>", ...anchor.split(""), "</anchor>"];


const melodySeriesFromSong = (song: BlockSong): string[] => {
	// suppose the first track is melody track
	const measures = song.measures.filter(measure => measure[0]).map(measure => serilizeTerms(measure[0].terms));

	return serilizeAnchor(song.anchors[0]).concat(joinSeries(measures, "|"));
};


// TODO:
//const encodeSeriesToLy = (tokens: string[]): string => {};



export {
	blockizeLily,
	serilizeTerms,
	melodySeriesFromSong,
};
