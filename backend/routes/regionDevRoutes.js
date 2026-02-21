const express = require('express');
const router = express.Router();

const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

const {
  createRegionData,
  getRegions,
  getInequalityIndex,
  getRegionSDGAnalysis,
  updateRegionData
  
} = require('../controllers/regionDevController');


// --- Public/Shared Routes ---
router.get('/', protect, authorize('Public', 'Admin'), getRegions);
router.get('/inequality-index', protect, authorize('Public', 'Admin'), getInequalityIndex);
router.get('/sdg-metrics/:id', protect, authorize('Public', 'Admin'), getRegionSDGAnalysis);

// --- Admin Only Routes ---
router.post('/', protect, authorize('Admin'), createRegionData);
router.put('/:id', protect, authorize('Admin'), updateRegionData);
module.exports = router;