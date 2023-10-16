require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { userModel } = require("../Models/user.model");
let JWT_SECRET = process.env.JWT_SECRET;
const userRegister = express.Router();

// -----------------------signup-----------------------//

userRegister.get("/radhekrishna", async (req, res) => {
  console.log("Radheee Radheee!!!");
  res
    .status(200)
    .send(
      "I am, but lost, and only you are my way to the world... Nothing of me remains, as I surender, but, to you and only you.. Not me but only my karma remains.. All to you.. Only to you..."
    );
});

userRegister.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 5);
  try {
    const oldUser = await userModel.findOne({ email });

    if (oldUser) {
      return res.send({ status: "User already Exists" });
    }
    await userModel.create({
      email,
      password: encryptedPassword,
    });
    res.send({ status: "success" });
  } catch (error) {
    res.send({ status: "error" });
    console.log(error);
  }
});

// ------------------------login-----------------------------------//

userRegister.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.send({ success: false, message: "Invalid User" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "60m",
    });
    if (res.status(201)) {
      return res.send({ success: true, message: "Valid User", token: token });
    } else {
      return res.send({ message: "error" });
    }
  }
  res.send({ success: false, message: "Invalid Password" });
});

module.exports = { userRegister };
