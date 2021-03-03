const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password: {
        type: String,
        required: true
    },
    enabled: {
        type: Boolean,
        required: true
    },
    user_type: {
        type: String,
        required: true,

    },
    roles: {
        type: Array
    },
    created_at:{
        type: Date,
        default: Date.now
    },
    updated_at:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('users', userSchema)