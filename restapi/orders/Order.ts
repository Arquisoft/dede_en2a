const mongoose = require("mongoose");
const { model, Schema } = mongoose;

import { product } from "../products/Product";

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
    userAddress:{
      type: String,
      required: true
    },
    products: {
      type: [product],
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    subtotalPrice: {
      type: Number,
      required: true,
    },
    shippingPrice: {
      type: Number,
      required: true,
    },
    totalPrice: {
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
