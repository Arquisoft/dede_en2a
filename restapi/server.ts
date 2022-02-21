import express, { Application, RequestHandler } from "express";
import cors from 'cors';
import bp from 'body-parser';
import promBundle from 'express-prom-bundle';
import mongoose from 'mongoose'
import api from "./api"; 

function connect(){
  const mongo_uri = "mongodb+srv://dede:dede@dede.sieuk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  mongoose.connect(mongo_uri).then(() => {
    const app: Application = express();
    const port: number = 5000;

    const options: cors.CorsOptions = {
      origin: ['http://localhost:3000']
    };

    const metricsMiddleware:RequestHandler = promBundle({includeMethod: true});
    app.use(metricsMiddleware);

    app.use(cors(options));
    app.use(bp.json());

    app.use("/api", api)

    app.listen(port, ():void => {
        console.log('Restapi listening on '+ port);
    }).on("error",(error:Error)=>{
        console.error('Error occured: ' + error.message);
    });
  })

}

setTimeout(connect, 5000);

