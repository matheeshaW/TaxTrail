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

// Protected routes (any authenticated user)
router.post('/', protect, socialProgramController.createProgram)
router.put('/:id', protect, socialProgramController.updateProgram)

// Admin only
router.delete('/:id', protect, authorize('admin'), socialProgramController.deleteProgram)

module.exports = router