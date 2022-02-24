const mongoose = require('mongoose')
const { model, Schema } = mongoose

const orderProduct = new Schema({
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

const orderSchema = new Schema({
    userId: {
        type: String,
        required: true,        
    },
    products:{
        type: [orderProduct]
    },
    totalPrice:{
        type: Number,
        required: true
    },
    shippingPrice:{
        type: Number,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
})

export const orderProductModel = model('OrderProduct', orderProduct)
export const orderModel = model ('Order', orderSchema)