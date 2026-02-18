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

router.get('/', authorize('Public', 'Admin'), getRegions)
router.get('/:id', authorize('Public', 'Admin'), getRegion)

//Admin routes

router.post('/', authorize('Admin'), createRegion)
router.put('/:id', authorize('Admin'), updateRegion)
router.delete('/:id', authorize('Admin'), deleteRegion)

module.exports = router