import express, { Request, Response, Router } from "express";
import * as ProdctController from "./ProductController";

import multer from "../utils/multer";

const api: Router = express.Router();

api.get("/products/list", ProdctController.getProducts);

api.get("/products/findByCode/:code", ProdctController.getProduct);

api.post("/products", multer.single("image"), ProdctController.createProduct);

api.delete("/products/delete/:code", ProdctController.deleteProduct);

api.post("/products/:code", ProdctController.updateProduct);

//api.post("/photos", multer.single("image"), ProdctController.uploadPhoto);

api.get("/photos/:code", ProdctController.getPhoto);

export default api;
