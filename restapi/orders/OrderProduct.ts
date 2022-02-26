const mongoose = require('mongoose')
const { model, Schema } = mongoose

export const orderProduct = new Schema({
    code: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        trim: true
    }
}, {
    versionKey: false,
    timestamps: true
})

export const orderProductModel = model('OrderProduct', orderProduct)