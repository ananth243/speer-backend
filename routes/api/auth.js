const {
  createUserAccount,
  userLogin,
} = require("../../controllers/auth.controller");
const router = require("express").Router();

router.post("/signup", createUserAccount);

router.post("/login", userLogin);

module.exports = router;
