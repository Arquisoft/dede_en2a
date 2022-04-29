require("dotenv").config();

import { RequestHandler } from "express";

import { userModel } from "./User";

export const getUser: RequestHandler = async (req, res) => {
  const userFound = await userModel.findOne({ webId: req.params.webId });
  // If we found a user on the DB...
  if (userFound) return res.json(userFound);
  else return res.status(204).json(); // In any other case
};

export const createUser: RequestHandler = async (req, res) => {
  try {
    await new userModel(req.body).save();
    res.json();
  } catch (error) {
    res.status(412).json({ message: "The data provided is not valid" });
  }
};
