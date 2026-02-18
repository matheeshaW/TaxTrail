const mongoose = require('mongoose')

const regionSchema = new mongoose.Schema({
    regionName : {
        type: String,
        required: [true, "Region name is required"],
        unique: true,
        trim: true
    }
}, {timestamps: true})


// index for performace

//regionSchema.index({regionName: 1})   didn't need it cause the unique : true already creates an index for the regionName field

module.exports = mongoose.model('Region' , regionSchema)