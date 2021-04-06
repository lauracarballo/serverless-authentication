const bcrypt = require("bcrypt");
const ITERATIONS = 12;

module.exports.hashPassword = async (password) => {
  const hash = await bcrypt.hash(password, ITERATIONS);
  return hash;
};

module.exports.matchPassword = async (password, hash) => {
  const match = await bcrypt.compare(password, hash);
  return match;
};
