import express, { Request, Response, Router } from "express";
import * as OrderController from "./OrderController";

const api: Router = express.Router();

api.get("/orders", OrderController.getUserOrders);

api.get("/orders/findByOrderCode/:orderCode", OrderController.getOrder);

api.post("/orders/create", OrderController.createOrder);

api.delete("/orders/deleteByOrderId/:id", OrderController.deleteOrder);


export default api;
