import { RequestHandler } from "express";
import { orderModel } from "./Order";
import { verifyToken } from "../utils/generateToken";
import { createPDF } from "../utils/PDFHelper";

export const getOrder: RequestHandler = async (req, res) => {
  const isVerified = verifyToken(
    req.headers.token + "",
    req.headers.email + ""
  );
  if (isVerified) {
    const orderFound = await orderModel.findOne({
      orderCode: req.params.orderCode,
    });
    if (orderFound) {
      return res.json(orderFound);
    } else {
      return res.status(204).json();
    }
  } else {
    return res.status(203).json();
  }
};

export const getOrders: RequestHandler = async (req, res) => {
  try {
    const orders = await orderModel.find();
    return res.json(orders);
  } catch (error) {
    res.json(error);
  }
};

export const getUserOrders: RequestHandler = async (req, res) => {
  const isVerified = verifyToken(
    req.headers.token + "",
    req.headers.email + ""
  );
  if (isVerified) {
    const orderFound = await orderModel.find({
      userEmail: req.headers.email,
    });
    if (orderFound) {
      return res.json(orderFound);
    } else {
      return res.status(204).json();
    }
  } else {
    return res.status(203).json();
  }
};

export const createOrder: RequestHandler = async (req, res) => {
  const isVerified = verifyToken(
    req.headers.token + "",
    req.headers.email + ""
  );
  if (isVerified) {
    try {
      const order = new orderModel(req.body);
      const ordersaved = await order.save();
      await createPDF(req.body.orderCode);
      // SEND EMAIL AND DELETE PDF
      res.json(ordersaved);
    } catch (error) {
      console.log(error);
      res.status(412).json();
    }
  } else {
    res.status(203).json();
  }
};
