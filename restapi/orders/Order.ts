const mongoose = require("mongoose");
const { model, Schema } = mongoose;

import { orderProduct } from "./OrderProduct";

const orderSchema = new Schema(
  {
    orderCode: {
      type: String,
      required: true,
    },
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
    isOrderReceived: {
      type: Boolean,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const orderModel = model("Order", orderSchema);
