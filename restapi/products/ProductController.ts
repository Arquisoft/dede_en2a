import { RequestHandler } from "express";
import { productModel } from "./Product";

export const getProducts: RequestHandler = async (req, res) => {
    try {
        const products = await productModel.find()
        return res.json(products)
    } catch (error) {
        res.json(error)
    }
}

export const getProduct: RequestHandler = async (req, res) => {
    const productFound = await productModel.find({ email: req.params.email });
    if (productFound) {
        return res.json(productFound)
    } else {
        return res.status(204).json();
    }
}