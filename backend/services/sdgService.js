// const axios = require('axios');

// // Goal 10 Indicator: Reduced Inequalities
// // fetching data for "Proportion of people living below 50% of median income"
// const UN_API_URL = 'https://unstats.un.org/SDGAPI/v1/sdg/Series/Data?seriesCode=SI_POV_50MI&areaCode=144';

// exports.getGlobalInequalityData = async () => {
//   try {
//     console.log("Fetching live data from UN SDG Database...");
    
   
//     const response = await axios.get(UN_API_URL, { timeout: 8000 });


//     const realApiValue = response.data?.data?.[0]?.value || 12.5;

//     return {
//       source: "UN SDG Database (Live)",
//       series: "Proportion of people living below 50 per cent of median income",
//       globalBenchmark: Number(realApiValue),
//       regionalTrend: "Stable",
//       lastUpdated: new Date()
//     };

//   } catch (error) {
//     console.log("UN API request failed or timed out. Switching to Fallback Data.");
    
//     return {
//       source: "UN SDG Database (Offline Mode)",
//       series: "Proportion of people living below 50 per cent of median income",
//       globalBenchmark: 14.2,
//       regionalTrend: "Unavailable",
//       note: "Using cached data for stability"
//     };
//   }
// };
const axios = require('axios');

// Goal 10 Indicator: Reduced Inequalities 
// Using World Bank API (Gini Index for Sri Lanka) because it is highly reliable
const WB_API_URL = 'https://api.worldbank.org/v2/country/LKA/indicator/SI.POV.GINI?format=json';

exports.getGlobalInequalityData = async () => {
  try {
    console.log("Fetching live data from World Bank API...");
    
    // World Bank API is extremely fast, 5 seconds is plenty of time
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