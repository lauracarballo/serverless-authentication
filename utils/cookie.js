const jwt = require("jsonwebtoken");
const cookie = require("cookie");

const DAY = 24 * 60 * 60;

const { JWT_SECRET } = process.env;

module.exports.generateCookie = (userId, expireTimeInDays) => {
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: expireTimeInDays + "d",
  });

  return cookie.serialize("token", token, {
    maxAge: expireTimeInDays * DAY,
    httpOnly: true,
  });
};

module.exports.verifyCookie = (cookieHeader) => {
  const { token } = cookie.parse(cookieHeader);
  console.log(token);
  return jwt.verify(token, JWT_SECRET);
};
