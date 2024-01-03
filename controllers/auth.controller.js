const ServerError = require("../errors/ServerError");
const User = require("../models/User");
const { createAccessToken, comparePWD } = require("../util/common");

module.exports.createUserAccount = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) throw new Error("Invalid Fields");
    // Check if username already exists
    const user = await User.findOne({ username });
    if (user) throw new ServerError(400, "User already exists");
    // Save entry
    const newUser = new User({ username, email, password });
    await newUser.save();
    return res.json({ message: `User ${username} successfully created` });
  } catch (error) {
    next(error);
  }
};

module.exports.userLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) throw new Error("Invalid Fields");
    const user = await User.findOne({ username });
    if (!user) throw new ServerError(404, "Invalid Username");
    const result = await comparePWD(password, user.password);
    if (!result) throw new ServerError(400, "Invalid Password");
    const accessToken = await createAccessToken(username, user.id);
    return res.json({ accessToken });
  } catch (error) {
    next(error);
  }
};
