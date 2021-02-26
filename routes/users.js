const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const express = require("express");

const router = express.Router();

// register
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");

  user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);
  user.password = hashedPassword;
  await user.save();

  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send({
    userName: user.userName,
    email: user.email,
  });
});

module.exports = router;
