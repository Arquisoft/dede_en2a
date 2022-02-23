import express, { Application, RequestHandler } from "express";
import cors from 'cors';
import bp from 'body-parser';
import promBundle from 'express-prom-bundle';
import morgan from "morgan";
import apiUser from "./users/UserRoutes"
import apiProduct from "./products/ProductRoutes"

const app: Application = express();
const port: number = 5000;

const mongoose = require('mongoose')
const connectionString: string = 'mongodb+srv://DedeAdmin:dedeen2a.@cluster0.b1agy.mongodb.net/dede?retryWrites=true&w=majority'

const options: cors.CorsOptions = {
  origin: ['http://localhost:3000']
};


const metricsMiddleware:RequestHandler = promBundle({includeMethod: true});
app.use(metricsMiddleware);

app.use(cors(options));
app.use(bp.json());
app.use(morgan('dev'))

app.use(apiUser)
app.use(apiProduct)

app.listen(port, ():void => {
    console.log('Restapi listening on '+ port);
}).on("error",(error:Error)=>{
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

/*
const oneUser = new userModel({
  name: "pablo",
  surname: "ee"
})

oneUser.save().then(() => {
  console.log('Aqui estamos')
  //mongoose.connection.close()
}).catch((err: Error) => {
  console.error(err)
})*/