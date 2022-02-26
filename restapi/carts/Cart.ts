const mongoose = require('mongoose')
const { model, Schema } = mongoose

import { orderProduct } from "../orders/OrderProduct"


const cartSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    products: {
        type: [orderProduct]
    },
    totalPrice: {
        type: Number,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
})

export const cartModel = model('Cart', cartSchema)