require("dotenv").config();

import { RequestHandler } from "express";
import { sendVerificationEmail } from "../utils/emailSender";
import { generateToken } from "../utils/generateToken";
import { userModel } from "./User";
import { userVerificationModel } from "./UserVerification";

const bcrypt = require("bcryptjs");
const salt = 10;
const path = require("path");

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
    if (req.body.test !== "true") {
      sendVerificationEmail(usersaved.email);
    }
    res.json(generateToken(req.body.email));
  } catch (error) {
    console.log(error)
    res.status(412).json({ message: "The data is not valid" });
  }
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
