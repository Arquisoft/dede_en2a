import bp from "body-parser";
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
  const code = uuidv4();

  it("Can get all reviews for a product", async () => {
    const response: Response = await request(app).get("/reviews/listByCode/1");
    expect(response.statusCode).toBe(200);
    expect(response.type).toEqual("application/json");
  });

  it("Can create a review ", async () => {
    const response: Response = await request(app)
      .post("/reviews")
      .set("token", "test")
      .send({
        webId: "test",
        productCode: code, //We use a random code so that way we can create different reviews as only 1 per person and product is allowed
        rating: 1,
        comment: "Tuvo güena la cami",
      });
    expect(response.statusCode).toBe(200);
  });

  it("Can get review of a user for a product. Response length 1", async () => {
    const response: Response = await request(app).get(
      "/reviews/listByCodeAndWebId/" + code + "/test"
    );
    expect(response.statusCode).toBe(200);
    expect(response.type).toEqual("application/json");
    expect(response.body.length).toBe(1)
  });

  it("Can get non-existing review of a user for a product. Response length 0", async () => {
    const response: Response = await request(app).get(
      "/reviews/listByCodeAndWebId/0/test"
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0)
  });

  it("Can't get create a review without webId on headers for verification", async () => {
    const response: Response = await request(app).post("/reviews").send({
      webId: "test",
      productCode: "1",
      rating: 1,
      comment: "Tuvo güena la cami",
    });
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe("Invalid webId");
  });

  it("Can't create a review with invalid data", async () => {
    const response: Response = await request(app)
      .post("/reviews")
      .set("token", "test")
      .send({
        webId: "test",
        productCode: "0001",
        rating: 1,
      });
    expect(response.statusCode).toBe(412);
    expect(response.body.message).toBe("The data is not valid");
  });
});
