import { Application, RequestHandler } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
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
  const userFound = await userModel.find({ email: req.params.email });
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
    if (error.name === "ValidationError") {
      // Empty field that must have content since it is required
      // 412 erorr is usually used for Precondition Failed
      res.status(412).json({
        message:
          "The data introduced is invalid. Please, fill correctly all the fields.",
      });
    } else if (error.name === "MongoServerError" && error.code === 11000) {
      // Duplicated key that must be unique
      // 409 error is usually used for Conflict
      res.status(409).json({
        message:
          "The email is already register. Use a diffrente one or sign in.",
      });
    }
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
