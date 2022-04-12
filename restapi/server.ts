//require("dotenv").config();

import bp from "body-parser";
import cors from "cors";
import express, { Application, RequestHandler } from "express";
import promBundle from "express-prom-bundle";
import morgan from "morgan";
import apiOrders from "./orders/OrderRoutes";
import apiProduct from "./products/ProductRoutes";
import apiReviews from "./reviews/ReviewRoutes";
import apiUser from "./users/UserRoutes";

const path = require("path");

let helmet = require("helmet");

const app: Application = express();

const mongoose = require("mongoose");
const connectionString = process.env.MONGO_DB_URI;

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
app.use(apiReviews);

app.use(helmet.hidePoweredBy());

app.use(express.static(path.join(__dirname, 'public')))

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
