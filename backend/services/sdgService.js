const axios = require('axios');

// Goal 10 Indicator: Reduced Inequalities 
// World Bank API (Gini Index for Sri Lanka)
const WB_API_URL = 'https://api.worldbank.org/v2/country/LKA/indicator/SI.POV.GINI?format=json';

exports.getGlobalInequalityData = async () => {
  try {
    console.log("Fetching live data from World Bank API...");
    
    
    const response = await axios.get(WB_API_URL, { timeout: 5000 });

    // Extract the latest actual value from the World Bank's array format
    const dataArray = response.data[1];
    const latestRecord = dataArray.find(record => record.value !== null);
    const realApiValue = latestRecord ? latestRecord.value : 27.7;

    return {
      source: "World Bank API (Live)",
      series: "Gini Index (Inequality Measurement)",
      globalBenchmark: Number(realApiValue), 
      regionalTrend: "Stable",
      lastUpdated: new Date()
    };

  } catch (error) {
    console.log("API request failed. Switching to Fallback Data.");
    
    return {
      source: "World Bank API (Offline Mode)",
      series: "Gini Index (Inequality Measurement)",
      globalBenchmark: 27.7,
      regionalTrend: "Unavailable",
      note: "Using cached data for stability"
    };
  }
};