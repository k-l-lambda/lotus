
import Vue from "vue";

import SheetLive from "./components/sheet-live.vue";
import SheetSigns from "./components/sheet-signs.vue";



// eslint-disable-next-line
declare class SheetDocument {};


const SheetLiveComponent = Vue.extend(SheetLive);
const SheetSignsComponent = Vue.extend(SheetSigns);


const SVG_DTD = `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"
  [<!ENTITY quot "&#34;">  <!ENTITY amp "&#38;">  <!ENTITY apos "&#39;">  <!ENTITY lt "&#60;">  <!ENTITY gt "&#62;">  <!ENTITY nbsp "&#160;">  <!ENTITY iexcl "&#161;">  <!ENTITY cent "&#162;">  <!ENTITY pound "&#163;">  <!ENTITY curren "&#164;">  <!ENTITY yen "&#165;">  <!ENTITY brvbar "&#166;">  <!ENTITY sect "&#167;">  <!ENTITY uml "&#168;">  <!ENTITY copy "&#169;">  <!ENTITY ordf "&#170;">  <!ENTITY laquo "&#171;">  <!ENTITY not "&#172;">  <!ENTITY shy "&#173;">  <!ENTITY reg "&#174;">  <!ENTITY macr "&#175;">  <!ENTITY deg "&#176;">  <!ENTITY plusmn "&#177;">  <!ENTITY sup2 "&#178;">  <!ENTITY sup3 "&#179;">  <!ENTITY acute "&#180;">  <!ENTITY micro "&#181;">  <!ENTITY para "&#182;">  <!ENTITY middot "&#183;">  <!ENTITY cedil "&#184;">  <!ENTITY sup1 "&#185;">  <!ENTITY ordm "&#186;">  <!ENTITY raquo "&#187;">  <!ENTITY frac14 "&#188;">  <!ENTITY frac12 "&#189;">  <!ENTITY frac34 "&#190;">  <!ENTITY iquest "&#191;">  <!ENTITY Agrave "&#192;">  <!ENTITY Aacute "&#193;">  <!ENTITY Acirc "&#194;">  <!ENTITY Atilde "&#195;">  <!ENTITY Auml "&#196;">  <!ENTITY Aring "&#197;">  <!ENTITY AElig "&#198;">  <!ENTITY Ccedil "&#199;">  <!ENTITY Egrave "&#200;">  <!ENTITY Eacute "&#201;">  <!ENTITY Ecirc "&#202;">  <!ENTITY Euml "&#203;">  <!ENTITY Igrave "&#204;">  <!ENTITY Iacute "&#205;">  <!ENTITY Icirc "&#206;">  <!ENTITY Iuml "&#207;">  <!ENTITY ETH "&#208;">  <!ENTITY Ntilde "&#209;">  <!ENTITY Ograve "&#210;">  <!ENTITY Oacute "&#211;">  <!ENTITY Ocirc "&#212;">  <!ENTITY Otilde "&#213;">  <!ENTITY Ouml "&#214;">  <!ENTITY times "&#215;">  <!ENTITY Oslash "&#216;">  <!ENTITY Ugrave "&#217;">  <!ENTITY Uacute "&#218;">  <!ENTITY Ucirc "&#219;">  <!ENTITY Uuml "&#220;">  <!ENTITY Yacute "&#221;">  <!ENTITY THORN "&#222;">  <!ENTITY szlig "&#223;">  <!ENTITY agrave "&#224;">  <!ENTITY aacute "&#225;">  <!ENTITY acirc "&#226;">  <!ENTITY atilde "&#227;">  <!ENTITY auml "&#228;">  <!ENTITY aring "&#229;">  <!ENTITY aelig "&#230;">  <!ENTITY ccedil "&#231;">  <!ENTITY egrave "&#232;">  <!ENTITY eacute "&#233;">  <!ENTITY ecirc "&#234;">  <!ENTITY euml "&#235;">  <!ENTITY igrave "&#236;">  <!ENTITY iacute "&#237;">  <!ENTITY icirc "&#238;">  <!ENTITY iuml "&#239;">  <!ENTITY eth "&#240;">  <!ENTITY ntilde "&#241;">  <!ENTITY ograve "&#242;">  <!ENTITY oacute "&#243;">  <!ENTITY ocirc "&#244;">  <!ENTITY otilde "&#245;">  <!ENTITY ouml "&#246;">  <!ENTITY divide "&#247;">  <!ENTITY oslash "&#248;">  <!ENTITY ugrave "&#249;">  <!ENTITY uacute "&#250;">  <!ENTITY ucirc "&#251;">  <!ENTITY uuml "&#252;">  <!ENTITY yacute "&#253;">  <!ENTITY thorn "&#254;">  <!ENTITY yuml "&#255;">  <!ENTITY OElig "&#338;">  <!ENTITY oelig "&#339;">  <!ENTITY Scaron "&#352;">  <!ENTITY scaron "&#353;">  <!ENTITY Yuml "&#376;">  <!ENTITY fnof "&#402;">  <!ENTITY circ "&#710;">  <!ENTITY tilde "&#732;">  <!ENTITY Alpha "&#913;">  <!ENTITY Beta "&#914;">  <!ENTITY Gamma "&#915;">  <!ENTITY Delta "&#916;">  <!ENTITY Epsilon "&#917;">  <!ENTITY Zeta "&#918;">  <!ENTITY Eta "&#919;">  <!ENTITY Theta "&#920;">  <!ENTITY Iota "&#921;">  <!ENTITY Kappa "&#922;">  <!ENTITY Lambda "&#923;">  <!ENTITY Mu "&#924;">  <!ENTITY Nu "&#925;">  <!ENTITY Xi "&#926;">  <!ENTITY Omicron "&#927;">  <!ENTITY Pi "&#928;">  <!ENTITY Rho "&#929;">  <!ENTITY Sigma "&#931;">  <!ENTITY Tau "&#932;">  <!ENTITY Upsilon "&#933;">  <!ENTITY Phi "&#934;">  <!ENTITY Chi "&#935;">  <!ENTITY Psi "&#936;">  <!ENTITY Omega "&#937;">  <!ENTITY alpha "&#945;">  <!ENTITY beta "&#946;">  <!ENTITY gamma "&#947;">  <!ENTITY delta "&#948;">  <!ENTITY epsilon "&#949;">  <!ENTITY zeta "&#950;">  <!ENTITY eta "&#951;">  <!ENTITY theta "&#952;">  <!ENTITY iota "&#953;">  <!ENTITY kappa "&#954;">  <!ENTITY lambda "&#955;">  <!ENTITY mu "&#956;">  <!ENTITY nu "&#957;">  <!ENTITY xi "&#958;">  <!ENTITY omicron "&#959;">  <!ENTITY pi "&#960;">  <!ENTITY rho "&#961;">  <!ENTITY sigmaf "&#962;">  <!ENTITY sigma "&#963;">  <!ENTITY tau "&#964;">  <!ENTITY upsilon "&#965;">  <!ENTITY phi "&#966;">  <!ENTITY chi "&#967;">  <!ENTITY psi "&#968;">  <!ENTITY omega "&#969;">  <!ENTITY thetasym "&#977;">  <!ENTITY upsih "&#978;">  <!ENTITY piv "&#982;">  <!ENTITY ensp "&#8194;">  <!ENTITY emsp "&#8195;">  <!ENTITY thinsp "&#8201;">  <!ENTITY zwnj "&#8204;">  <!ENTITY zwj "&#8205;">  <!ENTITY lrm "&#8206;">  <!ENTITY rlm "&#8207;">  <!ENTITY ndash "&#8211;">  <!ENTITY mdash "&#8212;">  <!ENTITY lsquo "&#8216;">  <!ENTITY rsquo "&#8217;">  <!ENTITY sbquo "&#8218;">  <!ENTITY ldquo "&#8220;">  <!ENTITY rdquo "&#8221;">  <!ENTITY bdquo "&#8222;">  <!ENTITY dagger "&#8224;">  <!ENTITY Dagger "&#8225;">  <!ENTITY bull "&#8226;">  <!ENTITY hellip "&#8230;">  <!ENTITY permil "&#8240;">  <!ENTITY prime "&#8242;">  <!ENTITY Prime "&#8243;">  <!ENTITY lsaquo "&#8249;">  <!ENTITY rsaquo "&#8250;">  <!ENTITY oline "&#8254;">  <!ENTITY frasl "&#8260;">  <!ENTITY euro "&#8364;">  <!ENTITY image "&#8465;">  <!ENTITY weierp "&#8472;">  <!ENTITY real "&#8476;">  <!ENTITY trade "&#8482;">  <!ENTITY alefsym "&#8501;">  <!ENTITY larr "&#8592;">  <!ENTITY uarr "&#8593;">  <!ENTITY rarr "&#8594;">  <!ENTITY darr "&#8595;">  <!ENTITY harr "&#8596;">  <!ENTITY crarr "&#8629;">  <!ENTITY lArr "&#8656;">  <!ENTITY uArr "&#8657;">  <!ENTITY rArr "&#8658;">  <!ENTITY dArr "&#8659;">  <!ENTITY hArr "&#8660;">  <!ENTITY forall "&#8704;">  <!ENTITY part "&#8706;">  <!ENTITY exist "&#8707;">  <!ENTITY empty "&#8709;">  <!ENTITY nabla "&#8711;">  <!ENTITY isin "&#8712;">  <!ENTITY notin "&#8713;">  <!ENTITY ni "&#8715;">  <!ENTITY prod "&#8719;">  <!ENTITY sum "&#8721;">  <!ENTITY minus "&#8722;">  <!ENTITY lowast "&#8727;">  <!ENTITY radic "&#8730;">  <!ENTITY prop "&#8733;">  <!ENTITY infin "&#8734;">  <!ENTITY ang "&#8736;">  <!ENTITY and "&#8743;">  <!ENTITY or "&#8744;">  <!ENTITY cap "&#8745;">  <!ENTITY cup "&#8746;">  <!ENTITY int "&#8747;">  <!ENTITY there4 "&#8756;">  <!ENTITY sim "&#8764;">  <!ENTITY cong "&#8773;">  <!ENTITY asymp "&#8776;">  <!ENTITY ne "&#8800;">  <!ENTITY equiv "&#8801;">  <!ENTITY le "&#8804;">  <!ENTITY ge "&#8805;">  <!ENTITY sub "&#8834;">  <!ENTITY sup "&#8835;">  <!ENTITY nsub "&#8836;">  <!ENTITY sube "&#8838;">  <!ENTITY supe "&#8839;">  <!ENTITY oplus "&#8853;">  <!ENTITY otimes "&#8855;">  <!ENTITY perp "&#8869;">  <!ENTITY sdot "&#8901;">  <!ENTITY lceil "&#8968;">  <!ENTITY rceil "&#8969;">  <!ENTITY lfloor "&#8970;">  <!ENTITY rfloor "&#8971;">  <!ENTITY lang "&#9001;">  <!ENTITY rang "&#9002;">  <!ENTITY loz "&#9674;">  <!ENTITY spades "&#9824;">  <!ENTITY clubs "&#9827;">  <!ENTITY hearts "&#9829;">  <!ENTITY diams "&#9830;">]>
`;


