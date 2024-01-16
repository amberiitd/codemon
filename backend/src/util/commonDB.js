const { DB } = require("../configs/dbConfig");

const TABLE = process.env.DYNAMODB_TABLE_NAME;

const createItem = async (pk, sk, data, table = TABLE) => {
	if (!pk || !sk) {
		throw Error("empty key values");
	}
	const unix = parseInt(new Date().getTime() / 1000);
	const params = {
		TableName: table,
		Item: {
			createdAt: unix,
			updatedAt: unix,
			...data,
			pk,
			sk,
		},
	};

	const response = await DB.put(params).promise();
	console.info(response);
	return {
		message: "success",
	};
};

const getAllItems = async (pk, itemType, table = TABLE) => {
	const params = {
		TableName: table || TABLE,
		KeyConditionExpression: "pk = :pk and begins_with(sk, :itemType)",
		ExpressionAttributeValues: {
			":pk": pk,
			":itemType": itemType,
		},
	};

	const response = await DB.query(params).promise();
	console.info(response);

	return response.Items;
};

const getTaskByStatus = async (pk, status, table = TABLE) => {
	const params = {
		TableName: table || TABLE,
		KeyConditionExpression: "pk = :pk and begins_with(sk, :itemType)",
		FilterExpression: "#status = :status",
		ExpressionAttributeValues: {
			":pk": pk,
			":itemType": "task",
			":status": status,
		},
    ExpressionAttributeNames: {
      "#status": "status"
    }
	};

	const response = await DB.query(params).promise();
	console.info(response);

	return response.Items;
};

const getItem = async (pk, sk, table = TABLE) => {
	const params = {
		TableName: table || TABLE,
		Key: {
			pk,
			sk,
		},
	};

	const response = await DB.get(params).promise();
	console.info(response);

	return response.Item;
};

const deleteItem = async (pk, sk, table = TABLE) => {
	const params = {
		TableName: table || TABLE,
		Key: {
			pk: pk,
			sk: sk,
		},
	};

	const response = await DB.delete(params).promise();
	console.info(response);
	return {
		message: "success",
		...response,
	};
};

const parseParams = (data, deepPrefix = "") => {
	let expr = "";
	let values = {};
  let names = {};
	if (deepPrefix.length > 0) {
		deepPrefix += ".";
	}
	Object.entries(data).forEach(([key, val]) => {
    let keyPlaceholder = `${key}_1`
		expr += `, ${deepPrefix}#${keyPlaceholder} = :${keyPlaceholder}`;
		values[`:${keyPlaceholder}`] = val;
    names[`#${keyPlaceholder}`] = key;
	});

	return [expr, values, names];
};

const updateItem = async (pk, sk, updateData, prefix="", table=TABLE) => {
	if (!pk || !sk) {
		return;
	}
	const unix = parseInt(new Date().getTime() / 1000);
	const [updateExpSuffix, attributeValues, attributeNames] = parseParams(updateData, prefix || "");
	const UpdateExpression = "SET updatedAt= :updatedAt " + updateExpSuffix;
	const ExpressionAttributeValues = {
		":updatedAt": unix,
		...attributeValues,
	};

	var params = {
		TableName: table || TABLE,
		Key: { pk, sk },
		UpdateExpression,
		ExpressionAttributeValues,
    ExpressionAttributeNames: attributeNames
	};
	console.info(params);
	const response = await DB.update(params).promise();
	console.info(response);
	return {
		message: "success",
	};
};

module.exports = {
	createItem,
	getItem,
	updateItem,
	deleteItem,
  getTaskByStatus,
  getAllItems
};
