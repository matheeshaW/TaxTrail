const socialProgramService = require('../services/socialProgramService')

// Helper to handle service errors
const handleError = (res, error) => {
    if (error.status) {
        return res.status(error.status).json({ message: error.message })
    }
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message })
    }
    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid ID format' })
    }
    res.status(500).json({ message: error.message || 'Server error' })
}

//Create a new social program

exports.createProgram = async (req, res) => {
    try {
        const program = await socialProgramService.createProgram(req.body, req.user.id)
        res.status(201).json(program)
    } catch (error) {
        handleError(res, error)
    }
}

//Get all social programs

exports.getAllPrograms = async (req, res) => {
    try {
        const programs = await socialProgramService.getAllPrograms()
        res.status(200).json(programs)
    } catch (error) {
        handleError(res, error)
    }
}

//Get a single social program by ID

exports.getProgramById = async (req, res) => {
    try {
        const program = await socialProgramService.getProgramById(req.params.id)
        res.status(200).json(program)
    } catch (error) {
        handleError(res, error)
    }
}

//Update a social program

exports.updateProgram = async (req, res) => {
    try {
        const programUpdated = await socialProgramService.updateProgram(req.params.id, req.body)
        res.status(200).json(programUpdated)
    } catch (error) {
        handleError(res, error)
    }
}

//Delete a social program

exports.deleteProgram = async (req, res) => {
    try {
        await socialProgramService.deleteProgram(req.params.id)
        res.status(204).send()
    } catch (error) {
        handleError(res, error)
    }
}

exports.getInequalityAnalysis = async (req, res) => {
    try {
        const result = await socialProgramService.getInequalityAnalysis(req.params.country)
        res.status(200).json(result)
    } catch (error) {
        handleError(res, error)
    }
}
