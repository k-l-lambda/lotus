
const preservedAttributes = {
	...[
		"viewBox", "transform", "x", "y", "width", "height", "ry", "d", "x1", "y1", "x2", "y2", "color",
		"stroke-width", "points", "stroke-dasharray", "font-size", "font-weight", "font-style", "text-anchor",
	].reduce((dict, key) => ({...dict, [key]: key}), {}),
	"xlink:href": "href",
};


const domNodeToElement = node => {
	const elem : any = {
		type: node.tagName,
	};

	for (const key in preservedAttributes) {
		const value = node.getAttribute(key);
		if (value)
			elem[preservedAttributes[key]] = value;
	}

	switch (node.tagName) {
	case "tspan":
		elem.text = node.textContent;

		break;
	case "a":
		if (!/:(\d+:\d+:\d+)$/.test(elem.href)) {
			//if (!/lilypond/.test(elem.href))
			//	console.warn("unexpected a.href:", elem.href);

			delete elem.href;
		}
		else
			elem.href = elem.href.match(/:(\d+:\d+:\d+)$/)[1];

		break;
	case "path":
		//console.log("path:", node.getAttribute("d"), elem);
		//if (elem.d)
		//	elem.d = sha1(elem.d);

		break;
	case "polygon":
		//if (elem.points)
		//	elem.points = sha1(elem.points);

		break;
	}

	[
		"x", "y", "width", "height", "ry", "x1", "y1", "x2", "y2", "stroke-width", "font-size", "font-weight", "font-style", "text-anchor",
	].forEach(att => {
		if (elem[att]) {
			const n = Number(elem[att]);
			if (Number.isFinite(n))
				elem[att] = n;
		}
	});

	if (elem.transform) {
		let [_, tx, ty, sx, sy] = [null, 0, 0, 1, 1];
		if (/translate\([\d.\-,\s]+\)\s*scale\([\d.\-,\s]+\)/.test(elem.transform))
			[_, tx, ty, sx, sy] = elem.transform.match(/translate\(([\d.-]+),\s*([\d.-]+)\)\s*scale\(([\d.-]+),\s*([\d.-]+)\)/);
		else if (/translate\([\d.\-,\s]+\)/.test(elem.transform))
			[_, tx, ty] = elem.transform.match(/translate\(([\d.-]+),\s*([\d.-]+)\)/);
		else if (/scale\([\d.\-,\s]+\)/.test(elem.transform))
			[_, sx, sy] = elem.transform.match(/scale\(([\d.-]+),\s*([\d.-]+)\)/);
		else if (/^rotate(.*)$/.test(elem.transform)) {}
		else
			console.warn("unexpected transform:", elem.transform);

		elem.transform = {
			translate: {
				x: Number(tx),
				y: Number(ty),
			},
			scale: {
				x: Number(sx),
				y: Number(sy),
			},
		};
	}

	for (let i = 0; i < node.childNodes.length; ++i) {
		const child = node.childNodes[i];
		if (child.nodeType === 1) {
			//console.log("child:", child);
			elem.children = elem.children || [];
			elem.children.push(domNodeToElement(child));
		}
	}

	switch (elem.type) {
	case "text":
		if (elem.children)
			elem.text = elem.children.filter(e => e.type === "tspan" && e.text).map(e => e.text).join("");

		break;
	}
	
	return elem;
};


const svgToElements = (svgText, {logger = null, DOMParser = null} = {}) => {
	const dom = new DOMParser().parseFromString(svgText, "text/xml");
	//console.log("dom:", dom);

	if (logger)
		logger.append("svgToElements");

	const svg : any = dom.childNodes[0];
	console.assert(svg && svg.tagName === "svg");

	const root = domNodeToElement(svg);

	//if (logger)
	//	logger.append("svgToElements.root", JSON.parse(JSON.stringify(root)));

	if (!root.children) {
		console.log("invalid svg:", root, svgText);
		return null;
	}

	// remove proxy tags of a & g
	while (true) {
		const index = root.children.findIndex(c => c.type === "a" && c.children);
		if (index >= 0) {
			const a = root.children[index];
			a.children.forEach(p => {
				p.href = a.href;
				p.color = a.color;
			});

			root.children.splice(index, 1, ...a.children);
		}
		else {
			const gi = root.children.findIndex(c => c.type === "g" && c.children);
			if (gi >= 0) {
				const g = root.children[gi];
				for (const child of g.children) {
					if (g.transform) {
						child.transform = child.transform || {
							translate: {x: 0, y: 0},
							scale: {x: 1, y: 1},
						};
	
						child.transform.translate.x = g.transform.translate.x + child.transform.translate.x * g.transform.scale.x;
						child.transform.translate.y = g.transform.translate.y + child.transform.translate.y * g.transform.scale.y;
						child.transform.scale.x *= g.transform.scale.x;
						child.transform.scale.y *= g.transform.scale.y;
					}

					if (g.color)
						child.color = g.color;
				}
	
				root.children.splice(gi, 1, ...g.children);
			}
			else
				break;
		}
	};

	return root;
};



export {
	svgToElements,
};
