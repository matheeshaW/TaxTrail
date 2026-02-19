const axios = require('axios')


const convertCurrency = async (form, to, amount) => {
    try{

        const response = await axios.get(
            `${process.env.EXCHANGE_RATE_BASE_URL_TWO}/convert`,
        {
            params:{
                access_key: process.env.EXCHANGE_RATE_API_KEY,
                from,
                to,
                amount,
                format: 1
            }
        }
    )

    if(!response.data.success){
        throw new Error(response.data.error?.info || 'Conversion failed')
    }

    return response.data.result

    }catch(error){
        throw new Error(error.message || 'Error converting currency')
    }
}




module.exports = {
    convertCurrency
}



