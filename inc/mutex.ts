
class SingleLock {
	promise?: Promise<any>;
	resolve?: (result?: any) => void;


	get locked () {
		return !!this.resolve;
	}


	lock (): Promise<any> {
		this.promise = new Promise(resolve => this.resolve = resolve);

		return this.promise;
	}


	release (result?: any) {
		if (this.resolve) {
			this.resolve(result);
			this.resolve = null;
		}
	}


	wait (): Promise<any> {
		return this.promise;
	}
};



export {
	SingleLock,
};
