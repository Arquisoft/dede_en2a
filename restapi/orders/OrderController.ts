import { RequestHandler } from "express";
import { orderModel } from "./Order";
import { verifyToken } from "../utils/generateToken";

export const getOrders: RequestHandler = async (req, res) => {
  try {
    const orders = await orderModel.find();
    console.log(orders);
    return res.json(orders);
  } catch (error) {
    res.json(error);
  }
};

export const getOrder: RequestHandler = async (req, res) => {
  const orderFound = await orderModel.findOne({
    orderCode: req.params.orderCode,
  });
  if (orderFound) {
    return res.json(orderFound);
  } else {
    return res.status(204).json();
  }
};

export const getUserOrders: RequestHandler = async (req, res) => {
  const isVerified = verifyToken(req.headers.token + "", req.params.userEmail);
  if (isVerified) {
    const orderFound = await orderModel.find({
      userEmail: req.params.userEmail,
    });
    if (orderFound) {
      return res.json(orderFound);
    } else {
      return res.status(204).json();
    }
  }else{
    return res.status(203).json();
  }
};

export const createOrder: RequestHandler = async (req, res) => {
  try {
    const order = new orderModel(req.body);
    const ordersaved = await order.save();
    res.json(ordersaved);
  } catch (error) {
    if (error.name === "ValidationError") {
      // Empty field that must have content since it is required
      // 412 erorr is usually used for Precondition Failed
      res.status(412).json({
        message:
          "The data introduced is invalid. Please, fill correctly all the fields.",
      });
    }
  }
};

export const deleteOrder: RequestHandler = async (req, res) => {
  const orderFound = await orderModel.findByIdAndDelete(req.params.id);
  if (orderFound) {
    return res.json(orderFound);
  } else {
    return res.json({ message: "There is no such order id" }).status(204);
  }
};

export const updateOrder: RequestHandler = async (req, res) => {
  try {
  } catch (error) {
    res.json(error);
  }
};
