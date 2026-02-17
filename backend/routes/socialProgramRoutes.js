const express = require('express')
const router = express.Router()

// Import the social program controller
const socialProgramController = require('../controllers/socialProgramController')
// Import the authentication middleware
const protect = require('../middleware/authMiddleware')

// Define routes for social programs
router.post('/', protect, socialProgramController.createProgram)
router.get('/', socialProgramController.getAllPrograms)
router.get('/:id', socialProgramController.getProgramById)
router.put('/:id', protect, socialProgramController.updateProgram)
router.delete('/:id', protect, socialProgramController.deleteProgram)

module.exports = router