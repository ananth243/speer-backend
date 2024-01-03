const { Schema, model } = require("mongoose");
const { isEmail, isStrongPassword } = require("validator");
const { hashPWD } = require("../util/common");

const userModel = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: isStrongPassword,
      message: ({ value }) => `${value} is not a strong password`,
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: isEmail,
      message: ({ value }) => `${value} is not a valid email`,
    },
  },
});

userModel.pre("save", async function hash (next){
  this.password = await hashPWD(this.password);
  next();
});

const User = model("user", userModel);
module.exports = User;
