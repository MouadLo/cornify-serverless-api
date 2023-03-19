import * as uuid from "uuid";
import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";

export const  main = handler(async (event, context) => {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.tableName,
    IndexName: "createdAt-index",
    // 'Item' contains the attributes of the item to be created
    // - 'userId': user identities are federated through the
    //             Cognito Identity Pool, we will use the identity id
    //             as the user id of the authenticated user
    // - 'noteId': a unique uuid
    // - 'content': parsed from request body
    // - 'attachment': parsed from request body
    // - 'createdAt': current Unix timestamp
    Item: {
      userID: event.requestContext.identity.cognitoIdentityId,
      productID: uuid.v1(),
      title: data.title,
      image: data.image,
      brand: data.brand,
      description: data.description,
      price: data.price,
      countInStock: data.countInStock,
      createdAt: Date.now().toString()
    }
  };

  await dynamoDb.put(params);

  return params.Item;
});