async function pathHandler(event, functionMap) {
	console.info(event);
	let body = JSON.parse(event.body || "{}");
	const path = event.requestContext.resourcePath.replace("/{taskId+}", "");
	if (!functionMap[path] || !functionMap[path][event.requestContext.httpMethod]) {
		return {
			statusCode: 404,
			body: JSON.stringify({ error: `this route path doesn't have any implementation` }),
		};
	}
	const uid = (event.requestContext.identity?.cognitoAuthenticationProvider || "").split(":").pop();
	body = { ...body, uid, ...(event.pathParameters || {}) };
	const requiredParams = functionMap[path][event.requestContext.httpMethod].requiredParams || [];

	for (let p of requiredParams) {
		if (!body[p]) {
			return {
				statusCode: 500,
				body: JSON.stringify({ error: `following params are required: ${requiredParams}` }),
			};
		}
	}

	const returnObj = await functionMap[path][event.requestContext.httpMethod].callback(body, event);
	return {
		statusCode: 200,
		body: JSON.stringify(returnObj || {}),
	};
}

module.exports = {
	pathHandler,
};
