const mongoose = require('mongoose')
const { model, Schema } = mongoose


/* 
Crea el esquema de usuario para que todos los usuario sigan el mismo formato

versionKey : false --> Evita que mongoose le de el id por defecto
timestamps : true --> Añade dos campos a cada registro, 1. Cuando fue creado, 2. Cuando fue modificado por ultima vez
*/
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
        //unique: true
    },
    surname: {
        type: String,
        required: true,
        trim: true
    }
}, {
    versionKey: false,
    timestamps: true
})

/*
Exporta el modelo de creacion de un usario
*/
export const userModel = model('User', userSchema)