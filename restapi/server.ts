//require("dotenv").config();

import bp from "body-parser";
import cors from "cors";
import express, { Application, RequestHandler } from "express";
import promBundle from "express-prom-bundle";
import morgan from "morgan";
import { orderModel } from "./orders/Order";
import apiOrders from "./orders/OrderRoutes";
import apiProduct from "./products/ProductRoutes";
import apiReviews from "./reviews/ReviewRoutes";
import { userModel } from "./users/User";
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

app.get(["/*.pdf"], async function (req, res) {
  const InvoiceGenerator = require("./InvoiceGenerator");
  const PDFDocument = require("pdfkit");
  let doc = new PDFDocument();
  let aux = req.originalUrl.substring(1, req.originalUrl.length - 4);
  const orderFound = await orderModel.findOne({
    code: aux,
  });
  try {
    if (orderFound !== null) {
      const user = await userModel.findOne({ webId: orderFound.webId });

      const invoiceData = {
        addresses: {
          shipping: {
            name: "",
            address: orderFound.address,
            email: user.webId,
          },
        },
        items: orderFound.products,
        subtotal: orderFound.subtotalPrice,
        total: orderFound.totalPrice,
        shippingPrice: orderFound.shippingPrice,
        invoiceNumber: orderFound.code,
        dueDate: orderFound.date,
      };

      const ig = new InvoiceGenerator(invoiceData, doc);
      //doc.pipe(res);
      await ig.generate().pipe(res);
      doc.end();
    } else {
      res.sendFile(path.join(__dirname, "public", "pdf", "not-found.pdf"));
    }
  } catch (error) {
    console.log(error)
    res.sendFile(path.join(__dirname, "public", "pdf", "not-found.pdf"));
  }
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
