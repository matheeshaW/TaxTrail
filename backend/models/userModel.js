const mongoose = require('mongoose')
const { applyTimestamps } = require('./testModel')

const Shema = mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }
}, {timestamps: true})

module.exports = mongoose.model('User', Schema)