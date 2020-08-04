
const traverse = (node, handle) => {
	handle(node);

	if (node.childNodes) {
		for (let i = 0; i < node.childNodes.length; ++i)
			traverse(node.childNodes[i], handle);
	}
};


const childrenWithTag = (node: any, tagName: string): any[] => {
	const children = Array.from(node.childNodes);
	return children.filter((node: any) => node.tagName === tagName);
};


const hasChildrenWithTag = (node: any, tagName: string): boolean => {
	const children = Array.from(node.childNodes);
	return children.some((node: any) => node.tagName === tagName);
};


const findPreviousSibling = (node: any, tagName: string): any => {
	let sibling = node.previousSibling;
	while (sibling && sibling.tagName !== tagName)
		sibling = sibling.previousSibling;

	return sibling;
};


const findNextSibling = (node: any, tagName: string): any => {
	let sibling = node.nextSibling;
	while (sibling && sibling.tagName !== tagName)
		sibling = sibling.nextSibling;

	return sibling;
};



export {
	traverse,
	childrenWithTag,
	hasChildrenWithTag,
	findPreviousSibling,
	findNextSibling,
};
