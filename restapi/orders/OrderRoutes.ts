import express, { Request, Response, Router } from "express";
import * as OrderController from "./OrderController";

const api: Router = express.Router();

api.get("/orders", OrderController.getUserOrders);

api.get("/orders/list", OrderController.getOrders);

api.get("/orders/findByOrderCode/:orderCode", OrderController.getOrder);

api.post("/orders", OrderController.createOrder);

export default api;
