require("dotenv").config();

import bp from "body-parser";
import cors from "cors";
import express, { Application, RequestHandler } from "express";
import promBundle from "express-prom-bundle";
import morgan from "morgan";
import ratesRoutes from "./src/routes/RatesRoutes";

const app: Application = express();
const port: number = 8000;

let helmet = require("helmet");

const mongoose = require("mongoose");
const connectionString = process.env.CARRIERS_DB_URI;

var corsOptions = {
  origin: "*",
};

const metricsMiddleware: RequestHandler = promBundle({ includeMethod: true });
app.use(metricsMiddleware);

app.use(cors(corsOptions));

app.use(bp.json());

app.use(morgan("dev"));

app.use(ratesRoutes);

app.use(helmet.hidePoweredBy());

app
  .listen(port, (): void => {
    console.log("Restapi listening on " + port);
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
