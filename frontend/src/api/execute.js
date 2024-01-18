// clientId;
// clientSecret;
// script;
// stdin;
// language;
// versionIndex;

import { API } from "aws-amplify";
import { languages } from "../constants/general";

export const execute = (script, stdin, language, output) => {
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

export const getToken = () => {
	return API.get("base_url", "/token")
		.then((data) => {
			return data.body;
		})
		.catch((error) => {
			console.error(error);
			return null;
		});
};

export const executeAllTests = (problem) => {
	return Promise.all(
		problem.testCases.map((t) => execute(problem.editor[problem.language], t.input, problem.language, t.output))
	);
};
