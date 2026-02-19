const TaxContribution = require('../models/taxContributionModel')
const Region = require('../models/regionModel')
const mongoose = require('mongoose')

const { getRatesFromBase } = require('../services/exchangeRateService')

// create tax contribution

const createTaxContribution = async (req, res, next) => {
    try{

        const {region} = req.body

        //validate object id format

        if(!mongoose.Types.ObjectId.isValid(region)){
            const error = new Error("Invalid region ID format")
            error.statusCode = 400
            return next(error)
        }
        
        //check if region exists

        const existingRegion = await Region.findById(region)

        if(!existingRegion){
            const error = new Error("Region not found")
            error.statusCode = 404
            return next(error)
        }

        const tax = await TaxContribution.create(req.body)

        res.status(201).json({
            success: true,
            data: tax
        })
    }catch(error){
        return next(error)
    }
}

//get all tax contributions

const getTaxContributions = async (req, res, next) => {
    try{

        const { region, year, incomeBracket, currency } = req.query

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

        const taxes = await TaxContribution.find(filter)
        .populate('region', 'regionName')
        .sort({createdAt: -1})


        let formattedTaxes = taxes.map(tax => tax.toObject())

        //if currency conversion is requested

        if(currency){
            const rates = await getRatesFromBase('LKR')

            if(!rates[currency]){
                const error = new Error("Unsupported currency for conversion")
                error.statusCode = 400
                return next(error)
            }

            const rate = rates[currency]

            formattedTaxes = formattedTaxes.map(tax => ({
                ...tax,
                originalAmount: tax.amount,
                convertedAmount: Number((tax.amount * rate).toFixed(2)),
                convertedCurrency: currency
            }))
        }

        res.status(200).json({
            success: true,
            count: formattedTaxes.length,
            data: formattedTaxes
        })


    }catch(error){
        return next(error)
    }
}


// get single tax contribution

const getTaxContribution = async (req, res, next) => {
    try{
        //validate object id format

        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            const error = new Error("Invalid tax contribution ID format")
            error.statusCode = 400
            return next(error)
        }

        const tax = await TaxContribution.findById(req.params.id)
        .populate('region', 'regionName')

        if(!tax){
            const error = new Error("Tax contribution not found")
            error.statusCode = 404
            return next(error)
        }

        res.status(200).json({
            success: true,
            data: tax
        })


    }catch(error){
        return next(error)
    }
}

// update tax contribution

const updateTaxContribution = async (req, res, next) => {
    try{

        //validate object id format
        
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            const error = new Error("Invalid tax contribution ID format")
            error.statusCode = 400
            return next(error)
        }

        const tax = await TaxContribution.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true, runValidators: true}
        )

        if(!tax){
            const error = new Error("Tax contribution not found")
            error.statusCode = 404
            return next(error)
        }

        res.status(200).json({
            success: true,
            data: tax
        })

    }catch(error){
        return next(error)
    }
}


//delete tax contribution


const deleteTaxContribution = async (req, res, next) => {
    try{

        //validate object id format
        
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            const error = new Error("Invalid tax contribution ID format")
            error.statusCode = 400
            return next(error)
        }

        const tax = await TaxContribution.findByIdAndDelete(req.params.id)

            if(!tax){
            const error = new Error("Tax record not found")
            error.statusCode = 404
            return next(error)
        }

        res.status(200).json({
            success: true,
            data: tax,
            message: "Tax contribution deleted successfully"
        })

    }catch(error){
        return next(error)
    }
}


// get summary by regiion

const getTaxSummaryByRegion = async (req, res, next) => {
  try {
    const summary = await TaxContribution.aggregate([
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

    res.status(200).json({
      success: true,
      data: summary
    })
  } catch (error) {
    return next(error)
  }
}




module.exports = {
    createTaxContribution,
    getTaxContributions,
    getTaxContribution,
    updateTaxContribution,
    deleteTaxContribution,
    getTaxSummaryByRegion

}