const SocialProgram = require('../models/socialProgramModel');

//Create a new social program

exports.createProgram = async (req, res) => {
    try {
        const program = await SocialProgram.create({
            ...req.body,
            createdBy: req.user.id
        });
        res.status(201).json(program)
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error' });
    }
}

//Get all social programs

exports.getAllPrograms = async (req, res) => {
    try {
        const programs = await SocialProgram.find()
            .populate('region', 'name')
            .populate('createdBy', 'name email');
        res.status(200).json(programs);
    } catch (error) {
    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    res.status(500).json({ message: 'Server error' });
}
}

//Get a single social program by ID

exports.getProgramById = async (req, res) => {
    try {
        const program = await SocialProgram.findById(req.params.id)
            .populate('region')
            .populate('createdBy', 'name');

        if (!program) {
            return res.status(404).json({ message: 'Program not found' });
        }

        res.status(200).json(program);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        res.status(500).json({ message: 'Server error' });
    }
}

//Update a social program

exports.updateProgram = async (req, res) => {
    try {
        const programUpdated = await SocialProgram.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        if (!programUpdated) {
            return res.status(404).json({ message: 'Program not found' });
        }

        res.status(200).json(programUpdated);

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
    }
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid ID format' });
    }
        res.status(500).json({ message: 'Server error' });
    }
}


//Delete a social program

exports.deleteProgram = async (req, res) => {
    try {
        const programDeleted = await SocialProgram.findByIdAndDelete(req.params.id)

        if (!programDeleted) {
            return res.status(404).json({ message: 'Program not found' });
        }

        res.status(204).send();
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        res.status(500).json({ message: 'Server error' });
    }
}
