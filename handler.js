const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const { generateCookie } = require("./utils/cookie");
const { hashPassword, matchPassword } = require("./utils/password");
const { JWT_SECRET } = process.env;

module.exports.signup = async (event) => {
  const { email, name, password } = JSON.parse(event.body);

  const hash = await hashPassword(password);

  if (email && password && name) {
    const userId = email;
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
        "Access-Control-Allow-Origin": "*",
        "Set-Cookie": cookie,
      },
      body: JSON.stringify({ success: true }),
    };
  } else {
    return {
      statusCode: 401,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
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
    const data = await dynamoDb
      .get({
        TableName: "users",
        Key: { userId: email, sortKey: "profile" },
      })
      .promise();

    if (!data.Item) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ success: false, err: "user not found" }),
      };
    }

    const userPassword = data.Item.password;
    const matchedPassword = await matchPassword(password, userPassword);
    const userId = data.Item.userId;

    if (matchedPassword) {
      const cookie = generateToken(userId, 1);
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Set-Cookie": cookie,
        },
        body: JSON.stringify({ success: true }),
      };
    } else {
      return {
        statusCode: 401,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ success: false, err: "incorrect password" }),
      };
    }
  }
};

module.exports.profile = async (event) => {
  const Cookie = event.headers.Cookie;
  const cookies = cookie.parse(Cookie);
  const token = cookies.token;

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return {
      statusCode: 401,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ success: false, err: "not authorized" }),
    };
  }

  const data = await dynamoDb
    .get({
      TableName: "users",
      Key: { userId: decoded.userId, sortKey: "profile" },
    })
    .promise();

  if (!data.Item) {
    return {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ success: false, err: "profile not found" }),
    };
  } else {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ success: true, name: data.Item.name }),
    };
  }
};
