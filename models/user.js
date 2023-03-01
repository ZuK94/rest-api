const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { JWTSecretToken } = require("../configs/config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 255,
    required: true,
  },
  email: {
    type: String,
    minLength: 5,
    maxLength: 255,
    required: true,
  },
  password: {
    type: String,
    minLength: 6,
    maxLength: 255,
    required: true,
  },
  biz: {
    type: Boolean,
    required: true,
  },
});
userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id, biz: this.biz }, JWTSecretToken);
};
const User = mongoose.model("User", userSchema, "users");

const validateNewUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(6).max(255).required(),
    biz: Joi.boolean().required(),
  });
  return schema.validate(user);
};

module.exports = { User, validateNewUser };
