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
import * as http from "http";

let server: http.Server;
const path = require("path");

let helmet = require("helmet");

const app: Application = express();

const mongoose = require("mongoose");
const connectionString =
  "mongodb+srv://DedeAdmin:dedeen2a.@cluster0.b1agy.mongodb.net/dede?retryWrites=true&w=majority";

const options: cors.CorsOptions = {
  origin: ["http://localhost:3000"],
};

beforeAll(async () => {
  const metricsMiddleware: RequestHandler = promBundle({ includeMethod: true });
  app.use(metricsMiddleware);

  app.use(cors());
  app.use(bp.json());

  app.use(bp.urlencoded({ extended: true }));
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
   * Test that we can list users without any error.
   */
  it("can be listed", async () => {
    const response: Response = await request(app).get(
      "/users/findByEmail/pablo268la@gmail.com"
    );
    expect(response.statusCode).toBe(200);
  });

  /**
     * Tests that a user can be created through the productService without throwing any errors.
     
    it('can be created correctly', async () => {
        let username:string = 'Pablo'
        let email:string = 'gonzalezgpablo@uniovi.es'
        const response:Response = await request(app).post('/api/users/add').send({name: username,email: email}).set('Accept', 'application/json')
        expect(response.statusCode).toBe(200);
    });*/
});
