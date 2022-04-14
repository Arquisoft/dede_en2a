import express, { Request, Response, Router } from "express";
import {
  createCarrierRates,
  getCarrierRates,
} from "../controllers/RatesController";

const api: Router = express.Router();

api.get("/rates", getCarrierRates);
api.post("/rates/create", createCarrierRates);

export default api;
