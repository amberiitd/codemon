const AWS = require("aws-sdk");

const DB = new AWS.DynamoDB.DocumentClient();

module.exports={
  DB
}