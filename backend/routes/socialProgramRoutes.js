const express = require('express')
const router = express.Router()

// Import the social program controller
const socialProgramController = require('../controllers/socialProgramController')
// Import the authentication middleware
const protect = require('../middleware/authMiddleware')
// Import the role middleware
const authorize = require('../middleware/roleMiddleware')

const { getInequalityAnalysis } = require("../controllers/socialProgramController");


// Public routes
router.get('/', socialProgramController.getAllPrograms)
router.get('/:id', socialProgramController.getProgramById)

router.get("/inequality-analysis/:country", getInequalityAnalysis);

// Admin only
router.post('/', protect, authorize('admin'), socialProgramController.createProgram)
router.put('/:id', protect, authorize('admin'), socialProgramController.updateProgram)
router.delete('/:id', protect, authorize('admin'), socialProgramController.deleteProgram)

module.exports = router