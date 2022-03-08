const mongoose = require("mongoose");
const { model, Schema } = mongoose;

import { orderProduct } from "./OrderProduct";

const orderSchema = new Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    products: {
      type: [orderProduct],
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    shippingPrice: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const orderModel = model("Order", orderSchema);
