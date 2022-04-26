const mongoose = require("mongoose");
const { model, Schema } = mongoose;
const bcrypt = require("bcryptjs");

export const userVerificationSchema = new Schema(
  {
    webId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    uniqueString: {
      type: String,
      required: true,
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const userVerificationModel = model(
  "UserVerification",
  userVerificationSchema
);
