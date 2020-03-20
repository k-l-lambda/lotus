
export const msDelay = ms => new Promise(resolve => setTimeout(resolve, ms));


export function animationDelay () {
	return new Promise(resolve => requestAnimationFrame(resolve));
};


const mutexes = {};

export function mutexDelay (key, ms) {
	const token = {};
	mutexes[key] = token;

	return new Promise(resolve =>
		setTimeout(() => resolve(mutexes[key] === token), ms),
	);
};
