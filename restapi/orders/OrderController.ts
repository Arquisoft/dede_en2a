import { RequestHandler } from "express";
import { orderModel } from "./Order";
import { productModel } from "../products/Product";
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
