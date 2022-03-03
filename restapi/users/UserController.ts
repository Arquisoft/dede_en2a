import { RequestHandler } from "express";
import { body } from "express-validator";
import { generateToken } from "../utils/generateToken";
import { userModel, userSchema } from "./User";

const bcrypt = require("bcryptjs");
const salt = 10;

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
    res.json(generateToken(req.body.email));
  } catch (error) {
    res.status(412).json({ message: "The data is not valid" });
  }
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
  const query = { email: req.body.email.toString(), password: req.body.password.toString() };
  const user = await userModel.findOne({ query });

  if (user !== null) {
    if (await user.matchPassword(query.password)) {
      res.json(generateToken(query.email));
    } else {
      res.status(412).json();
    }
  } else {
    res.status(409).json();
  }
};
