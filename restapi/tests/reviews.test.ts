import bp from "body-parser";
import cors from "cors";
import express, { Application, RequestHandler } from "express";
import promBundle from "express-prom-bundle";
import { Server } from "http";
import morgan from "morgan";
import request, { Response } from "supertest";
import apiReviews from "../reviews/ReviewRoutes";

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

  app.use(apiReviews);

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


describe("reviews", () => {
  it("Can get all reviews for a product", async () => {
    const response: Response = await request(app).get(
      "/reviews/listByCode/0001"
    );
    expect(response.statusCode).toBe(200);
    expect(response.type).toEqual("application/json");
  });

  it("Can not get review of a user for a product", async () => {
    const response: Response = await request(app).get(
      "/reviews/listByCodeAndEmail/0001/pablo268la@gmail.com"
    );
    expect(response.statusCode).toBe(200);
    expect(response.type).toEqual("application/json");
  });

  it("Can't get create a review without been verified", async () => {
    const response: Response = await request(app).post("/reviews").send({
      userEmail: "pablo268la@gmail.com",
      productCode: "0001",
      rating: 1,
      comment: "Tuvo güena la cami",
    });
    expect(response.statusCode).toBe(203);
    expect(response.body.message).toBe("Invalid token ");
  });
});