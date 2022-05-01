import express, { Router } from "express";
import multer from "../utils/multer";
import * as ProductController from "./ProductController";

const api: Router = express.Router();

api.get("/products", ProductController.getProducts);

api.get("/products/listByCode/:code", ProductController.getProduct);

api.get("/products/sort/:mode", ProductController.sortProducts);

api.post("/products", multer.single("image"), ProductController.createProduct);

api.post("/products/delete/:code", ProductController.deleteProduct);

api.post("/products/update/:code", ProductController.updateProduct);

export default api;
