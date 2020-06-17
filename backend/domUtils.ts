
const traverse = (node, handle) => {
	handle(node);

	if (node.childNodes) {
		for (let i = 0; i < node.childNodes.length; ++i)
			traverse(node.childNodes[i], handle);
	}
};


const childrenWithTag = (node: any, tagName: string) => {
	const children = Array.from(node.childNodes);
	return children.filter(node => node.tagName === tagName);
};



export {
	traverse,
	childrenWithTag,
};
