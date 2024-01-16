const { createTask, getTasks, deleteTask, getFilteredTask, updateTask } = require("./service/taskManagerService");
const { pathHandler } = require("./util/pathHandler");

const functionMap = {
	"/create/task": {
		POST: {
			requiredParams: ["uid", "title", "status"],
			callback: createTask,
		},
	},
	"/task": {
		DELETE: {
			requiredParams: ["uid", "taskId"],
			callback: deleteTask,
		},
    PUT:{
      requiredParams: ["uid", "taskId"],
			callback: updateTask,
    }
	},
  "/getall/task": {
    GET: {
			requiredParams: ["uid"],
			callback: getTasks,
		},
  },
  "/getbystatus/task": {
    POST: {
			requiredParams: ["uid", "status"],
			callback: getFilteredTask,
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
