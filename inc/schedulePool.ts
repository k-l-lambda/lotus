
interface Timer {
	now (): number;
};


type TaskFunctor = () => void;


export default class SchedulePool {
	timer: Timer;

	tasks: {[key: number]: Promise<void>} = {};
	handlers: {[key: number]: number | NodeJS.Timeout} = {};


	constructor (timer = Date) {
		this.timer = timer;
	}


	clear () {
		Object.values(this.handlers).forEach(handle => clearTimeout(handle as number));

		this.tasks = {};
		this.handlers = {};
	}


	getTask (timestamp: number): Promise<void> {
		const delay = Math.max(timestamp - this.timer.now(), 0);

		if (!this.tasks[timestamp]) {
			this.tasks[timestamp] = new Promise(resolve => {
				this.handlers[timestamp] = setTimeout(resolve, delay);
			}).then(() => {
				delete this.tasks[timestamp];
				delete this.handlers[timestamp];
			});
		}

		return this.tasks[timestamp];
	}


	appendTask (timestamp: number, task: TaskFunctor) {
		this.tasks[timestamp] = this.getTask(timestamp).then(task);
	}
};
