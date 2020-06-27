
// eslint-disable-next-line
import LilyDocument from "./lilyDocument";
import {BaseTerm} from "./lilyDocument";



type MeasureLocationTable = {[key: number]: {[key: number]: number}};


const assignMeasures = (doc: LilyDocument, locationTable: MeasureLocationTable) => {
	doc.root.forEachTerm(BaseTerm, term => {
		if (term.location) {
			for (let line = term.location.lines[0]; line <= term.location.lines[1]; ++line) {
				const lineTable = locationTable[line];
				if (lineTable) {
					const item = Object.entries(lineTable).find(([key]) => {
						const column = Number(key);
						return column >= term.location.columns[0] && column < term.location.columns[1];
					});

					if (item) {
						term.measure = item[1];
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
