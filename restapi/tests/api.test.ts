import request, { Response } from "supertest";
import express, { Application, RequestHandler } from "express";
import cors from "cors";
import bp from "body-parser";
import promBundle from "express-prom-bundle";
import morgan from "morgan";
import apiUser from "../users/UserRoutes";
import apiProduct from "../products/ProductRoutes";
import apiOrders from "../orders/OrderRoutes";
import apiReviews from "../reviews/ReviewRoutes";

const path = require("path");

let helmet = require("helmet");

const app: Application = express();

const mongoose = require("mongoose");
const connectionString = process.env.MONGO_DB_URI;

const options: cors.CorsOptions = {
  origin: ["http://localhost:3000"],
};

beforeAll(async () => {
  const metricsMiddleware: RequestHandler = promBundle({ includeMethod: true });
  app.use(metricsMiddleware);

  app.use(cors());
  app.use(bp.json());

  app.use(bp.urlencoded({ extended: false }));
  app.use(morgan("dev"));

  app.use(apiUser);
  app.use(apiProduct);
  app.use(apiOrders);
  app.use(apiReviews);

  app.use(helmet.hidePoweredBy());

  app.use("/uploads", express.static(path.resolve("uploads")));
  app.set("view engine", "ejs");

  app.listen(5000);

  mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  mongoose.connection.close();
});

describe("user ", () => {
  /**
   * Test that we can get a user without error
   */
  it("Can get a user", async () => {
    const response: Response = await request(app).get(
      "/users/findByEmail/pablo268la@gmail.com"
    );
    expect(response.statusCode).toBe(200);
  });

  /**
   * Test that we can't get a non existing user
   */
  it("Can't get non existing user", async () => {
    const response: Response = await request(app).get(
      "/users/findByEmail/something"
    );
    expect(response.statusCode).toBe(204);
  });

  /**
   * Tests that a user can be created through the productService without throwing any errors.
   */
  it("can be created correctly", async () => {
    const response: Response = await request(app).post("/users").send({
      name: "name",
      webId: "webId",
      email: "email",
      password: "password",
      verified: "false",
      role: "user",
      test: "true",
    });
    expect(response.statusCode).toBe(200);
  });
});
