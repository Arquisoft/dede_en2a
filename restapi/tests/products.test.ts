import bp from "body-parser";
import cors from "cors";
import express, { Application, RequestHandler } from "express";
import promBundle from "express-prom-bundle";
import { Server } from "http";
import morgan from "morgan";
import request, { Response } from "supertest";
import apiProduct from "../products/ProductRoutes";

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

  app.use(apiProduct);

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


describe("prodcuts", () => {
  /**
   * Test that we can get the products without error
   */
  it("Can get all products", async () => {
    const response: Response = await request(app).get("/products");
    expect(response.statusCode).toBe(200);
    expect(response.type).toEqual("application/json");
  });

  /**
   * Test that we can get a concrete product
   */
  it("Can get a product", async () => {
    const response: Response = await request(app).get(
      "/products/findByCode/0001"
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        code: "0001",
        name: "Super SUS T-Shirt",
        price: 9.5,
        image: "0001.png",
      })
    );
  });

  /**
   * Test that we can't get a non existing product'
   */
  it("Can't get non existing product", async () => {
    const response: Response = await request(app).get("/products/findByCode/0");
    expect(response.statusCode).toBe(412);
  });

  it("Can create a product correctly", async () => {
    const response: Response = await request(app).post("/products").send({
      code: uuidv4(),
      name: "testProduct",
      price: 0.99,
      description: "Another test product",
      stock: 0,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe("testProduct");
    expect(response.body.stock).toBe(0);
  });

  it("Can't get create a product with same code", async () => {
    const response: Response = await request(app).post("/products").send({
      code: "0001",
      name: "testFailProduct",
      price: 0.99,
      description: "A failure insert test product",
      stock: 0,
    });
    expect(response.statusCode).toBe(409);
  });

  it("Can't get create a product without all values", async () => {
    const response: Response = await request(app).post("/products").send({
      name: "testFailProduct",
      price: 0.99,
      description: "A failure insert test product",
      stock: 0,
    });
    expect(response.statusCode).toBe(412);
  });
});

