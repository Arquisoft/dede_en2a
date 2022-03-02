import { RequestHandler } from "express";
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
  const productFound = await productModel.find({ code: req.params.code });
  if (productFound) {
    return res.json(productFound);
  } else {
    return res.status(204).json();
  }
};

export const createProduct: RequestHandler = async (req, res) => {
  try {
    const product = new productModel(req.body);
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
};

// I don't know why the req.body is empty !!!
export const updateProduct: RequestHandler = async (req, res) => {
  try {
    console.log(req.body);
    const product = await productModel.findOneAndUpdate(
      { code: req.params.code },
      req.body,
      { new: true }
    );
    res.json(product);
  } catch (error) {
    res.json(error);
  }
};
