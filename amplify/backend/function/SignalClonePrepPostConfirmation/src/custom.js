const aws = require("aws-sdk");
const ddb = new aws.DynamoDB();

exports.handler = async (event, context) => {
  if (!event.request.userAttributes.sub) {
    console.log("Error: No user was written to DynamoDB");
    context.done(null, event);
    return;
  }

  // Save the user to DynamoDB
  const date = new Date();
  const timestamp = date.getTime().toString();

  const Item = {
    __typename: { S: "User" },
    _lastChangedAt: { N: timestamp },
    _version: { N: "1" },
    id: { S: event.request.userAttributes.sub },
    email: { S: event.request.userAttributes.email },
    name: { S: event.request.userAttributes.email },
    createdAt: { S: date.toISOString() },
    updatedAt: { S: date.toISOString() },
  };

  const params = {
    Item,
    TableName: process.env.USERTABLE,
  };

  try {
    await ddb.putItem(params).promise();
    console.log("Success");
  } catch (e) {
    console.log("Error", e);
  }

  context.done(null, event);
};
