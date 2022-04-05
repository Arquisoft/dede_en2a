import bp from "body-parser";
import cors from "cors";
import express, { Application, RequestHandler } from "express";
import promBundle from "express-prom-bundle";
import { Server } from "http";
import morgan from "morgan";
import request, { Response } from "supertest";
import { userModel } from "../users/User";
import apiUser from "../users/UserRoutes";
import { userVerificationModel } from "../users/UserVerification";

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
  let userEmail = uuidv4();
  it("Can create a user correctly", async () => {
    const response: Response = await request(app).post("/users").send({
      name: "name",
      webId: "webId",
      email: userEmail,
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

  it("Can't create a user without all fields", async () => {
    const response: Response = await request(app).post("/users").send({
      name: "name",
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

  it("Can't get a user token for unverified user", async () => {
    const response: Response = await request(app)
      .post("/users/requestToken/")
      .send({
        email: userEmail,
        password: "test",
      });
    expect(response.statusCode).toBe(412);
  });

  it("Can't get a user token with an erroneous password", async () => {
    const response: Response = await request(app)
      .post("/users/requestToken/")
      .send({
        email: userEmail,
        password: "erroneous",
      });
    expect(response.statusCode).toBe(412);
  });

  it("Can't get a user token for non-existing email", async () => {
    const response: Response = await request(app)
      .post("/users/requestToken/")
      .send({
        email: "empty email",
        password: "test",
      });
    expect(response.statusCode).toBe(409);
  });

  /*
  Testing user verification
  First all incorrect tries to verify. Last one the successful one
  */
  it("Trying to verify with incorrect uniqueString", async () => {
    const prevUser = await userModel.findOne({ email: userEmail });
    expect(prevUser.verified).toBe(false);
    const response: Response = await request(app)
      .get("/users/verify/" + userEmail + "/0")
      .send();
    const postUser = await userModel.findOne({ email: userEmail });
    expect(postUser.verified).toBe(false);
    expect(response.type).toBe("text/plain");
    expect(response.header.location).toBe(
      "/users/notVerified/An%20internal%20error%20happen."
    );
  });

  it("Trying to verify a non-exisiting verification model", async () => {
    const prevUser = await userModel.findOne({ email: userEmail });
    expect(prevUser.verified).toBe(false);
    const response: Response = await request(app)
      .get(
        "/users/verify/notThis" +
          userEmail +
          "/" +
          userVerificationModel.uniqueString
      )
      .send();
    const postUser = await userModel.findOne({ email: userEmail });
    expect(postUser.verified).toBe(false);
    expect(response.type).toBe("text/plain");
    expect(response.header.location).toBe(
      "/users/notVerified/That%20account%20doesn't%20exist%20or%20has%20been%20already%20verified.%20Please%20sign%20up%20or%20sign%20in."
    );
  });

  it("Trying to verify with expired time for verifying", async () => {
    const userVerification = await userVerificationModel.findOneAndUpdate(
      {
        email: userEmail,
      },
      { expiresAt: Date.now() - 1200000 },
      { new: true }
    ); // Updating the user verification document to set the verifiedExpiringTime to an old date
    const prevUser = await userModel.findOne({ email: userEmail });
    expect(prevUser.verified).toBe(false);
    const response: Response = await request(app)
      .get("/users/verify/" + userEmail + "/" + userVerification.uniqueString)
      .send();
    expect(response.type).toBe("text/plain");
    expect(response.header.location).toBe(
      "/users/notVerified/The%20link%20has%20expired.%20Please%20sign%20up%20again"
    );
  });

  it("Trying to verify", async () => {
    let emailForTest = uuidv4();
    await request(app).post("/users").send({
      name: "name",
      webId: "webId",
      email: emailForTest,
      password: "test",
      verified: "false",
      role: "user",
    }); // Creating a new user for testing a good verification
    const userVerification = await userVerificationModel.findOne({
      email: emailForTest,
    }); // To get the userverification email string
    const prevUser = await userModel.findOne({ email: emailForTest });
    expect(prevUser.verified).toBe(false);
    const response: Response = await request(app)
      .get(
        "/users/verify/" + emailForTest + "/" + userVerification.uniqueString
      )
      .send();
    const postUser = await userModel.findOne({ email: emailForTest });
    expect(postUser.verified).toBe(true);
    expect(response.type).toBe("text/html");
  });

  it("Verified route", async () => {
    const response: Response = await request(app).get("/users/verified").send();
    expect(response.type).toBe("text/html");
  });

  it("Not verified route", async () => {
    const response: Response = await request(app)
      .get("/users/notVerified/something")
      .send();
    expect(response.type).toBe("text/html");
  });
});
