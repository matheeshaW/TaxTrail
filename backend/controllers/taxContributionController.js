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

        const { region, year, incomeBracket } = req.query

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

// update tax contribution

const updateTaxContribution = async (req, res) => {
    try{
        const tax = await TaxContribution.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true, runValidators: true}
        )

        if(!tax){
            return res.status(404).json({
                success: false,
                message: "Tax record not found"
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


//delete tax contribution


const deleteTaxContribution = async (req, res) => {
    try{

        const tax = await TaxContribution.findByIdAndDelete(req.params.id)

            if(!tax){
            return res.status(404).json({
                success: false,
                message: "Tax record not found"
            })
        }

        res.status(200).json({
            success: true,
            data: tax,
            message: "Tax contribution deleted successfully"
        })

    }catch(error){
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}


// get summary by regiion

const getTaxSummaryByRegion = async (req, res) => {
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
    res.status(500).json({
      success: false,
      message: error.message
    })
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