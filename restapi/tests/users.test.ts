import bp from "body-parser";
import cors from "cors";
import express, { Application, RequestHandler } from "express";
import promBundle from "express-prom-bundle";
import { Server } from "http";
import morgan from "morgan";
import request, { Response } from "supertest";
import apiUser from "../users/UserRoutes";

var server: Server;
const { v4: uuidv4 } = require("uuid");

let helmet = require("helmet");

const app: Application = express();

const mongoose = require("mongoose");
const connectionString =
  "mongodb+srv://test:test@cluster0.uzcmm.mongodb.net/test?retryWrites=true&w=majority";

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

describe("users", () => {
  /**
   * Test that we can get a user without error
   */
  it("Can get a user", async () => {
    const response: Response = await request(app).get(
      "/users/findByEmail/pablo268la@gmail.com"
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        name: "Pablo Lopez Amado",
        webId: "https://pablo268.solidcommunity.net/profile/card#me",
        email: "pablo268la@gmail.com",
        verified: true,
      })
    );
  });

  /**
   * Test that we can't get a non existing user
   */
  it("Can't get non existing user", async () => {
    const response: Response = await request(app).get(
      "/users/findByEmail/something"
    );
    expect(response.statusCode).toBe(412);
  });

  /**
   * Tests that a user can be created through the productService without throwing any errors.
   * Also test that the requests returns a string, that will be the token
   */
  it("Can create a user correctly", async () => {
    const response: Response = await request(app).post("/users").send({
      name: "name",
      webId: "webId",
      email: uuidv4(),
      password: "test",
      verified: "false",
      role: "user",
    });
    expect(response.statusCode).toBe(200);
    expect(typeof response.body).toBe("string");
  });

  it("Can't create a user with email already in use ", async () => {
    const response: Response = await request(app).post("/users").send({
      name: "name",
      webId: "webId",
      email: "pablo268la@gmail.com",
      password: "test",
      verified: "false",
      role: "user",
    });
    expect(response.statusCode).toBe(412);
  });

  it("Can get a user token correctly", async () => {
    const response: Response = await request(app)
      .post("/users/requestToken/")
      .send({
        email: "test",
        password: "test",
      });
    expect(response.statusCode).toBe(200);
  });
});