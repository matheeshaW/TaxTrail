const mongoose = require('mongoose')

const regionSchema = new mongoose.Schema({
    regionName : {
        type : String,
        required : [true, 'Region name is required'],
        unique : true,
        trim : true
    }
}, { timestamps : true })

module.exports = mongoose.model('Region', regionSchema)
