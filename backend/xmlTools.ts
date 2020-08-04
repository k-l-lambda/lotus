
import {DOMParser, XMLSerializer} from "xmldom";

import * as domUtils from "./domUtils";



const isWordDirection = direction => {
	const directionTypes = domUtils.childrenWithTag(direction, "direction-type");

	for (const dt of directionTypes) {
		if (domUtils.hasChildrenWithTag(dt, "words"))
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
	fixChordVoice = true,
	fixBarlines = true,
	removeInvalidClef = true,
} = {}): string => {
	if (!removeMeasureImplicit && !replaceEncoding && !removeNullDynamics && !fixHeadMarkup && !fixBackSlashes && !roundTempo
		&& !escapedWordsDoubleQuotation && !removeTrivialRests && !removeBadMetronome && !removeInvalidHarmonies && !removeAllHarmonies
		&& !fixChordVoice && !fixBarlines)
		return xml;

	const dom = new DOMParser().parseFromString(xml, "text/xml");

	if (replaceEncoding) {
		const headNode = Array.prototype.find.call(dom.childNodes, node => node.tagName === "xml");
		if (headNode)
			headNode.data = headNode.data.replace(/UTF-16/, "UTF-8");
	}

	const needTraverse = removeMeasureImplicit || removeNullDynamics || fixHeadMarkup || fixBackSlashes || roundTempo
		|| escapedWordsDoubleQuotation || removeTrivialRests || removeBadMetronome || removeInvalidHarmonies || removeAllHarmonies
		|| fixChordVoice || fixBarlines;
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
						console.debug("replaced invalid text:", node.textContent);
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
					if (domUtils.hasChildrenWithTag(node, "rest") && !domUtils.hasChildrenWithTag(node, "type")) {
						// append an empty tag: <type></type>
						const type = dom.createElement("type");
						node.appendChild(type);
					}
				}
			}

			if (removeBadMetronome) {
				if (node.tagName === "metronome") {
					if (!domUtils.hasChildrenWithTag(node, "per-minute")) {
						console.debug("metronome without 'per-minute' removed:", node.toString());
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

			if (fixChordVoice) {
				if (node.tagName === "note" && domUtils.hasChildrenWithTag(node, "chord") && !domUtils.hasChildrenWithTag(node, "voice")) {
					//console.log("bad note:", node);
					const previousNote = domUtils.findPreviousSibling(node, "note");
					if (previousNote) {
						const voice = domUtils.childrenWithTag(previousNote, "voice")[0];
						//console.log("chord voice:", node, voice);
						if (voice)
							node.appendChild(voice.cloneNode(true));
					}
				}
			}

			if (fixBarlines) {
				if (node.tagName === "barline") {
					if ((node.getAttribute("location") === "right" || domUtils.hasChildrenWithTag(node, "bar-style"))
						&& domUtils.findNextSibling(node, "backup")) {
						// move the barline to the end of this measure
						node.parentNode.removeChild(node);
						node.parentNode.appendChild(node);
					}
				}
			}

			if(removeInvalidClef) {
				if (node.tagName === "attributes") {
					const clef = domUtils.childrenWithTag(node, "clef")[0];
					if (clef) {
						const n = Number(clef.getAttribute("number"));
						if (!domUtils.findPreviousSibling(node, "backup") && n > 1) {
							node.parentNode.removeChild(node);
							console.debug("invalid clef removed:", n);
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
