import express, { Request, Response, Router } from 'express';
import * as CartController from './CartController';

const api:Router = express.Router()

api.get('/carts/getUserCart/:userEmail', CartController.getUserCart)

api.post('/carts/create', CartController.createCart)

api.post('/carts/deleteUserCart/:userEmail', CartController.deleteCart)

api.post('/carts/addProduct', CartController.addProductToCart)

api.post('/carts/deleteProduct/:productCode', CartController.removeProductFromCart)

export default api