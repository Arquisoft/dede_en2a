import express, { Request, Response, Router } from 'express';
import * as ProdctController from './ProductController';

const api:Router = express.Router()

api.get('/products/list', ProdctController.getProducts)

api.get('/products/findByCode/:code', ProdctController.getProduct)

api.post('/products/create', ProdctController.createProduct)

api.delete('/products/delete/:code', ProdctController.deleteProduct)

api.post('/products/update/:code', ProdctController.updateProduct)

export default api