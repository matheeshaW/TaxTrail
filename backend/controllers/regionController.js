const Region = require('../models/regionModel')

// create region

const createRegion = async (req, res) => {
    try{
        const {regionName} = req.body

        const region = await Region.create({regionName})

        res.status(201).json({
            success: true,
            data: region
        })

    }catch(error){

        res.status(400).json({
            success: false,
            message: error.message
        })

    }

}


// get all regions

const getRegions = async (req, res) => {
    try{
        const region = await Region.find().sort({createdAt: -1})

        res.status(200).json({
            success: true,
            count: region.length,
            data: region
        })

    }catch(error){

        res.status(400).json({
            success: false,
            message: error.message
        })

    }


}


// get single region


const getRegion = async (req, res) => {
    try{
       
        const region = await Region.findById(req.params.id)


        if (!region) {
            return res.status(404).json({
                success: false,
                message: "Region not found"
            })
        }

        res.status(200).json({
            success: true,
            data: region
        })

    }catch(error){

        res.status(400).json({
            success: false,
            message: error.message
        })

    }

}



//update region


const updateRegion = async (req, res) => {
    try{
       
        const region = await Region.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true, runValidators: true}
        )


        if (!region) {
            return res.status(404).json({
                success: false,
                message: "Region not found"
            })
        }

        res.status(200).json({
            success: true,
            data: region
        })

    }catch(error){

        res.status(400).json({
            success: false,
            message: error.message
        })

    }

}


// delete region

const deleteRegion = async (req, res) => {
    try{
       
        const region = await Region.findByIdAndDelete(req.params.id)

        if (!region) {
            return res.status(404).json({
                success: false,
                message: "Region not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Region deleted successfully"
        })

    }catch(error){

        res.status(400).json({
            success: false,
            message: error.message
        })

    }

}


module.exports = {
    createRegion,
    getRegions,
    getRegion,
    updateRegion,
    deleteRegion
}