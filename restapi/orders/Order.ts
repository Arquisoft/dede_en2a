const mongoose = require('mongoose')
const { model, Schema } = mongoose

import { userModel } from "../users/User";
import { productModel } from "../products/Product";

const orderSchema = new Schema({
    user: {
        type: userModel,
        required: true,        
    },
    products:{
        type: [productModel]
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

export const orderModel = model ('Order', orderSchema)