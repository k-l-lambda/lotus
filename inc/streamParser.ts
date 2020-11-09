
import {EventEmitter} from "events";



export default class StreamParser extends EventEmitter {
	reader: ReadableStreamReader<Uint8Array>;
	separator: string;


	constructor (reader, {separator = "\n\n\n\n"} = {}) {
		super();

		this.reader = reader;
		this.separator = separator;
	}


	async read () {
		let buffer = "";

		while (true) {
			const {done, value} = await this.reader.read();

			if (value) {
				const deltaText = new TextDecoder("utf-8").decode(value);

				buffer += deltaText;
				while (true) {
					const separatorIndex = buffer.indexOf(this.separator);
					if (separatorIndex >= 0) {
						const part = buffer.substr(0, separatorIndex);
						this.emit("data", part);
	
						buffer = buffer.substr(separatorIndex + this.separator.length);
					}
					else
						break;
				}
			}

			if (done)
				break;
		}

		if (buffer) {
			//console.debug("last buffer:", buffer);
			this.emit("data", buffer);
		}
	}
};
