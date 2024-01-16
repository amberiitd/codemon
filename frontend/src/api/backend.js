import { API } from "aws-amplify";

export const createTestResult = (data) => {
	return API.post("base_url", "/test", {
		body: data,
	});
};


export const getTestResult = () => {
	return API.get("base_url", "/test/all").then((data) => JSON.parse(data.body).data);
};