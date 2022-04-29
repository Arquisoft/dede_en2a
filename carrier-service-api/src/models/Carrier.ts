const mongoose = require("mongoose");
const { model, Schema } = mongoose;

export const carrier = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  prices: [
    {
      type: {
        type: String,
        required: true,
        trim: true,
      },
      price: {
        type: Number,
        required: true,
        trim: true,
      },
      time: {
        type: Number,
        required: true,
        trim: true,
      },
    },
  ],
});

export const carrierModel = model("Carrier", carrier);
