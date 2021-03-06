import { RequestHandler } from "express";
import path from "path";
import { userModel } from "../users/User";
import { verifyWebID } from "../utils/WebIDValidation";
import { productModel } from "./Product";

// Obtaining products are unauthorized operations: everybody can list the products of the shop
export const getProducts: RequestHandler = async (req, res) => {
  const products = await productModel.find();
  return res.json(products);
};

export const getProduct: RequestHandler = async (req, res) => {
  const productFound = await productModel.findOne({ code: req.params.code });
  if (productFound) {
    return res.json(productFound);
  } else {
    return res.status(412).json();
  }
};

export const createProduct: RequestHandler = async (req, res) => {
  const isVerified = await verifyWebID(req.body.webId + "");
  if (isVerified) {
    try {
      let product = new productModel(req.body);
      product.image = path.basename(req.file?.path + "");
      const productSaved = await product.save();
      res.json(productSaved);
    } catch (error) {
      if (error.name === "ValidationError") {
        // Empty field that must have content since it is required
        // 412 erorr is usually used for Precondition Failed
        res.status(412).json({
          message: "Incomplete data",
        });
      } else if (error.name === "MongoServerError" && error.code === 11000) {
        // Duplicated key that must be unique
        // 409 error is usually used for Conflict
        res.status(409).json({
          message: "The product code already exists.",
        });
      }
    }
  } else {
    return res.status(403).json();
  }
};

export const deleteProduct: RequestHandler = async (req, res) => {
  const webId = req.headers.token;
  const user = await userModel.findOne({ webId: webId });
  const isVerified = await verifyWebID(webId + "");

  if (isVerified && user.role === "admin") {
    const productFound = await productModel.deleteOne({
      code: req.params.code,
    });
    if (productFound) {
      return res.json(productFound);
    }
  } else {
    res.status(403).json();
  }
};

export const updateProduct: RequestHandler = async (req, res) => {
  const webId = req.headers.token;
  const user = await userModel.findOne({ webId: webId });
  const isVerified = await verifyWebID(webId + "");

  if (isVerified && (user.role === "admin" || user.role === "moderator")) {
    const product = await productModel.findOneAndUpdate(
      { code: req.params.code },
      req.body,
      { new: true }
    );
    res.json(product);
  } else {
    res.status(403).json();
  }
};

export const sortProducts: RequestHandler = async (req, res) => {
  return res.json(await productModel.find().sort({ price: req.params.mode }));
};
