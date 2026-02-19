const express = require('express');
const router = express.Router()

const protect = require('../middleware/authMiddleware')
const authorize = require('../middleware/roleMiddleware')

const {
    createTaxContribution,
    getTaxContributions,
    getTaxContribution,
    deleteTaxContribution,
    updateTaxContribution
} = require('../controllers/taxContributionController')


//public (authenticated )routes


router.get('/', protect, authorize('Admin', 'Public'), getTaxContributions)
router.get('/:id', protect, authorize('Admin', 'Public'), getTaxContribution)


//Admin routes

router.post('/', protect, authorrize('Admin'), createTaxContribution)
router.delete('/:id', protect, authorize('Admin'), deleteTaxContribution)
router.patch('/:id', protect, authorize('Admin'), updateTaxContribution)

module.exports = router





