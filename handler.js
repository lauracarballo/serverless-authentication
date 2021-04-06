const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const { generateCookie, verifyCookie } = require("./utils/cookie");
const { hashPassword, matchPassword } = require("./utils/password");
const { JWT_SECRET } = process.env;

module.exports.signup = async (event) => {
  const { name, email, password } = JSON.parse(event.body);

  if (name && email && password) {
    const userId = email;
    const hash = await hashPassword(password);

    await dynamoDb
      .put({
        TableName: "users",
        Item: {
          userId: email,
          sortKey: "profile",
          name: name,
          password: hash,
        },
      })
      .promise();

    const cookie = generateCookie(userId, 1);

    return {
      statusCode: 200,
      headers: {
        "Set-Cookie": cookie,
      },
      body: JSON.stringify({ success: true }),
    };
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify({
        success: false,
        error: "Enter a valid name/email/password",
      }),
    };
  }
};

module.exports.login = async (event) => {
  const { email, password } = JSON.parse(event.body);

  if (email && password) {
    const { Item } = await dynamoDb
      .get({
        TableName: "users",
        Key: { userId: email, sortKey: "profile" },
      })
      .promise();

    if (!Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, err: "user not found" }),
      };
    }

    const { userId, password: hashedPassword } = Item;
    const matchedPassword = await matchPassword(password, hashedPassword);

    if (matchedPassword) {
      const cookie = generateCookie(userId, 1);
      return {
        statusCode: 200,
        headers: {
          "Set-Cookie": cookie,
        },
        body: JSON.stringify({ success: true }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ success: false, err: "incorrect password" }),
      };
    }
  }
};

module.exports.profile = async (event) => {
  const cookieHeader = event.headers.Cookie;
  try {
    const decoded = verifyCookie(cookieHeader);
    const data = await dynamoDb
      .get({
        TableName: "users",
        Key: { userId: decoded.userId, sortKey: "profile" },
      })
      .promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, name: data.Item.name }),
    };
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ success: false, err: "not authorized" }),
    };
  }
};
