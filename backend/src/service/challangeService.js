const { createItem, getAllItems, deleteItem, getTaskByStatus, updateItem } = require("../util/commonDB");
const { makeid } = require("../util/util");
var https = require("https");

async function createTestResult(body) {
	const testId = makeid(8);
	await createItem(`uid:${body.uid}`, `testResult:${testId}`, {
		itemType: "testResult",
		testId,
		...body,
	});

	return {
		message: "success",
	};
}

const getTestResults = async (body) => {
	const items = await getAllItems(`uid:${body.uid}`, "testResult");

	return {
		statusCode: 200,
		body: JSON.stringify({
			message: "success",
			data: items,
		}),
	};
};

const deleteTestResult = async (body) => {
	await deleteItem(`uid:${body.uid}`, `testResult:${body.testId}`);
	return {
		statusCode: 200,
		body: JSON.stringify({
			message: "success",
		}),
	};
};

function callExecute(data = {}) {
	// Build the post string from an object
	return new Promise((resolve, reject) => {
		var post_data = JSON.stringify({
			clientId: process.env.JBOOT_CLIENT_ID,
			clientSecret: process.env.JBOOT_CLIENT_SECRET,
			script: data.script,
			stdin: data.stdin,
			language: data.language,
			versionIndex: data.versionIndex,
		});

		console.log(post_data);

		// An object of options to indicate where to post to
		var post_options = {
			host: process.env.JBOOT_DOMAIN,
			path: "/v1/execute",
			method: "POST",
      PORT: 443,
			headers: {
				"Content-Type": "application/json",
			},
		};

		console.log(post_options);

		// Set up the request

		var post_req = https.request(post_options, function (res) {
			console.log("statusCode:", res.statusCode);
			console.log("headers:", res.headers);
			res.setEncoding("utf8");

			let res_string = "";
			res.on("data", function (chunk) {
				console.log("Response: " + chunk);
				res_string += chunk;
			});

			// The whole response has been received. Print out the result.
			res.on("end", () => {
				console.log("end res_string", res_string);
				try {
					resolve({
						statusCode: 200,
						body: res_string,
					});
				} catch (err) {
					reject({
						statusCode: 500,
						body: err.message,
					});
				}
			});

			res.on("error", (err) => {
				console.error(err);
				reject({
					statusCode: 500,
					body: err.message,
				});
			});
		});

		post_req.on("error", (e) => {
			console.log("error");
			reject({
				statusCode: 500,
				body: e.message,
			});
		});

		// post the data
		post_req.write(post_data);
		post_req.end();
	});
}

module.exports = {
	createTestResult,
	getTestResults,
	deleteTestResult,
	callExecute,
};
