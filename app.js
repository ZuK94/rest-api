require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const cardRouter = require("./routes/cards");

mongoose.set("strictQuery", false);

mongoose
  .connect("mongodb://127.0.0.1:27017/my_rest_api")
  .then(console.log("connected to mongoDB"))
  .catch((err) => {
    console.log("could not connect to mongoDb", err);
  });

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/cards", cardRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
