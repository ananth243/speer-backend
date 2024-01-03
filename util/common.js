const { hash, compare } = require("bcrypt");
const { decode, verify, sign } = require("jsonwebtoken");

module.exports.validateAccessToken = async (accessToken) => {
  return verify(accessToken, process.env.SECRET_KEY);
};

module.exports.createAccessToken = async (username, userId) => {
  return sign({ username, userId }, process.env.SECRET_KEY);
};

module.exports.decodeAccessToken = async (accessToken) => {
  return decode(accessToken);
};

module.exports.hashPWD = async (password) => {
  return hash(password, 3);
};

module.exports.comparePWD = async (password, dbPassword) => {
  return compare(password, dbPassword);
};
