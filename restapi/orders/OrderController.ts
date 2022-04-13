import { RequestHandler } from "express";
import { productModel } from "../products/Product";
import { userModel } from "../users/User";
import { verifyToken } from "../utils/generateToken";
import { createPDF } from "../utils/PDFHelper";
import { orderModel } from "./Order";

export const getOrder: RequestHandler = async (req, res) => {
  const isVerified = verifyToken(
    req.headers.token + "",
    req.headers.email + ""
  );

  const orderFound = await orderModel.findOne({
    orderCode: req.params.orderCode,
  });
  const user = await userModel.findOne({ email: req.headers.email });

  if (isVerified) {
    if (orderFound) {
      if (orderFound.userEmail === req.headers.email || user.role === "admin") {
        return res.json(orderFound);
      } else {
        return res.status(403).json();
      }
    } else {
      return res.status(412).json();
    }
  } else {
    return res.status(403).json();
  }
};

export const getOrders: RequestHandler = async (req, res) => {
  const isVerified = verifyToken(
    req.headers.token + "",
    req.headers.email + ""
  );
  const user = await userModel.findOne({ email: req.headers.email });
  if (isVerified && user.role === "admin") {
    const orders = await orderModel.find();
    return res.json(orders);
  } else {
    return res.status(403).json();
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
    return res.json(orderFound);
  } else {
    return res.status(403).json();
  }
};

export const createOrder: RequestHandler = async (req, res) => {
  const isVerified = verifyToken(
    req.headers.token + "",
    req.headers.email + ""
  );

  const updateStock = async (products: any) => {
    for (var i = 0; i < products.length; i++) {
      let product = await productModel.findOne({ code: products[i].code });
      product.stock = product.stock - products[i].stock;
      product.save();
    }
  };

  if (isVerified) {
    try {
      const order = new orderModel(req.body);
      updateStock(order.products);
      const ordersaved = await order.save();
      await createPDF(req.body.orderCode);
      res.json(ordersaved);
    } catch (error) {
      res.status(412).json();
    }
  } else {
    res.status(403).json();
  }
};
