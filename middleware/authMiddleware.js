const { validateAccessToken } = require("../util/common");

module.exports.authenticateUser = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    const user = await validateAccessToken(access_token);
    req.username = user.username;
    req.userId = user.userId;
    next();
  } catch (error) {
    next(error);
  }
};
