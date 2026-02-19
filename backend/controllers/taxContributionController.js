const taxService = require('../services/taxContributionService')

// create tax contribution

const createTaxContribution = async (req, res, next) => {
    try{

        const tax = await taxService.createTax(req.body)
        
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

        const result = await taxService.getAllTax(req.query)

        res.status(200).json({
            success: true,
            total: result.total,
            page: result.page,
            pages: result.pages,
            data: result.data
        })


    }catch(error){
        return next(error)
    }
}


// get single tax contribution

const getTaxContribution = async (req, res, next) => {
    try{
        
        const tax = await taxService.getTaxById(req.params.id)
        
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

        const tax = await taxService.updateTax(req.params.id, req.body)
   

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

        const tax = await taxService.deleteTax(req.params.id)

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
    const summary = await taxService.getTaxSummaryByRegion()

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