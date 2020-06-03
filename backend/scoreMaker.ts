
import {xml2ly, engraveSvg} from "./lilyCommands";
import loadLilyParser from "./loadLilyParserNode";
import {LilyDocument} from "../inc/lilyParser";



const xmlToLyWithMarkup = async (xml: string | Buffer, options: LilyProcessOptions, markup: string): Promise<string> => {
	const lily = await xml2ly(xml, options);

	// copy markup
	if (markup) {
		const parser = await loadLilyParser();
		const docMarkup = new LilyDocument(parser.parse(markup));
		const docSource = new LilyDocument(parser.parse(lily));
	
		const attrS = docSource.globalAttributes();
		const attrM = docMarkup.globalAttributes({readonly: true});

		[
			"staffSize", "paperWidth", "paperHeight", "systemSpacing", "raggedLast",
		].forEach(field => {
			if (attrM[field]) {
				if (typeof attrS[field].value === "object" && attrS[field].value && attrS[field].value.set)
					attrS[field].value.set(attrM[field]);
				else
					attrS[field].value = attrM[field];
			}
		});

		return docSource.toString();
	}

	return lily;
};


const markScore = async (source: string, midi: Buffer): Promise<string> => {
	// TODO:
};



export {
	xmlToLyWithMarkup,
	markScore,
};
