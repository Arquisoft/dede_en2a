const mongoose = require("mongoose");
const { model, Schema } = mongoose;

export const product = new Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: true,
      enum: ["Clothes", "Decoration", "Electronics", "Miscellaneous"],
    },
    weigth: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const productModel = model("Product", product);
