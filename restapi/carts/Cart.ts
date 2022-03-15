const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const cartItem = new Schema({
  productCode: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const cartSchema = new Schema(
  {
    userEmail: {
      type: String,
      required: true,
      unique: true,
    },
    products: {
      type: [cartItem],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const cartModel = model("Cart", cartSchema);
