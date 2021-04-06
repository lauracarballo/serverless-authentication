const jwt = require("jsonwebtoken");

const DAYS = 24 * 60 * 60 * 1000;

const { JWT_SECRET } = process.env;

module.exports.generateCookie = (userId, expireTimeInDays) => {
  let date = new Date();
  date.setTime(date.getTime() + expireTimeInDays * DAYS);
  const expires = date.toUTCString();

  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: expireTimeInDays + "d",
  });

  return "token=" + token + ";" + "expires=" + expires + ";path=/;";
};
