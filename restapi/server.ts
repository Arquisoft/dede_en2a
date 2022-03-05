require ('dotenv').config()

import express, { Application, RequestHandler } from "express";
import cors from 'cors';
import bp from 'body-parser';
import promBundle from 'express-prom-bundle';
import morgan from "morgan";
import apiUser from "./users/UserRoutes"
import apiProduct from "./products/ProductRoutes"
import apiOrders from "./orders/OrderRoutes"
import apiCarts from "./carts/CartRoutes"

const app: Application = express();

const mongoose = require('mongoose')
const connectionString = process.env.MONGO_DB_URI

const options: cors.CorsOptions = {
  origin: ['http://localhost:3000']
};


const metricsMiddleware: RequestHandler = promBundle({ includeMethod: true });
app.use(metricsMiddleware);

app.use(cors(options));
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use(apiUser)
app.use(apiProduct)
app.use(apiOrders)
app.use(apiCarts)



app.listen(process.env.PORT, (): void => {
  console.log('Restapi listening on ' + process.env.PORT);
}).on("error", (error: Error) => {
  console.error('Error occured: ' + error.message);
});

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Database connected')
}).catch((err: Error) => {
  console.error(err)
})

