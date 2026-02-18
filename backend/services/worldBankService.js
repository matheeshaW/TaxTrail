const axios = require('axios')

const getPovertyData = async (countryCode) => {

    try{
        const response = await axios.get
            (`https://api.worldbank.org/v2/country/${countryCode}/indicator/SI.POV.DDAY?format=json`)
    

        const data = response.data[1]

        if(!data){
            throw new Error('No data found for the specified country code')
        }

        return data.slice(0, 5)

    } catch (error) {
        console.error('Error fetching poverty data:', error.message)
        throw error
    }



    
}

module.exports = { getPovertyData }