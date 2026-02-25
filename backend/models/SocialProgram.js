const mongoose = require('mongoose')

const socialProgramSchema = new mongoose.Schema({
    programName : {
        type : String,
        required : true,
        trim : true
    },
    sector : {
        type : String,
        enum : ['Welfare','Education','Health','Housing','Food Assistance'],
        required : true
    },
    targetGroup : {
        type : String,
        enum : ['Low Income', 'Middle Income', 'Rural', 'Urban Poor', 'Disabled'],
        required : true
    },
    beneficiariesCount : {
        type : Number,
        required : true,
        min : 0
    },
    budgetUsed : {
        type : Number,
        required : true,
        min : [0, 'Budget cannot be negative'],
        max : [1000000000, 'Budget cannot exceed 1 billion']
    },
    year : {
        type : Number,
        required : true,
        validate : {
            validator : function (value) {
            return value <= new Date().getFullYear();
        },
        message : 'Year cannot be in the future'
        }
    },
    region : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Region',
        required : true
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    }

} , {timestamps : true})

module.exports = mongoose.model('SocialProgram', socialProgramSchema)
