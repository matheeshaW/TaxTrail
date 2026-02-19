const axios = require('axios')

let cachedRates = null
let lastFetched = null
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

const getRatesFromBase = async (baseCurrency) => {
    try{

        const now = Date.now()

        if(cachedRates && (now - lastFetched) < CACHE_DURATION){
            return cachedRates
        }


        const response = await axios.get(
            `${process.env.EXCHANGE_RATE_BASE_URL_ONE}/${baseCurrency}`
        )

        if(response.data.result !== 'success'){
            throw new Error('Failed to fetch exchange rates')
        }

        cachedRates = response.data.rates
        lastFetched = now
        
        return cachedRates

    }catch(error){
        throw new Error(error.message || 'Error fetching exchange rates')
    }
}



module.exports = {
    getRatesFromBase
}


// const convertCurrency = async (form, to, amount) => {
//     try{

//         const response = await axios.get(
//             `${process.env.EXCHANGE_RATE_BASE_URL_TWO}/convert`,
//         {
//             params:{
//                 access_key: process.env.EXCHANGE_RATE_API_KEY,
//                 from,
//                 to,
//                 amount,
//                 format: 1
//             }
//         }
//     )

//     if(!response.data.success){
//         throw new Error(response.data.error?.info || 'Conversion failed')
//     }

//     return response.data.result

//     }catch(error){
//         throw new Error(error.message || 'Error converting currency')
//     }
// }
