//Moongose schema to store the rates of the carriers by weight
const mongoose = require("mongoose");
const { model, Schema } = mongoose;

import { carrier } from "./Carrier";

export const rates = new Schema({
  weight: {
    type: Number,
    required: true,
    trim: true,
  },
  carriers: {
    type: [carrier],
    required: true,
  },
});

export const ratesModel = model("Rates", rates);
