const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");

const { User, validateNewUser } = require("../models/user");
const authMW = require("../middlewares/auth");
router.post("/new", async (req, res) => {
  const { error } = validateNewUser(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    res.status(400).send("this email address is already registered");
    return;
  }
  user = await new User({
    ...req.body,
    password: await bcrypt.hash(req.body.password, 12),
  }).save();
  res.send(_.pick(user, ["_id", "name", "email", "biz"]));
});

router.get("/me", authMW, async (req, res) => {
  const user = await User.findById({ _id: req.user._id }, { password: 0 });
  res.send(user);
});

module.exports = router;