const rasterizeSvg = async (svg, canvas) => {
	const svgURL = "data:image/svg+xml," + encodeURIComponent(SVG_DTD + svg);
	//console.log("svgURL:", svgURL);
	const image: any = await new Promise((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.onerror = event => {
			console.warn("Error when loading svg image:", svgURL);
			reject(event);
		};
		image.src = svgURL;
	});

	canvas.width = image.width;
	canvas.height = image.height;

	const context = canvas.getContext("2d");
	context.drawImage(image, 0, 0);

	const blob = await new Promise(resolve => canvas.toBlob(blob => resolve(blob), "image/png"));
	//console.log("blob:", blob);

	return URL.createObjectURL(blob);
};


const bakeRawSvg = (svg, matchedIds, canvas) => {
	const dom = new DOMParser().parseFromString(svg, "text/xml");
	const root: any = dom.childNodes[0];
	//console.log("dom:", root, matchedIds);

	for (const node of root.childNodes) {
		switch (node.tagName) {
		case "text":
			// remove lilypond engraving signature
			if (/www\.lilypond\.org/.test(node.textContent)) 
				root.removeChild(node);

			break;
		case "a":
			// remove matched tokens
			const href = node.getAttribute("xlink:href");
			const captures = href.match(/:(\d+:\d+:\d+)$/);
			if (captures) {
				const id = captures[1];
				if (matchedIds.has(id))
					root.removeChild(node);
			}

			break;
		}
	}

	const doc = root.outerHTML;

	return rasterizeSvg(doc, canvas);
};


