const express = require('express')
const router = express.Router()


const protect = require('../middleware/authMiddleware')
const authorize = require('../middleware/roleMiddleware')

const {
    createRegion,
    getRegions,
    getRegion,
    updateRegion,
    deleteRegion
} = require('../controllers/regionController')
const { create } = require('../models/userModel')


//Public routes

router.get('/',protect, authorize('Public', 'Admin'), getRegions)
router.get('/:id',protect, authorize('Public', 'Admin'), getRegion)

//Admin routes

router.post('/',protect, authorize('Admin'), createRegion)
router.put('/:id',protect, authorize('Admin'), updateRegion)
router.delete('/:id', protect,authorize('Admin'), deleteRegion)

module.exports = router