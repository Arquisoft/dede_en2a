//require("dotenv").config();

import express, { Application, RequestHandler } from "express";
import cors from "cors";
import bp from "body-parser";
import promBundle from "express-prom-bundle";
import morgan from "morgan";
import apiUser from "./users/UserRoutes";
import apiProduct from "./products/ProductRoutes";
import apiOrders from "./orders/OrderRoutes";
import apiCarts from "./carts/CartRoutes";
import apiReviews from "./reviews/ReviewRoutes";

const app: Application = express();

const mongoose = require("mongoose");
const connectionString =
  "mongodb+srv://DedeAdmin:dedeen2a.@cluster0.b1agy.mongodb.net/dede?retryWrites=true&w=majority";

const options: cors.CorsOptions = {
  origin: ["http://localhost:3000"],
};

const metricsMiddleware: RequestHandler = promBundle({ includeMethod: true });
app.use(metricsMiddleware);

app.use(cors());
app.use(bp.json());

app.use(bp.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(apiUser);
app.use(apiProduct);
app.use(apiOrders);
app.use(apiCarts);
app.use(apiReviews);

app
  .listen(5000, (): void => {
    console.log("Restapi listening on " + 5000);
  })
  .on("error", (error: Error) => {
    console.error("Error occured: " + error.message);
  });

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err: Error) => {
    console.error(err);
  });
