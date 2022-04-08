import { RequestHandler } from "express";
import path from "path";
import { userModel } from "../users/User";
import { verifyToken } from "../utils/WebIDValidation";
import { productModel } from "./Product";

export const getProducts: RequestHandler = async (req, res) => {
  try {
    const products = await productModel.find();
    return res.json(products);
  } catch (error) {
    res.json(error);
  }
};

export const getProduct: RequestHandler = async (req, res) => {
  const productFound = await productModel.findOne({ code: req.params.code });
  if (productFound) {
    return res.json(productFound);
  } else {
    return res.status(204).json();
  }
};

export const createProduct: RequestHandler = async (req, res) => {
  try {
    let product = new productModel(req.body);
    if (process.env.MONGO_DB_URI !== undefined)
      product.image = path.basename(req.file?.path + "");
    const productSaved = await product.save();
    res.json(productSaved);
  } catch (error) {
    if (error.name === "ValidationError") {
      // Empty field that must have content since it is required
      // 412 erorr is usually used for Precondition Failed
      res.status(412).json({
        message: "Icomplete data",
      });
    } else if (error.name === "MongoServerError" && error.code === 11000) {
      // Duplicated key that must be unique
      // 409 error is usually used for Conflict
      res.status(409).json({
        message: "The product code already exists.",
      });
    }
  }
};

export const deleteProduct: RequestHandler = async (req, res) => {
  const isVerified = verifyToken(
    req.headers.token + "",
    req.headers.email + ""
  );
  const user = await userModel.findOne({ email: req.headers.email });

  if (isVerified && user.role === "admin") {
    try {
      const productFound = await productModel.deleteOne({
        code: req.params.code,
      });
      if (productFound) {
        return res.json(productFound);
      }
    } catch (error) {
      res.status(301).json({ message: "The operation didn't succed " + error });
    }
  } else {
    res.status(203).json();
  }
};

export const updateProduct: RequestHandler = async (req, res) => {
  const isVerified = verifyToken(
    req.headers.token + "",
    req.headers.webId + ""
  );
  const user = await userModel.findOne({ webId: req.headers.webId });
  if (isVerified && (user.role === "admin" || user.role === "manager")) {
    try {
      const product = await productModel.findOneAndUpdate(
        { code: req.params.code },
        req.body,
        { new: true }
      );
      res.json(product);
    } catch (error) {
      res.json(error);
    }
  } else {
    res.status(203).json();
  }
};
