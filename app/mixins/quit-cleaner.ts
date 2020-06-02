
export default {
	created () {
		this.quitCleaner = new Promise(resolve => this.quitClear = resolve);
	},


	methods: {
		async appendCleaner (cleaner) {
			if (await Promise.race([this.quitCleaner, "pending"]) !== "pending")
				cleaner();
			else
				this.quitCleaner = this.quitCleaner.then(cleaner);
		},
	},


	beforeDestroy () {
		this.quitClear();
	},
};
