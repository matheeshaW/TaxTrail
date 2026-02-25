const express = require('express')
const router = express.Router()

// Import the social program controller
const socialProgramController = require('../controllers/socialProgramController')
// Import the authentication middleware
const protect = require('../middleware/authMiddleware')
// Import the role middleware
const authorize = require('../middleware/roleMiddleware')
// Import validators
const { validateCreateProgram, validateUpdateProgram, validateProgramId } = require('../validators/socialProgramValidator')

const { getInequalityAnalysis } = require("../controllers/socialProgramController");


// Public routes
router.get('/', socialProgramController.getAllPrograms)
router.get("/inequality-analysis/:country", getInequalityAnalysis);
router.get('/:id', validateProgramId, socialProgramController.getProgramById)

// Admin only
router.post('/', protect, authorize('Admin'), validateCreateProgram, socialProgramController.createProgram)
router.put('/:id', protect, authorize('Admin'), validateProgramId, validateUpdateProgram, socialProgramController.updateProgram)
router.delete('/:id', protect, authorize('Admin'), validateProgramId, socialProgramController.deleteProgram)

module.exports = router