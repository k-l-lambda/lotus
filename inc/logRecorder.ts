
interface Record {
	desc: string;
	data: any;
};


export default class LogRecorder {
	enabled: boolean;
	records: Record[];


	constructor ({enabled = false} = {}) {
		this.enabled = enabled;
		this.records = [];
	}

	
	append (desc: string, data?: any) {
		if (this.enabled)
			this.records.push({desc, data});
	}


	toJSON () {
		if (!this.enabled)
			return null;

		return {records: this.records.map(record => [record.desc, record.data])};
	}
};
