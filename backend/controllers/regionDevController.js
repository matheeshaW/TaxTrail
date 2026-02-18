const RegionalDevelopment = require('../models/RegionalDevelopment');
const sdgService = require('../services/sdgService');

// @desc    Create new regional data
// @route   POST /api/region
exports.createRegionData = async (req, res) => {
  try {
    const newData = await RegionalDevelopment.create(req.body);
    
    res.status(201).json({ 
      success: true, 
      data: newData 
    });
  } catch (error) {
    //duplicate error -Code 11000 
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Data for this region and year already exists' });
    }
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get all regions (with filtering)
// @route   GET /api/region

exports.getRegions = async (req, res) => {
  try {
    // Allow filtering by year or regionName via URL query
    const { year, regionName } = req.query;
    const query = {};
    
    if (year) query.year = year;
    if (regionName) query.regionName = regionName;

    const data = await RegionalDevelopment.find(query).sort({ year: -1 });
    
    res.status(200).json({ 
      success: true, 
      count: data.length, 
      data: data 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Compare Region vs Global SDG Standards
// @route   GET /api/region/sdg-metrics/:regionName

exports.getRegionSDGAnalysis = async (req, res) => {
  try {
    const { regionName } = req.params;

    // 1. Get Local Data from MongoDB
    // get the latest available year for that region
    const localData = await RegionalDevelopment.findOne({ regionName }).sort({ year: -1 });

    if (!localData) {
      return res.status(404).json({ success: false, error: `No data found for ${regionName}` });
    }

    // 2. Get External Data from UN Service
    const unData = await sdgService.getGlobalInequalityData();

    // 3. Perform Business Logic (The Analysis)
    const povertyGap = localData.metrics.povertyRate - unData.globalBenchmark;
    
    let status = "MODERATE";
    let message = "On track with global standards.";
    
    if (povertyGap > 0) {
      status = "CRITICAL";
      message = `Poverty is ${povertyGap.toFixed(1)}% higher than the global benchmark.`;
    } else {
      status = "EXCELLENT";
      message = `Region is performing better than the global benchmark by ${Math.abs(povertyGap).toFixed(1)}%.`;
    }

    // 4. Send the combined report
    res.status(200).json({
      success: true,
      region: localData.regionName,
      year: localData.year,
      analysis: {
        localPovertyRate: localData.metrics.povertyRate,
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