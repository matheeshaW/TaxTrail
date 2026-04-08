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

// @desc    Analytical Endpoint: Get Inequality Index 
// @route   GET /api/v1/regional-development/inequality-index
exports.getInequalityIndex = async (req, res) => {
  try {
    const year = req.query.year || 2026;

    // Fetch ALL records for the year to build the bar chart array
    const allRecords = await RegionalDevelopment.find({ year })
      .populate('region', 'regionName');

    if (!allRecords || allRecords.length === 0) {
      return res.status(404).json({ success: false, message: "No data for this year" });
    }

    const regionalData = allRecords.map(record => ({
      regionName: record.region?.regionName || 'Unknown',
      localPovertyRate: record.povertyRate
    }));

    // Get the UN/World Bank Benchmark
    const unData = await sdgService.getGlobalInequalityData();

    res.status(200).json({
      success: true,
      globalBenchmark: unData.globalBenchmark,
      regionalData: regionalData,             
      source: unData.source
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Compare Region vs Global SDG Standards (UN API Integration)
// @route   GET /api/v1/regional-development/sdg-metrics/:id
exports.getRegionSDGAnalysis = async (req, res) => {
  try {
    const localData = await RegionalDevelopment.findOne({ region: req.params.id })
      .populate('region', 'regionName')
      .sort({ year: -1 });

    if (!localData) {
      return res.status(404).json({ 
        success: false, 
        error: 'No development records found for this region' 
      });
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
      povertyRate: localData.povertyRate,
      unemploymentRate: localData.unemploymentRate,
      averageIncome: localData.averageIncome,
      accessToServicesIndex: localData.accessToServicesIndex,
      analysis: {
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