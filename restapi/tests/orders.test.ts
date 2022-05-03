import bp from "body-parser";
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

  let date = new Date();
  date.setDate(date.getDate() + 2);

  it("Can create order", async () => {
    const response: Response = await request(app)
      .post("/orders")
      .set("token", "test")
      .send({
        code: orderCode,
        webId: "test",
        address: "My house",
        products: [
          {
            code: "1",
            name: "Super SUS T-Shirt",
            price: 9.5,
            description:
              "Do you wanna show your friends that you are THE GREATEST IMPOSTER? Then this shirt is for you!",
            stock: 1,
            image: "1.png",
            category: "Clothes",
            weight: 1,
          },
        ],
        date: new Date(),
        subtotalPrice: 0,
        shippingPrice: 0,
        totalPrice: 0,
        receivedDate: date,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.code).toBe(orderCode);
    expect(response.body.webId).toBe("test");
  });

  it("Can't create order with duplicate order code", async () => {
    const response: Response = await request(app)
      .post("/orders")
      .set("token", "test")
      .send({
        code: orderCode,
        webId: "test",
        address: "My house",
        products: [],
        date: new Date(),
        subtotalPrice: 0,
        shippingPrice: 0,
        totalPrice: 0,
        receivedDate: date,
      });
    expect(response.statusCode).toBe(412);
  });

  it("Can't create order without all fields", async () => {
    const response: Response = await request(app)
      .post("/orders")
      .set("token", "test")
      .send({
        webId: "test",
      });
    expect(response.statusCode).toBe(412);
  });

  it("Can't create order without token", async () => {
    const response: Response = await request(app).post("/orders").send({
      code: orderCode,
      webId: "test",
      address: "My house",
      products: [],
      date: new Date(),
      subtotalPrice: 0,
      shippingPrice: 0,
      totalPrice: 0,
      receivedDate: date,
    });
    expect(response.statusCode).toBe(403);
  });

  it("Can get all orders being admin", async () => {
    const response: Response = await request(app)
      .get("/orders/listForAdminOrModerator")
      .set("token", "test");
    expect(response.statusCode).toBe(200);
    expect(response.type).toEqual("application/json");
  });

  it("Can't get all orders without token", async () => {
    const response: Response = await request(app).get(
      "/orders/listForAdminOrModerator"
    );
    expect(response.statusCode).toBe(403);
  });

  it("Can't get all orders without been admin", async () => {
    const response: Response = await request(app)
      .get("/orders/listForAdminOrModerator")
      .set("token", "webId");
    expect(response.statusCode).toBe(403);
  });

  it("Can get user orders", async () => {
    const response: Response = await request(app)
      .get("/orders/listForUser")
      .set("token", "test");
    expect(response.statusCode).toBe(200);
    expect(response.body[0].code).toBe("b111fff0-389d-4bee-a3f5-37dd90a5e101");
    expect(response.body[0].webId).toBe("test");
  });

  it("Can't get user orders without token", async () => {
    const response: Response = await request(app).get("/orders/listForUser");
    expect(response.statusCode).toBe(403);
  });

  it("Can get especific user order", async () => {
    const response: Response = await request(app)
      .get("/orders/findByOrderCode/" + orderCode)
      .set("token", "test");
    expect(response.statusCode).toBe(200);
    expect(response.body.code).toBe(orderCode);
    expect(response.body.webId).toBe("test");
  });

  it("Can't get user non-existing order", async () => {
    const response: Response = await request(app)
      .get("/orders/findByOrderCode/a")
      .set("token", "test");
    expect(response.statusCode).toBe(412);
  });

  it("Can't get especific order without token", async () => {
    const response: Response = await request(app).get(
      "/orders/findByOrderCode/" + orderCode
    );
    expect(response.statusCode).toBe(403);
  });

  it("Can get order from other user as admin", async () => {
    const response: Response = await request(app)
      .get("/orders/findByOrderCode/c34sfff0-389d-4bee-a3f5-37dd90a5e101")
      .set("token", "test");
    expect(response.statusCode).toBe(200);
  });

  it("Can't get order from other user", async () => {
    const response: Response = await request(app)
      .get("/orders/findByOrderCode/c34sfff0-389d-4bee-a3f5-37dd90a5e101")
      .set("token", "webId");
    expect(response.statusCode).toBe(409);
  });
});