const bakeRawSvgs = async (svgs: string[], matchedIds: Set<string>, canvas) => {
	const urls = [];
	for (const svg of svgs)
		urls.push(await bakeRawSvg(svg, matchedIds, canvas));

	return urls;
};


const replaceSigns = (node, signDict) => {
	for (const child of node.children) {
		if (child.tagName === "use") {
			const href = child.getAttribute("xlink:href");
			if (href) {
				const id = href.substr(1);
				const sign = signDict[id];
				if (sign) {
					const newSign = sign.cloneNode(true);
					newSign.classList.add(...child.classList);

					// append styles
					if (newSign.classList.contains("staff-line") || newSign.classList.contains("line") || newSign.classList.contains("slur"))
						newSign.children[0].setAttribute("stroke", "black");

					node.insertBefore(newSign, child);
					node.removeChild(child);
				}
			}
		}
		else
			replaceSigns(child, signDict);
	}
};


const bakeLiveSheetGen = async function* ({sheetDocument, signs, hashTable, matchedIds, canvas}: {
	sheetDocument: SheetDocument,
	signs?: any,
	hashTable?: {[key: string]: any},
	matchedIds: Set<string>,
	canvas: HTMLCanvasElement,
}) {
	console.assert(!!sheetDocument, "sheetDocument is null.");
	console.assert(!!matchedIds, "matchedIds is null.");
	console.assert(!!canvas, "canvas is null.");
	console.assert(signs || hashTable, "signs & hashTable is both null.");

	const sheet = new SheetLiveComponent({
		propsData: {
			doc: sheetDocument,
			partialVisible: false,
		},
	}).$mount(document.createElement("div"));

	if (!signs) {
		signs = new SheetSignsComponent({
			propsData: {
				hashTable,
			},
		}).$mount(document.createElement("div"));
	}

	const defs = signs.$el.children[0];
	const signDict = [...defs.children].reduce((dict, sign) => ((dict[sign.id] = sign), dict), {});
	//console.log("defs:", defs);

	/*const style = document.createElement("stye");
	style.innerHTML = `
		.token .staff-line line, .token .line line, .token .slur path
		{
			stroke: black;
		}
	`;*/

	const svgDoms = [...sheet.$el.children];
	for (const svg of svgDoms) {
		// not working?
		//svg.insertBefore(style.cloneNode(true), svg.firstChild);

		// remove matched tokens
		matchedIds.forEach(id => {
			const token = svg.querySelector(`g[data-href='${id}']`);
			if (token)
				token.parentElement.removeChild(token);
		});

		replaceSigns(svg, signDict);
		//console.log("svg:", svg);

		yield await rasterizeSvg(svg.outerHTML, canvas);
	};
};


const bakeLiveSheet = async options => {
	const urls = [];

	for await (const url of bakeLiveSheetGen(options))
		urls.push(url);

	return urls;
};



export {
	bakeRawSvgs,
	bakeLiveSheetGen,
	bakeLiveSheet,
};
