const RegionalDevelopment = require('../models/RegionalDevelopment');
const sdgService = require('../services/sdgService');

// @desc    Create new regional data
// @route   POST /api/v1/regional-development
exports.createRegionData = async (req, res) => {
  try {
    const newData = await RegionalDevelopment.create(req.body);
    
    res.status(201).json({ 
      success: true, 
      data: newData 
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Data for this region and year already exists' });
    }
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get all regional development data (with Region Names)
// @route   GET /api/v1/regional-development
exports.getRegions = async (req, res) => {
  try {
    const { year, region } = req.query;
    const query = {};
    
    if (year) query.year = year;
    if (region) query.region = region;

   
    const data = await RegionalDevelopment.find(query)
      .populate('region', 'regionName') 
      .sort({ year: -1 });
    
    res.status(200).json({ 
      success: true, 
      count: data.length, 
      data: data 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Analytical Endpoint: Get Inequality Index (FOR HIGHEST MARKS)
// @route   GET /api/v1/regional-development/inequality-index
exports.getInequalityIndex = async (req, res) => {
  try {
    const year = req.query.year || 2026; 

    // Find the region with the highest poverty rate
    const highestPoverty = await RegionalDevelopment.findOne({ year })
      .sort({ povertyRate: -1 })
      .populate('region', 'regionName');

    // Find the region with the lowest average income
    const lowestIncome = await RegionalDevelopment.findOne({ year })
      .sort({ averageIncome: 1 })
      .populate('region', 'regionName');

    if (!highestPoverty || !lowestIncome) {
      return res.status(404).json({ success: false, message: `Not enough data for the year ${year}` });
    }

    res.status(200).json({
      success: true,
      year: year,
      analysis: {
        highestPovertyRegion: highestPoverty.region.regionName,
        highestPovertyRate: highestPoverty.povertyRate,
        lowestIncomeRegion: lowestIncome.region.regionName,
        lowestIncomeValue: lowestIncome.averageIncome
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Compare Region vs Global SDG Standards (UN API Integration)
// @route   GET /api/v1/regional-development/sdg-metrics/:id

exports.getRegionSDGAnalysis = async (req, res) => {
  try {
    //search by ID now, because of the ObjectId structure
    const localData = await RegionalDevelopment.findById(req.params.id).populate('region', 'regionName');

    if (!localData) {
      return res.status(404).json({ success: false, error: 'Regional data not found' });
    }

    // Get External Data from UN Service
    const unData = await sdgService.getGlobalInequalityData();

    // Perform SDG Business Logic
    const povertyGap = localData.povertyRate - unData.globalBenchmark;
    
    let status = "MODERATE";
    let message = "On track with global standards.";
    
    if (povertyGap > 0) {
      status = "CRITICAL";
      message = `Poverty is ${povertyGap.toFixed(1)}% higher than the global benchmark.`;
    } else {
      status = "EXCELLENT";
      message = `Region is performing better than the global benchmark by ${Math.abs(povertyGap).toFixed(1)}%.`;
    }

    res.status(200).json({
      success: true,
      region: localData.region.regionName,
      year: localData.year,
      analysis: {
        localPovertyRate: localData.povertyRate,
        globalBenchmark: unData.globalBenchmark,
        gap: povertyGap.toFixed(2),
        status: status,
        recommendation: message
      },
      source: unData.source
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }

};

// @desc    Update regional data
// @route   PUT /api/v1/regional-development/:id
exports.updateRegionData = async (req, res) => {
  try {
    const data = await RegionalDevelopment.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (!data) {
      return res.status(404).json({ success: false, message: 'Data not found' });
    }

    res.status(200).json({ success: true, data: data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
// @desc    Delete regional data
// @route   DELETE /api/v1/regional-development/:id
exports.deleteRegionData = async (req, res) => {
  try {
    const data = await RegionalDevelopment.findByIdAndDelete(req.params.id);

    if (!data) {
      return res.status(404).json({ success: false, message: 'Data not found' });
    }

    res.status(200).json({ success: true, message: 'Data deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};