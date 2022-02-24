const mongoose = require('mongoose')
const { model, Schema } = mongoose


const product = new Schema({
    code: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    stock: {
        type: Number,
        required: true,
        trim: true
    }
}, {
    versionKey: false,
    timestamps: true
})


export const productModel = model('Product', product)