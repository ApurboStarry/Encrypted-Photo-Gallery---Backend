const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1024,
  },
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
  return token;
}

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    userName: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(10).max(255).required().email(),
    password: Joi.string().min(10).max(255).required()
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;