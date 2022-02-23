import express, { Request, Response, Router } from 'express';
import * as ProdctController from './ProductController';

const api:Router = express.Router()

api.get('/products/list', ProdctController.getProducts)

api.get('/products/findByCode/:code', ProdctController.getProduct)

export default api