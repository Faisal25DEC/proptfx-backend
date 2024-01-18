const express = require("express");
const {
  authenticate,
} = require("../middlewares/auth/authentication.middleware");
const { UserModel } = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

userRouter.get("/user", authenticate, async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.userId });
    console.log(user);
    res.send(user);
  } catch (err) {
    res.status(500).send({ msg: "internal server error/user doesn't exist" });
  }
});
userRouter.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    const user = await UserModel.findOne({ _id: userId });
    if (!user) return res.status(404).send({ msg: "user does not exist" });
    console.log(user);
    res.send(user);
  } catch (err) {
    res.status(500).send({ msg: "internal server error/user doesn't exist" });
  }
});

userRouter.post("/signup", async (req, res) => {
  let { email, password, name, image, role } = req.body;
  const user = await UserModel.findOne({ email });
  image = image
    ? image
    : "https://cdn.vectorstock.com/i/preview-1x/85/94/person-gray-photo-placeholder-man-silhouette-sign-vector-23838594.jpg";
  if (user) return res.status(400).send({ msg: "user already exist" });
  else {
    bcrypt.hash(password, 10, async function (err, hash) {
      try {
        await UserModel.create({ email, password: hash, name, image, role });
        return res.send("sign up successfull");
      } catch (err) {
        console.log(err);
        return res.send({ msg: "error signing up" });
      }
    });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ msg: "user not found" });
    }
    const hashed_password = user?.password;
    bcrypt.compare(password, hashed_password, async function (err, result) {
      if (result) {
        const token = jwt.sign({ userId: user._id }, "secretkey");
        console.log(token);

        return res.send({ msg: "login successful", token });
      } else {
        return res.status(404).send({ msg: "Wrong Login Credentials" });
      }
    });
    // console.log(user);
  } catch (error) {
    res.status(500).send({ msg: "internal server error" });
  }
});

module.exports = { userRouter };
