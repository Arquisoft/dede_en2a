import bp from "body-parser";
import cors from "cors";
import express, { Application, RequestHandler } from "express";
import promBundle from "express-prom-bundle";
import { Server } from "http";
import morgan from "morgan";
import request, { Response } from "supertest";
import apiOrders from "../orders/OrderRoutes";

var server: Server;

let helmet = require("helmet");

const app: Application = express();

const mongoose = require("mongoose");
const connectionString =
  "mongodb+srv://test:test@cluster0.uzcmm.mongodb.net/test?retryWrites=true&w=majority";

beforeAll(async () => {
  const metricsMiddleware: RequestHandler = promBundle({ includeMethod: true });
  app.use(metricsMiddleware);

  app.use(cors());
  app.use(bp.json());

  app.use(bp.urlencoded({ extended: false }));
  app.use(morgan("dev"));

  app.use(apiOrders);

  app.use(helmet.hidePoweredBy());

  server = app.listen(5000);

  mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  server.close();
  mongoose.connection.close();
});

describe("orders", () => {

  // TODO ADD HEADERS
  it("Can get all orders", async () => {
    const response: Response = await request(app).get("/orders/list");
    expect(response.statusCode).toBe(200);
    expect(response.type).toEqual("application/json");
  });

  it("Can not get user orders without ", async () => {
    const response: Response = await request(app).get("/orders");
    expect(response.statusCode).toBe(403);
  });
})