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
const fs = require("fs");

let helmet = require("helmet");

const app: Application = express();

const mongoose = require("mongoose");
const connectionString = process.env.MONGO_DB_URI;

const metricsMiddleware: RequestHandler = promBundle({ includeMethod: true });
app.use(metricsMiddleware);

app.use(cors());
app.use(bp.json());

app.use(bp.urlencoded({ extended: true, limit: "8mb" }));
app.use(morgan("dev"));

app.use(apiUser);
app.use(apiProduct);
app.use(apiOrders);
app.use(apiReviews);

app.use(helmet.hidePoweredBy());

// Method to serve correct images and not-found in case it does not exists
app.get(["/*.png", "/undefined"], function (req, res) {
  const a = path.join(__dirname, "public", "not-found.png");
  const ipath = path.join(__dirname, "public", req.originalUrl);
  const savePath = path.resolve(ipath);

  if (fs.existsSync(savePath)) {
    res.sendFile(savePath);
  } else {
    res.sendFile(a);
  }
});

app.get(["/*.pdf"], function (req, res) {
  const newpath = path.join(__dirname, "public", "pdf", req.originalUrl);
  const savePath = path.resolve(newpath);

  if (fs.existsSync(savePath)) {
    res.sendFile(savePath);
  }else res.status(505) 
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public", "pdf")));

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
