
import path from "path";
import serveHandler from "serve-handler";



const createHandler = (publicDir: string, apiPath: string) => (req, res) => {
	req.url = "/" + path.relative(`${apiPath}/`, req.baseUrl);

	// modify link URL origin
	const responseProxy = new Proxy(res, {
		get (res, prop) {
			//console.log("proxy.get:", prop);
			switch (prop) {
			case "end":
				return (content) => {
					//console.log("end with:", content);
					const html = content && content.replace(/href="/g, `href="${apiPath}`);

					res.end(html);
				};
			}

			if (typeof res[prop] === "function")
				return res[prop].bind(res);

			return res[prop];
		},
	});

	serveHandler(req, responseProxy, {
		public: publicDir,
		//symlinks: true,
	});
};



export {
	createHandler,
};
