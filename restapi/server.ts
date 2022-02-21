import express, { Application, RequestHandler } from "express";
import cors from 'cors';
import bp from 'body-parser';
import promBundle from 'express-prom-bundle';
import morgan from "morgan";

const app: Application = express();
const port: number = 5000;

const mongoose = require('mongoose')
const {model, Schema} = mongoose
const connectionString: string = 'mongodb+srv://DedeAdmin:dedeen2a.@dede.b1agy.mongodb.net/dede?retryWrites=true&w=majority'

const options: cors.CorsOptions = {
  origin: ['http://localhost:3000']
};

// mongodb+srv://DedeAdmin:dedeen2a.@dede.b1agy.mongodb.net/dede.retryWrites=true&w=majority

const metricsMiddleware:RequestHandler = promBundle({includeMethod: true});
app.use(metricsMiddleware);

app.use(cors(options));
app.use(bp.json());

app.use(morgan('dev'))

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connected')
}).catch((err: Error) => {
    console.error(err)
})


const userSchema = new Schema({
  name: {
      type : String,
      required: true,
      trim: true
  },
  surname: {
      type : String,
      required: true,
      trim: true
  }
}, {
  versionKey : false,
  timestamps : true
})

const userModel = model('User', userSchema)

const oneUser = new userModel({
  name: "pablo",
  surname: "ee"
})

oneUser.save().then(() => {
  console.log('Aqui estamos')
  mongoose.connection.close()
}).catch((err: Error) => {
  console.error(err)
})

/*
app.listen(port, ():void => {
    console.log('Restapi listening on '+ port);
}).on("error",(error:Error)=>{
    console.error('Error occured: ' + error.message);
});*/

