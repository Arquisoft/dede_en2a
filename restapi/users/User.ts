const mongoose = require("mongoose");
const { model, Schema } = mongoose;
const bcrypt = require("bcryptjs");

/* 
Crea el esquema de usuario para que todos los usuario sigan el mismo formato

versionKey : false --> Evita que mongoose le de el id por defecto
timestamps : true --> Añade dos campos a cada registro, 1. Cuando fue creado, 2. Cuando fue modificado por ultima vez
*/
export const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    webId: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    role:{
      type: String,
      default: 'user'
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword: String) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/*
Exporta el modelo de creacion de un usario
*/
export const userModel = model("User", userSchema);
