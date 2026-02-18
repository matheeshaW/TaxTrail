const express = require('express');
const router = express.Router();
const { createRegionData, getRegions, getRegionSDGAnalysis } = require('../controllers/regionDevController'); 

// Public Routes 
router.get('/', getRegions);
router.get('/sdg-metrics/:regionName', getRegionSDGAnalysis);

// Protected Routes (Simulated for now - we will add auth middleware later)
router.post('/', createRegionData);

module.exports = router;