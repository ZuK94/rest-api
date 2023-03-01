const express = require("express");
const Joi = require("joi");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/", async (req, res) => {
  // validate user input
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  }

  // validate system requirements

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).send("user does not exist");
    return;
  }

  const passwordIsValid = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!passwordIsValid) {
    res.status(400).send("not valid password");
    return;
  }
  // process
  const token = user.generateAuthToken();
  // response
  res.send({ token });

  function validate(user) {
    const schema = Joi.object({
      email: Joi.string().min(5).max(255).required(),
      password: Joi.string().min(6).max(255).required(),
    });
    return schema.validate(user);
  }
});
module.exports = router;
