const { createTestResult, deleteTestResult, getTestResults, callExecute } = require("./service/challangeService");
const { pathHandler } = require("./util/pathHandler");

const functionMap = {
	"/test": {
		POST: {
			requiredParams: ["uid", "problems", "results"],
			callback: createTestResult,
		},
    DELETE: {
      requiredParams: ["uid", "testId"],
      callback: deleteTestResult,
    }
	},
  "/test/all": {
    GET: {
			requiredParams: ["uid"],
			callback: getTestResults,
		},
  },
  "/execute": {
    POST: {
			requiredParams: ["uid"],
			callback: callExecute,
		},
  },
};

exports.handler = async (event, context) => {
	const returnObj = await pathHandler(event, functionMap);
	return {
		headers: {
			"Access-Control-Allow-Headers": "*",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
		},
		...returnObj,
	};
};
