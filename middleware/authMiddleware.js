const { validateAccessToken } = require("../util/common");

module.exports.authenticateUser = async (req, res, next) => {
  const { access_token } = req.headers;
  const user = await validateAccessToken(access_token);
  if (!user) throw Error("");
  req.username = user.username;
  req.userId = user.userId;
  next();
};
