const mongoose = requuire('mogoose')

const taxContributionSchema = new mongoose.Schema({

    payerType: {
        type: String,
        enum : ['Individual', 'Corporate'],
        required: true
    },
    incomeBracket: {
        type: String,
        enum : ['Low', 'Medium', 'High'],
        required: true
    },
    taxType: {
        type: String,
        enum : ['Income', 'VAT', 'Corporate'],
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    year: {
        type: Number,
        required: true,
        min: 2000
    },
    region: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Region',
        required: true
    }

},{timestamps: true})


//index for performance

taxContributionSchema.index({region: 1, year: 1})   // to optimize queries that filter by region and year
taxContributionSchema.index({incomeBracket: 1})   // to optimize queries that filter by income bracket


module.exports = mongoose.model('TaxContribution', taxContributionSchema)