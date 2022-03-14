require("dotenv").config();

import { RequestHandler } from "express";
import { generateToken } from "../utils/generateToken";
import { userModel, userSchema } from "./User";
import { userVerificationModel } from "./UserVerification";

const bcrypt = require("bcryptjs");
const salt = 10;

const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
  secure: true,
  requireTLS: true,
});

export const getUsers: RequestHandler = async (req, res) => {
  try {
    const users = await userModel.find();
    return res.json(users);
  } catch (error) {
    res.json(error);
  }
};

export const getUser: RequestHandler = async (req, res) => {
  const userFound = await userModel.findOne({ email: req.params.email });
  if (userFound) {
    return res.json(userFound);
  } else {
    return res.status(204).json();
  }
};

export const createUser: RequestHandler = async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, salt);
    const usersaved = await new userModel(req.body).save();
    sendVerificationEmail(usersaved.email);
    res.json(generateToken(req.body.email));
  } catch (error) {
    res.status(412).json({ message: "The data is not valid" });
  }
};

const sendVerificationEmail: Function = async (email: string) => {
  const currentUrl = "http://localhost:5000";
  const uniqueString = uuidv4();

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Verify your DeDe account",
    html:
      "<p> Verify your email account to complete the sign up and login into your account.</p>" +
      '<p>This link <b>expires in 6 hours</b>.<p/><p>Press <a href="' +
      currentUrl +
      "/users/verify/" +
      email +
      "/" +
      uniqueString +
      '"}>here<a/> to proceed</p>',
  };

  const newUserVerification = new userVerificationModel({
    email: email,
    uniqueString: uniqueString,
    expiresAt: Date.now() + 21600000,
  });

  await newUserVerification.save();
  transporter.sendMail(mailOptions);
};

export const verifyUser: RequestHandler = async (req, res) => {
  const userToVerify = await userVerificationModel
    .findOne({
      email: req.params.email,
    })
    .then()
    .catch((error: Error) => {
      let message =
        "An error ocurred within the application. Please contact support.";
      res.redirect("/users/notVerified/" + message);
    });

  // records exists
  if (userToVerify !== null) {
    if (userToVerify.expiresAt < Date.now()) {
      // record expired - need to erase from database: 1. UserVerificationDoc 2. UserDoc
      await userVerificationModel.deleteOne({ email: userToVerify.email });
      await userModel.deleteOne({ email: userToVerify.email }).then(() => {
        let message = "The link has expired. Please sign up again";
        //res.redirect("/users/verified/error=true&message=${" + message + "}");
        res.redirect("/users/notVerified/" + message);
      });
    } else {
      const dbUniqueString = userToVerify.uniqueString;

      if (dbUniqueString === req.params.uniqueString) {
        await userModel
          .updateOne({ email: userToVerify.email }, { verified: true })
          .then(() => {
            userVerificationModel
              .deleteOne({ email: userToVerify.email })
              .then(() => {
                res.sendFile(path.join(__dirname, "./../views/verified.html"));
              });
          });
      } else {
        let message = "An internal error happen.";
        res.redirect("/users/notVerified/" + message);
      }
    }
  } else {
    let message =
      "That account doesn't exist or has been already verified. Please sign up or sign in.";
    res.redirect("/users/notVerified/" + message);
  }
};

export const verified: RequestHandler = async (req, res) => {
  res.sendFile(path.join(__dirname, "./../views/verified.html"));
};

export const notVerified: RequestHandler = async (req, res) => {
  res.sendFile(path.join(__dirname, "./../views/notVerified.html"));
};

export const deleteUser: RequestHandler = async (req, res) => {
  const userFound = await userModel.deleteOne({ email: req.params.email });
  if (userFound) {
    return res.json(userFound);
  }
  res.json("deleting a user");
};

export const updateUser: RequestHandler = async (req, res) => {
  try {
    console.log(req.body);
    const user = await userModel.findOneAndUpdate(
      { email: req.params.email },
      req.body,
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.json(error);
  }
};

export const requestToken: RequestHandler = async (req, res) => {
  const query = {
    email: req.body.email.toString(),
    password: req.body.password.toString(),
  };
  const user = await userModel.findOne({ email: query.email });

  if (user !== null) {
    if (
      (await user.matchPassword(query.password.toString())) &&
      user.verified
    ) {
      res.status(200).json(generateToken(query.email));
    } else {
      res.status(412).json();
    }
  } else {
    res.status(409).json();
  }
};
