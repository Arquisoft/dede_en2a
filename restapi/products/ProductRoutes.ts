import express, { Request, Response, Router } from "express";
import * as ProdctController from "./ProductController";

import multer from "../utils/multer";

const api: Router = express.Router();

api.get("/products", ProdctController.getProducts);

api.get("/products/findByCode/:code", ProdctController.getProduct);

api.post("/products", multer.single("image"), ProdctController.createProduct);

api.delete("/products", ProdctController.deleteProduct);

api.post("/products/:code", ProdctController.updateProduct);

export default api;
