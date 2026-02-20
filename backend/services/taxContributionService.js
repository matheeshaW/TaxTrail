const TaxContribution = require('../models/taxContributionModel')
const Region = require('../models/regionModel')
const mongoose = require('mongoose')

const { getRatesFromBase } = require('../services/exchangeRateService')

// create tax contribution

const createTax = async(data) => {

        //validate object id format

        if(!mongoose.Types.ObjectId.isValid(data.region)){
            const error = new Error("Invalid region ID format")
            error.statusCode = 400
            throw error
        }
        
        //check if region exists

        const existingRegion = await Region.findById(data.region)

        if(!existingRegion){
            const error = new Error("Region not found")
            error.statusCode = 404
            throw error
        }

        return await TaxContribution.create(data)
}


//get all tax contributions

const getAllTax = async (queryParams) => {

        const { region, year, incomeBracket, currency, page = 1, limit = 10 } = queryParams

        let filter = {}

        if(region){
            filter.region = region
        }
        if(year){
            filter.year = year
        }
        if(incomeBracket){
            filter.incomeBracket = incomeBracket
        }

        const skip = (page - 1) * limit

        const taxes = await TaxContribution.find(filter)
        .populate('region', 'regionName')
        .sort({createdAt: -1})
        .skip(Number(skip))
        .limit(Number(limit))

        const total = await TaxContribution.countDocuments(filter) //get total count of documets

        let formattedTaxes = taxes.map(tax => tax.toObject())

        //if currency conversion is requested

        if(currency){
            const rates = await getRatesFromBase('LKR')

            if(!rates[currency]){
                const error = new Error("Unsupported currency for conversion")
                error.statusCode = 400
                throw error
            }

            const rate = rates[currency]

            formattedTaxes = formattedTaxes.map(tax => ({
                ...tax,
                originalAmount: tax.amount,
                convertedAmount: Number((tax.amount * rate).toFixed(2)),
                convertedCurrency: currency
            }))
        }

        return {
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            data: formattedTaxes
        }

}


//get one tax contribution by id

const getTaxById = async (id) => {
     //validate object id format
    
            if(!mongoose.Types.ObjectId.isValid(id)){
                const error = new Error("Invalid tax contribution ID format")
                error.statusCode = 400
                throw error
            }
    
            const tax = await TaxContribution.findById(id)
            .populate('region', 'regionName')
    
            if(!tax){
                const error = new Error("Tax contribution not found")
                error.statusCode = 404
                throw error
            }
            return tax
}


//update tax contribution

const updateTax = async (id, data) => {
    //validate object id format

    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("Invalid tax contribution ID format")
        error.statusCode = 400
        throw error
    }

    const tax = await TaxContribution.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true }
    )

    if (!tax) {
        const error = new Error("Tax contribution not found")
        error.statusCode = 404
        throw error
    }
    return tax
}


// delete tax contribution

const deleteTax = async (id) => {
    //validate object id format

    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("Invalid tax contribution ID format")
        error.statusCode = 400
        throw error
    }

    const tax = await TaxContribution.findByIdAndDelete(id)

    if (!tax) {
        const error = new Error("Tax record not found")
        error.statusCode = 404
        throw error
    }
    return tax
}



//get summary by region

const getTaxSummaryByRegion = async () => {

    return await TaxContribution.aggregate([
        {
            $group: {
                _id: "$region",
                totalTax: { $sum: "$amount" }
            }
        },
        {
            $lookup: {
                from: "regions",
                localField: "_id",
                foreignField: "_id",
                as: "regionDetails"
            }
        },
        { $unwind: "$regionDetails" },
        {
            $project: {
                regionName: "$regionDetails.regionName",
                totalTax: 1
            }
        }
    ])
}


module.exports = {
    createTax,
    getAllTax,
    getTaxById,
    updateTax,
    deleteTax,
    getTaxSummaryByRegion
}