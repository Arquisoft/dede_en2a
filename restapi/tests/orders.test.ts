import bp from "body-parser";
import cors from "cors";
import express, { Application, RequestHandler } from "express";
import promBundle from "express-prom-bundle";
import { Server } from "http";
import morgan from "morgan";
import request, { Response } from "supertest";
import apiOrders from "../orders/OrderRoutes";
import apiProducts from "../products/ProductRoutes";
import apiUsers from "../users/UserRoutes";

const { v4: uuidv4 } = require("uuid");
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
  app.use(apiUsers);
  app.use(apiProducts);

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
  let orderCode = uuidv4();

  it("Can create order", async () => {
    const token = await getToken();
    const response: Response = await request(app)
      .post("/orders")
      .set("token", token)
      .set("email", "test")
      .send({
        orderCode: orderCode,
        userEmail: "test",
        userAddress: "My house",
        products: [
          {
            code: "0001",
            name: "Super SUS T-Shirt",
            price: 9.5,
            description:
              "Do you wanna show your friends that you are THE GREATEST IMPOSTER? Then this shirt is for you!",
            stock: 1,
            image: "0001.png",
          },
        ],
        date: new Date(),
        subtotalPrice: 12.95,
        shippingPrice: 75.87,
        totalPrice: 88.82,
        isOrderReceived: false,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.orderCode).toBe(orderCode);
    expect(response.body.userEmail).toBe("test");
  });

  it("Can't create order with duplicate order code", async () => {
    const token = await getToken();
    const response: Response = await request(app)
      .post("/orders")
      .set("token", token)
      .set("email", "test")
      .send({
        orderCode: orderCode,
        userEmail: "test",
        userAddress: "My house",
        products: [],
        date: new Date(),
        subtotalPrice: 0,
        shippingPrice: 0,
        totalPrice: 0,
        isOrderReceived: false,
      });
    expect(response.statusCode).toBe(412);
  });

  it("Can't create order without all fields", async () => {
    const token = await getToken();
    const response: Response = await request(app)
      .post("/orders")
      .set("token", token)
      .set("email", "test")
      .send({
        userEmail: "test",
      });
    expect(response.statusCode).toBe(412);
  });

  it("Can't create order without token", async () => {
    const response: Response = await request(app)
      .post("/orders")
      .set("email", "test")
      .send({
        orderCode: orderCode,
        userEmail: "test",
        userAddress: "My house",
        products: [],
        date: new Date(),
        subtotalPrice: 0,
        shippingPrice: 0,
        totalPrice: 0,
        isOrderReceived: false,
      });
    expect(response.statusCode).toBe(403);
  });

  it("Can get all orders", async () => {
    const token = await getToken();
    const response: Response = await request(app)
      .get("/orders/list")
      .set("token", token)
      .set("email", "test");
    expect(response.statusCode).toBe(200);
    expect(response.type).toEqual("application/json");
  });

  it("Can't get all orders without token", async () => {
    const response: Response = await request(app)
      .get("/orders/list")
      .set("email", "test");
    expect(response.statusCode).toBe(403);
  });

  it("Can't get all orders without been admin", async () => {
    const token: Response = await request(app)
      .post("/users/requestToken/")
      .send({
        email: "test1",
        password: "test",
      });
    const response: Response = await request(app)
      .get("/orders/list")
      .set("token", token.body)
      .set("email", "test1");
    expect(response.statusCode).toBe(403);
  });

  it("Can get user orders", async () => {
    const token = await getToken();
    const response: Response = await request(app)
      .get("/orders")
      .set("token", token)
      .set("email", "test");
    expect(response.statusCode).toBe(200);
    expect(response.body[0].orderCode).toBe(
      "57bbcfbf-611c-4f6b-b087-f7671c3f0eba"
    );
    expect(response.body[0].userEmail).toBe("test");
  });

  it("Can not get user orders without token", async () => {
    const response: Response = await request(app).get("/orders");
    expect(response.statusCode).toBe(403);
  });

  it("Can get especific user order", async () => {
    const token = await getToken();
    const response: Response = await request(app)
      .get("/orders/findByOrderCode/" + orderCode)
      .set("token", token)
      .set("email", "test");
    expect(response.statusCode).toBe(200);
    expect(response.body.orderCode).toBe(orderCode);
    expect(response.body.userEmail).toBe("test");
  });

  it("Can't get user non-existing order", async () => {
    const token = await getToken();
    const response: Response = await request(app)
      .get("/orders/findByOrderCode/a")
      .set("token", token)
      .set("email", "test");
    expect(response.statusCode).toBe(412);
  });

  it("Can't get especific order without token", async () => {
    const response: Response = await request(app).get(
      "/orders/findByOrderCode/" + orderCode
    );
    expect(response.statusCode).toBe(403);
  });

  it("Can't get order from other user", async () => {
    const token = await getToken();
    const response: Response = await request(app)
      .get("/orders/findByOrderCode/23dbcfbf-611c-4f6b-b087-f7671c3f0eba")
      .set("token", token)
      .set("email", "test");
    expect(response.statusCode).toBe(403);
  });
});

async function getToken() {
  const token: Response = await request(app).post("/users/requestToken/").send({
    email: "test",
    password: "test",
  });
  return token.body;
}
