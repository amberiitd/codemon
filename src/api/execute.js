// clientId;
// clientSecret;
// script;
// stdin;
// language;
// versionIndex;

import { languages } from "../constants/general";

export const execute = (script, stdin, language, output) => {
	console.log({ script, stdin, language });
	return new Promise((resolve, reject) => {
		resolve({
			output: output,
			statusCode: 200,
			memory: "",
			cpuTime: "",
		});

		// reject({
		//   error: "Error",
		//   statusCode: 500
		// })
	}).catch((error) => error);
};

export const executeAllTests = (problem) => {
	return Promise.all(problem.testCases.map((t) => execute(problem.editor, t.input, languages[problem.language], t.output )));
};
