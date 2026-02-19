const express = require('express');
const router = express.Router()

const protect = require('../middleware/authMiddleware')
const authorize = require('../middleware/roleMiddleware')
const validate = require('../middleware/validateMiddleware')
const { createTaxValidator } = require('../validators/taxContributionValidator')

const {
    createTaxContribution,
    getTaxContributions,
    getTaxContribution,
    deleteTaxContribution,
    updateTaxContribution,
    getTaxSummaryByRegion
} = require('../controllers/taxContributionController')


//public (authenticated )routes


router.get('/', protect, authorize('Admin', 'Public'), getTaxContributions)
router.get('/:id', protect, authorize('Admin', 'Public'), getTaxContribution)
router.get('/summary/region', protect, authorize('Admin', 'Public'), getTaxSummaryByRegion)


//Admin routes

router.post('/', protect, authorize('Admin'), createTaxValidator, validate, createTaxContribution)
router.delete('/:id', protect, authorize('Admin'), deleteTaxContribution)
router.put('/:id', protect, authorize('Admin'), updateTaxContribution)

module.exports = router





