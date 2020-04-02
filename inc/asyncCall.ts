
const asyncCall = (func, ...args): Promise<any> => new Promise((resolve, reject) => func(...args, (err, data) => {
	if (err)
		reject(err);
	else
		resolve(data);
}));



export default asyncCall;
