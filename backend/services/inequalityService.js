const axios = require('axios')

const getGiniIndex = async (countryCode) => {
    try {
        const response = await axios.get
        (`https://api.worldbank.org/v2/country/${countryCode}/indicator/SI.POV.GINI?format=json`)

        const data = response.data[1]

        if (!data) {
            throw new Error('No data found for the specified country code')
        }

        const filtered = data.filter(item => item.value !== null)

        if (filtered.length === 0) {
            throw new Error("No valid Gini data available")
        }

        return filtered.slice(0, 5); // latest 5 records

    } catch (error) {
        throw new Error("Failed to fetch Gini Index data")
    }
}

module.exports = { getGiniIndex }