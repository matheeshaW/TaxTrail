const express = require('express')
const router = express.Router()

// Import the social program controller
const socialProgramController = require('../controllers/socialProgramController')
// Import the authentication middleware
const protect = require('../middleware/authMiddleware')
// Import the role middleware
const authorize = require('../middleware/roleMiddleware')

// Public routes
router.get('/', socialProgramController.getAllPrograms)
router.get('/:id', socialProgramController.getProgramById)

// Admin only
router.post('/', protect, authorize('admin'), socialProgramController.createProgram)
router.put('/:id', protect, authorize('admin'), socialProgramController.updateProgram)
router.delete('/:id', protect, authorize('admin'), socialProgramController.deleteProgram)

module.exports = router