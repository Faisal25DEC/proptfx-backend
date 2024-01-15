const express = require("express");
const {
  authenticate,
} = require("../middlewares/auth/authentication.middleware");
const { UserModel } = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

userRouter.get("/", authenticate, async (req, res) => {
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
    if (!user) return res.send({ msg: "user does not exist" });
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
    : "https://firebasestorage.googleapis.com/v0/b/instagram-clone-db.appspot.com/o/circle-silhouette-user-user-profile-user-interface-login-avatar-user-account-skin-png-clipart-thumbnail-removebg-preview.png?alt=media&token=0cd8d27e-b2a8-4d23-baa8-c068b7db7c97";
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

  const user = await UserModel.findOne({ email });
  console.log(user);
  const hashed_password = user?.password;
  bcrypt.compare(password, hashed_password, async function (err, result) {
    if (result) {
      const token = jwt.sign({ userId: user._id }, "secretkey");
      console.log(token);

      res.send({ msg: "login successful", token });
    } else {
      res.send("login failed");
    }
  });
});

module.exports = { userRouter };
