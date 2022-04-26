const mongoose = require("mongoose");
const { model, Schema } = mongoose;

export const reviewSchema = new Schema(
  {
    webId: {
      type: String,
      required: true,
      trim: true,
    },
    productCode: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

reviewSchema.index({ webId: 1, productCode: 1 }, { unique: true });

export const reviewModel = model("Review", reviewSchema);
