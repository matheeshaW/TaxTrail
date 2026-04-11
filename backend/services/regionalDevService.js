// backend/services/regionalDevService.js


const RegionalData = require('../models/RegionalDevelopment'); 
const Region = require('../models/regionModel');

// 1. CREATE 
const createRegionalData = async (data) => {
    // Check if the region actually exists
    const regionExists = await Region.findById(data.region);
    if (!regionExists) {
        throw new Error("Region not found");
    }
    // If it exists, save the data
    return await RegionalData.create(data);
};

//  2. READ ALL 
const getAllRegionalData = async (filters) => {
    const data = await RegionalData.find(filters)
        .populate('region')
        .sort({ year: -1 })
        .skip(0)
        .limit(10);
        
    const total = await RegionalData.countDocuments(filters);
    
    return { data, total };
};

//  3. READ BY ID 
const getRegionalDataById = async (id) => {
    const data = await RegionalData.findById(id).populate('region');
    if (!data) {
        throw new Error("Regional data not found");
    }
    return data;
};

//  4. DELETE
const deleteRegionalData = async (id) => {
    const deletedData = await RegionalData.findByIdAndDelete(id);
    if (!deletedData) {
        throw new Error("Regional record not found");
    }
    return deletedData;
};


module.exports = {
    createRegionalData,
    getAllRegionalData,
    getRegionalDataById,
    deleteRegionalData
};