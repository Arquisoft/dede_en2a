import express, { Request, Response, Router } from "express";
import * as OrderController from "./OrderController";

const api: Router = express.Router();

api.get("/orders/list", OrderController.getOrders);

api.get("/orders/findByOrderCode/:orderCode", OrderController.getOrder);

api.get("/orders/findByUserEmail/:userEmail", OrderController.getUserOrders);

api.post("/orders/create", OrderController.createOrder);

api.delete("/orders/deleteByOrderId/:id", OrderController.deleteOrder);

//api.post('/orders/update', OrderController.updateOrder)

export default api;
