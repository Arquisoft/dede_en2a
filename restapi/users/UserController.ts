import { Application, RequestHandler } from "express";
import { body } from "express-validator";
import { rmSync } from "fs";
import { userModel } from "./User";

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
    const user = new userModel(req.body);
    const usersaved = await user.save();
    res.json(usersaved);
  } catch (error) {
    res.status(301).json({ message: "The data is not valid" });
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

export const signInUser: RequestHandler = async (req, res) => {
  try {
    const userFound = await userModel.findOne({ email: req.params.email });
    if (userFound.password === req.params.password) {
      res.json(userFound);
    } else {
      res.status(412).json({ message: "Incorrect password" });
    }
  } catch (error) {
    res.status(412).json({ message: "Incorrect email" });
  }
};
