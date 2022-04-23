import { RequestHandler } from "express";
import { productModel } from "../products/Product";
import { verifyWebID } from "../utils/WebIDValidation";
import { createPDF } from "../utils/PDFHelper";
import { orderModel } from "./Order";

export const getOrder: RequestHandler = async (req, res) => {
  if (verifyWebID(req.headers.webId + "")) {
    const orderFound = await orderModel.findOne({
      code: req.params.code,
    });

    if (orderFound) return res.json(orderFound);
    else return res.status(204).json();
  } else return res.status(203).json();
};

export const getOrders: RequestHandler = async (req, res) => {
  const isVerified = verifyWebID(req.headers.webId + "");
  if (isVerified) {
    const ordersFound = await orderModel.find({
      webId: req.headers.webId,
    });

    // If we have found orders... return them
    if (ordersFound) return res.json(ordersFound);
    else return res.status(204).json(); // No order has been found
  } else return res.status(203).json();
};

export const createOrder: RequestHandler = async (req, res) => {
  const updateStock = async (products: any) => {
    for (var i = 0; i < products.length; i++) {
      let product = await productModel.findOne({ code: products[i].code });
      product.stock = product.stock - products[i].stock;
      product.save();
    }
  };

  if (verifyWebID(req.headers.webId + ""))
    try {
      const order = new orderModel(req.body);
      updateStock(order.products);
      const orderSaved = await order.save();
      res.json(orderSaved);
    } catch (error) {
      console.log(error);
      res.status(412).json();
    }
  else res.status(203).json();
};
