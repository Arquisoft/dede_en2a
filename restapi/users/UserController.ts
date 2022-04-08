require("dotenv").config();

import { RequestHandler } from "express";
import { sendVerificationEmail } from "../utils/emailSender";
import { generateToken } from "../utils/WebIDValidation";

import { userModel } from "./User";
import { userVerificationModel } from "./UserVerification";

import path from "path";

export const getUser: RequestHandler = async (req, res) => {
  const userFound = await userModel.findOne({ webId: req.params.webId });

  // If we found a user on the DB...
  if (userFound) return res.json(userFound);
  else return res.status(204).json(); // In any other casse
};

export const createUser: RequestHandler = async (req, res) => {
  try {
    const usersaved = await new userModel(req.body).save();
    if (process.env.MONGO_DB_URI !== undefined) {
      sendVerificationEmail(usersaved.webId);
    }
    res.json(generateToken(req.body.webId));
  } catch (error) {
    res.status(412).json({ message: "The data provided is not valid" });
  }
};

export const verifyUser: RequestHandler = async (req, res) => {
  const userToVerify = await userVerificationModel
    .findOne({
      webId: req.params.webId,
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
      await userVerificationModel.deleteOne({ webId: userToVerify.webId });
      await userModel.deleteOne({ webId: userToVerify.webId }).then(() => {
        let message = "The link has expired. Please sign up again";
        //res.redirect("/users/verified/error=true&message=${" + message + "}");
        res.redirect("/users/notVerified/" + message);
      });
    } else {
      const dbUniqueString = userToVerify.uniqueString;

      if (dbUniqueString === req.params.uniqueString) {
        await userModel
          .updateOne({ webId: userToVerify.webId }, { isVerified: true })
          .then(() => {
            userVerificationModel
              .deleteOne({ webId: userToVerify.webId })
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
    webId: req.body.webId.toString(),
  };
  const user = await userModel.findOne({ webId: query.webId });

  if (user !== null) {
    if (user.verified) res.status(200).json(generateToken(query.webId));
    else res.status(412).json();
  } else res.status(409).json();
};
