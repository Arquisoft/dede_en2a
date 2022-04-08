import mongoose from "mongoose";

const { model, Schema } = mongoose;

/* 
Crea el esquema de usuario para que todos los usuario sigan el mismo formato

versionKey : false --> Evita que mongoose le de el id por defecto
timestamps : true --> Añade dos campos a cada registro, 1. Cuando fue creado, 2. Cuando fue modificado por ultima vez
*/
export const userSchema = new Schema(
  {
    webId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

/*
Exporta el modelo de creación de un usario
*/
export const userModel = model("User", userSchema);
