import express, { Router } from "express";
import * as OrderController from "./OrderController";

const api: Router = express.Router();

api.get("/orders/listForUser", OrderController.getOrdersForUser);

api.get(
  "/orders/listForAdminOrModerator",
  OrderController.getOrdersForAdminOrModerator
);

api.get("/orders/findByOrderCode/:code", OrderController.getOrder);

api.post("/orders", OrderController.createOrder);

export default api;
