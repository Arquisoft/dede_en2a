import express, { Router } from "express";
import multer from "../utils/multer";
import * as ProdctController from "./ProductController";


const api: Router = express.Router();

api.get("/products", ProdctController.getProducts);

api.get("/products/findByCode/:code", ProdctController.getProduct);

api.get('/products/filter/:category', ProdctController.filterBy)

api.get('/products/order/:mode', ProdctController.orderBy)

api.post("/products", multer.single("image"), ProdctController.createProduct);

api.post("/products/delete/:code", ProdctController.deleteProduct);

api.post("/products/update/:code", ProdctController.updateProduct);

export default api;
