const mongoose = require('mongoose')
const {model, Schema} = mongoose

const userSchema = new Schema({
    name: {
        type : String,
        required: true,
        trim: true
    },
    surname: {
        type : String,
        required: true,
        trim: true
    }
}, {
    versionKey : false,
    timestamps : true
})

export default model ('User', userSchema)