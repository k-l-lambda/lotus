

const recoverJSON = (json: string | object, classDict) => {
	if (typeof json === "object")
		json = JSON.stringify(json);

	return JSON.parse(json, (_, value) => {
		if (value && (typeof value === "object") && value.__prototype) {
			const Class = classDict[value.__prototype];
			if (Class) {
				const {__prototype, ...fields} = value;
				return new Class(fields);
			}
		}

		return value;
	});
};


class SimpleClass {
	constructor (data?: object) {
		if (data)
			Object.assign(this, data);
	}


	toJSON () {
		return {
			__prototype: (this.constructor as any).className,
			...this,
		};
	}
};



export {
	recoverJSON,
	SimpleClass,
};
