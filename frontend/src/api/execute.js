// clientId;
// clientSecret;
// script;
// stdin;
// language;
// versionIndex;

import { API } from "aws-amplify";
import { languages } from "../constants/general";

export const execute = (script, stdin, language, output) => {
	// return new Promise((resolve, reject) => {
	// 	// resolve({
	// 	// 	output: output,
	// 	// 	statusCode: 200,
	// 	// 	memory: "",
	// 	// 	cpuTime: "",
	// 	// });

	// 	reject({
	// 	  error: "Error",
	// 	  statusCode: 500
	// 	})
	// }).catch((error) => {return error;});
	//  fetch(`${process.env.REACT_APP_JBOOT_BASE_URL}/execute`, {
	// 	method: "POST",
	//   headers: {
	//     "Content-Type": "application/json"
	//   },
	// body: JSON.stringify({
	// 	clientId: process.env.REACT_APP_JBOOT_CLIENT_ID,
	// 	clientSecret: process.env.REACT_APP_JBOOT_CLIENT_SECRET,
	// 	script,
	// 	stdin,
	// 	language,
	// 	versionIndex: languages[language].version,
	// }),
	// })
	return API.post("base_url", "/execute", {
		body: { script, stdin, language: languages[language].codeName, versionIndex: languages[language].version },
	})
		.then((data) => {
			return JSON.parse(data.body);
		})
		.catch((error) => {
			console.error(error);
			return {
				error: error.message,
				statusCode: 500,
			};
		});
};

export const executeAllTests = (problem) => {
	return Promise.all(
		problem.testCases.map((t) => execute(problem.editor[problem.language], t.input, problem.language, t.output))
	);
};
