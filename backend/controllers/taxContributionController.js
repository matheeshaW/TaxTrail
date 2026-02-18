const TaxContribution = require('../models/taxContributionModel')
const Region = require('../models/regionModel')

// create tax contribution

const createTaxContribution = async (req, res) => {
    try{

        const {region} = req.body

        const existingRegion = await Region.findById(region)

        if(!existingRegion){
            return res.status(404).json({
                success: false,
                message: "Region not found"
            })
        }

        const tax = await TaxContribution.create(req.body)

        res.status(201).json({
            success: true,
            data: tax
        })
    }catch(error){
        res.status(400).json({
            success: false,
            message: error.message
        })

    }
}

//get all tax contributions

const getTaxContributions = async (req, res) => {
    try{

        const { reigion, year, incomeBracket } = req.quary

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
        populate('region', 'regionName')
        .sort({createdAt: -1})

        res.status(200).json({
            success: true,
            count: taxes.length,
            data: taxes
        })
    }catch(error){
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}


// get single tax contribution

const getTaxContribution = async (req, res) => {
    try{
        const tax = await TaxContribution.findById(req.params.id)
        .populate('region', 'regionName')

        if(!tax){
            return res.status(404).json({
                success: false,
                message: "Tax contribution not found"
            })
        }

        res.status(200).json({
            success: true,
            data: tax
        })


    }catch(error){
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}




module.exports = {
    createTaxContribution,
    getTaxContributions

}