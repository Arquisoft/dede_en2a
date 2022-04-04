import bp from "body-parser";
import cors from "cors";
import express, { Application, RequestHandler } from "express";
import promBundle from "express-prom-bundle";
import { Server } from "http";
import morgan from "morgan";
import request, { Response } from "supertest";
import apiReviews from "../reviews/ReviewRoutes";
import apiUsers from "../users/UserRoutes";

var server: Server;

const { v4: uuidv4 } = require("uuid");
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
  app.use(apiUsers);

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

  it("Can get review of a user for a product", async () => {
    const response: Response = await request(app).get(
      "/reviews/listByCodeAndEmail/0001/pablo268la@gmail.com"
    );
    expect(response.statusCode).toBe(200);
    expect(response.type).toEqual("application/json");
  });
  

  it("Can't get create a review without been verified", async () => {
    const response: Response = await request(app).post("/reviews").send({
      userEmail: "test",
      productCode: "0001",
      rating: 1,
      comment: "Tuvo güena la cami",
    });
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe("Invalid token");
  });

  it("Can create a review ", async () => {
    let userToken = await getToken();
    const response: Response = await request(app)
      .post("/reviews")
      .set("token", userToken)
      .set("email", "test")
      .send({
        userEmail: "test",
        productCode: uuidv4(), //We use a random code so that way we can create different reviews as only 1 per person and product is allowed
        rating: 1,
        comment: "Tuvo güena la cami",
      });
    expect(response.statusCode).toBe(200);
  });

  it("Can't create a review with invalid data", async () => {
    let userToken = await getToken();
    const response: Response = await request(app)
      .post("/reviews")
      .set("token", userToken)
      .set("email", "test")
      .send({
        userEmail: "test",
        productCode: "0001",
        rating: 1,
      });
      expect(response.statusCode).toBe(412);
      expect(response.body.message).toBe("The data is not valid");
  });
});

async function getToken() {
    const token: Response = await request(app)
    .post("/users/requestToken/")
    .send({
      email: "test",
      password: "test",
    });
    return token.body
}

