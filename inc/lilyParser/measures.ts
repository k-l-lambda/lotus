
import {BaseTerm} from "./lilyTerms";

// eslint-disable-next-line
import LilyDocument from "./lilyDocument";



type MeasureLocationTable = {[key: number]: {[key: number]: number}};


const assignMeasures = (doc: LilyDocument, locationTable: MeasureLocationTable) => {
	doc.root.forEachTerm(BaseTerm, term => {
		if (term._location) {
			for (let line = term._location.lines[0]; line <= term._location.lines[1]; ++line) {
				const lineTable = locationTable[line];
				if (lineTable) {
					const item = Object.entries(lineTable).find(([key]) => {
						const column = Number(key);
						return column >= term._location.columns[0] && column < term._location.columns[1];
					});

					if (item) {
						term._measure = item[1];
						break;
					}
				}
			}
		}
	});
};



export {
	assignMeasures,
};
