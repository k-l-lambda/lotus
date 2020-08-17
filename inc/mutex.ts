
class SingleLock<T = void> {
	promise?: Promise<T>;
	resolve?: (result?: T) => void;


	constructor (locked: boolean = false) {
		if (locked)
			this.lock();
	}


	get locked (): boolean {
		return !!this.resolve;
	}


	lock (): Promise<T> {
		console.assert(!this.locked, "[SingleLock] duplicated locking, last locking has't been released yet.");

		this.promise = new Promise(resolve => this.resolve = resolve);

		return this.promise;
	}


	release (result?: T) {
		if (this.resolve) {
			this.resolve(result);
			this.resolve = null;
		}
	}


	wait (): Promise<T> {
		return this.promise;
	}
};



export {
	SingleLock,
};
