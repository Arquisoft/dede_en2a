import { RequestHandler } from "express";
import { productModel } from "../products/Product";
import { userModel } from "../users/User";
import { verifyWebID } from "../utils/WebIDValidation";
import { orderModel } from "./Order";

export const getOrder: RequestHandler = async (req, res) => {
  const webId = req.headers.token + "";
  if (await verifyWebID(webId)) {
    const orderFound = await orderModel.findOne({
      code: req.params.code,
    });
    if (orderFound) {
      if (webId === orderFound.webId) {
        return res.json(orderFound);
      } else {
        return res.status(409).json();
      }
    } else {
      return res.status(412).json();
    }
  } else {
    return res.status(403).json();
  }
};

export const getOrdersForAdminOrModerator: RequestHandler = async (
  req,
  res
) => {
  const webId = req.headers.token + "";
  const user = await userModel.findOne({ webId: webId });
  const isVerified = await verifyWebID(webId);
  if (isVerified && (user.role === "admin" || user.role === "manager")) {
    const ordersFound = await orderModel.find({});
    return res.json(ordersFound);
  } else return res.status(403).json();
};

export const getOrdersForUser: RequestHandler = async (req, res) => {
  const webId = req.headers.token + "";
  const isVerified = await verifyWebID(webId);
  if (isVerified) {
    const ordersFound = await orderModel.find({
      webId: webId,
    });
    return res.json(ordersFound);
  } else return res.status(403).json();
};

export const createOrder: RequestHandler = async (req, res) => {
  const updateStock = async (products: any) => {
    for (var i = 0; i < products.length; i++) {
      let product = await productModel.findOne({ code: products[i].code });
      product.stock = product.stock - products[i].stock;
      product.save();
    }
  };

  if (await verifyWebID(req.headers.token + ""))
    try {
      const order = new orderModel(req.body);
      updateStock(order.products);
      const orderSaved = await order.save();
      res.json(orderSaved);
    } catch (error) {
      res.status(412).json();
    }
  else res.status(403).json();
};
