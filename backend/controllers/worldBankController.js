const { getPovertyData } = require('../services/worldBankService')

const fetchPovertyRate = async (req, res) => {

    try {
        const { country } = req.params

        if (typeof country !== 'string' || country.trim().length === 0) {
            return res.status(400).json({ message: 'Invalid or missing country parameter' })
        }
        const data = await getPovertyData(country)

        res.status(200).json({
            country,
            indicator: 'Poverty Rate',
            data
        })
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching poverty data', error: error.message })
    }
}

module.exports = { fetchPovertyRate }