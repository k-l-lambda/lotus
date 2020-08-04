
import {DOMParser, XMLSerializer} from "xmldom";

import * as domUtils from "./domUtils";



const isWordDirection = direction => {
	const directionTypes = domUtils.childrenWithTag(direction, "direction-type");

	for (const dt of directionTypes) {
		if (domUtils.childrenWithTag(dt, "words").length > 0)
			return true;
	}

	return false;
};


const moveWordDirection = measure => {
	//console.log("measure:", measure);
	const words = [];

	for (let i = 0; i < measure.childNodes.length; ++i) {
		const child = measure.childNodes[i];
		switch (child.tagName) {
		case "direction":
			if (isWordDirection(child)) {
				words.push(child);
				measure.removeChild(child);
			}

			break;
		case "note":
			const next = measure.childNodes[i + 1];
			words.forEach(word => {
				if (next)
					measure.insertBefore(word, next);
				else
					measure.appendChild(word);
			});

			return;
		}
	}
};


const preprocessXml = (xml: string, {
	removeMeasureImplicit = true,
	replaceEncoding = true,
	removeNullDynamics = true,
	fixHeadMarkup = true,
	fixBackSlashes = true,
	roundTempo = true,
	escapedWordsDoubleQuotation = true,
	removeTrivialRests = true,
	removeBadMetronome = true,
	removeInvalidHarmonies = true,
	removeAllHarmonies = false,
} = {}): string => {
	if (!removeMeasureImplicit && !replaceEncoding && !removeNullDynamics && !fixHeadMarkup && !fixBackSlashes && !roundTempo
		&& !escapedWordsDoubleQuotation && !removeTrivialRests && !removeBadMetronome && !removeInvalidHarmonies && !removeAllHarmonies)
		return xml;

	const dom = new DOMParser().parseFromString(xml, "text/xml");

	if (replaceEncoding) {
		const headNode = Array.prototype.find.call(dom.childNodes, node => node.tagName === "xml");
		if (headNode)
			headNode.data = headNode.data.replace(/UTF-16/, "UTF-8");
	}

	const needTraverse = removeMeasureImplicit || removeNullDynamics || fixHeadMarkup || fixBackSlashes || roundTempo
		|| escapedWordsDoubleQuotation || removeTrivialRests || removeBadMetronome || removeInvalidHarmonies || removeAllHarmonies;
	if (needTraverse) {
		domUtils.traverse(dom, node => {
			if (removeMeasureImplicit) {
				if (node.tagName === "measure")
					node.removeAttribute("implicit");
			}

			if (removeNullDynamics) {
				if (node.tagName === "other-dynamics") {
					const content = node.textContent;
					if (!/\w/.test(content))
						node.parentNode.removeChild(node);
				}
			}

			if (fixHeadMarkup) {
				if (node.tagName === "measure") {
					//console.log("measure:", node);
					moveWordDirection(node);
				}
			}

			if (fixBackSlashes) {
				if (["words", "credit-words", "text"].includes(node.tagName)) {
					if (/^\\+/.test(node.textContent) || /\\+$/.test(node.textContent)) {
						console.warn("replaced invalid text:", node.textContent);
						node.textContent = node.textContent.replace(/^\\+/, "").replace(/\\+$/, "");
					}
				}
			}

			if (roundTempo) {
				if (node.tagName === "sound") {
					const tempo = Number(node.getAttribute("tempo"));
					if (Number.isFinite(tempo) && Math.floor(tempo) !== tempo)
						node.setAttribute("tempo", Math.round(tempo).toFixed(0));
				}
			}

			if (escapedWordsDoubleQuotation) {
				if (["words", "credit-words", "text"].includes(node.tagName)) {
					if (node.textContent && /"/.test(node.textContent))
						node.textContent = node.textContent.replace(/"/g, "'");
				}
			}

			if (removeTrivialRests) {
				if (node.tagName === "note") {
					if (domUtils.childrenWithTag(node, "rest").length && !domUtils.childrenWithTag(node, "type").length) {
						/*const duration: any = domUtils.childrenWithTag(node, "duration")[0];
						const durationNumber = Number(duration ? duration.textContent : NaN);
						if (durationNumber % 6 !== 0) {
							console.log("invalid rest duration without type:", durationNumber);
							node.parentNode.removeChild(node);
						}*/
						// append an empty tag: <type></type>
						const type = dom.createElement("type");
						node.appendChild(type);
					}
				}
			}

			if (removeBadMetronome) {
				if (node.tagName === "metronome") {
					if (!domUtils.childrenWithTag(node, "per-minute").length) {
						console.warn("metronome without 'per-minute' removed:", node.toString());
						node.parentNode.removeChild(node);
					}
				}
			}

			if (removeInvalidHarmonies || removeAllHarmonies) {
				if (node.tagName === "harmony") {
					if (removeAllHarmonies)
						node.parentNode.removeChild(node);
					else {
						let next = node.nextSibling;
						while (next && !next.tagName)
							next = next.nextSibling;
	
						//console.log("sibling:", next);
						if (!next || next.tagName !== "note") {
							node.parentNode.removeChild(node);
							console.debug("invalid harmony removed:", next && next.tagName);
						}
					}
				}
			}
		});
	}

	//console.log("dom:", dom);

	return new XMLSerializer().serializeToString(dom);
};



export {
	preprocessXml,
};
