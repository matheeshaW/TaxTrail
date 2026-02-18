const mongoose = require('mogoose')

const regionSchema = new mongoose.Schema({
    regionName : {
        type: String,
        required: [true, "Region name is required"],
        unique: true,
        trim: true
    }
}, {timestamps: true})


// index for performace

regionSchema.index({regionName: 1})

module.exports = mongoose.model('Region' , regionSchema)