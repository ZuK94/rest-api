const express = require("express");
const router = express.Router();
const authMW = require("../middlewares/auth");
const {
  Card,
  generateBusinessNumber,
  validateCard,
} = require("../models/card");

router.get("/my-cards", authMW, async (req, res) => {
  const cards = await Card.find({ user_id: req.user._id });
  res.send(cards);
});

router.post("/new-card", authMW, async (req, res) => {
  const { error } = validateCard(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  }
  const card = await new Card({
    ...req.body,
    bizImage:
      req.body.bizImage ||
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    bizNumber: await generateBusinessNumber(),
    user_id: req.user._id,
  }).save();
  res.send(card);
});

router.delete("/delete-all", authMW, async (req, res) => {
  const cards = await Card.deleteMany({ user_id: req.user._id });
  if (!cards) {
    res.status(400).send("no cards to delete");
  }
  res.send("all your cards have been deleted");
});

router.put("/:id", authMW, async (req, res) => {
  const { error } = validateCard(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
  }

  const card = await Card.findOneAndUpdate(
    {
      _id: req.params.id,
      user_id: req.user._id,
    },

    {
      ...req.body,
      bizImage:
        req.body.bizImage ||
        "https://cdn.pixabay.com/photo/2016/05/31/06/03/silence-1426251_960_720.jpghttps://cdn.pixabay.com/photo/2016/05/31/06/03/silence-1426251_960_720.jpg",
    },

    { new: true }
  );

  if (!card) {
    res.status(400).send("no card found with the given ID");
  }
  res.send(card);
});

router.delete("/:id", authMW, async (req, res) => {
  const card = await Card.findOneAndRemove({
    _id: req.params.id,
    user_id: req.user._id,
  });
  if (!card) {
    res.status(400).send("no card with the given id was found");
  }
  res.send(card);
});

module.exports = router;
