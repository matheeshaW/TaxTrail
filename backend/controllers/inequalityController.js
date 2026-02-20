const { getLatestGini } = require('../services/inequalityService')

const fetchInequality = async (req, res) => {
    try {
        const { country } = req.params

        if (typeof country !== 'string' || country.trim().length === 0) {
            return res.status(400).json({ message: 'Invalid or missing country parameter' })
        }

        const data = await getLatestGini(country)

        res.status(200).json({
            country,
            indicator: 'Gini Index (Income Inequality)',
            data
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { fetchInequality }