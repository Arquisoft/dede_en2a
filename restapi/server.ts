//require("dotenv").config();

import express, { Application, RequestHandler } from "express";
import cors from "cors";
import bp from "body-parser";
import promBundle from "express-prom-bundle";
import morgan from "morgan";
import apiUser from "./users/UserRoutes";
import apiProduct from "./products/ProductRoutes";
import apiOrders from "./orders/OrderRoutes";
import apiReviews from "./reviews/ReviewRoutes";

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

app.use('/uploads', express.static(path.resolve('uploads')))
app.set('view engine', 'ejs');

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