const SocialProgram = require('../models/SocialProgram');
const Region = require('../models/regionModel');
const { getLatestGini } = require('../services/inequalityService');

//Create a new social program

exports.createProgram = async (req, res) => {
    try {
        // Check if region exists
        const regionExists = await Region.findById(req.body.region);
        if (!regionExists) {
            return res.status(400).json({ message: 'Region does not exist' });
        }

        const program = await SocialProgram.create({
            ...req.body,
            createdBy: req.user.id
        });
        res.status(201).json(program)
    } catch (error) {
        console.log(error)
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        res.status(500).json({ message: 'Server error' });
    }
}

//Get all social programs

exports.getAllPrograms = async (req, res) => {
    try {
        const programs = await SocialProgram.find()
            .populate('region', 'regionName')
            .populate('createdBy', 'name email');
        res.status(200).json(programs);
    } catch (error) {
    console.log(error)
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
        // Filter allowed fields
        const allowedFields = ['programName', 'sector', 'targetGroup', 'beneficiariesCount', 'budgetUsed', 'year', 'region'];
        const updates = {};
        for (const key of Object.keys(req.body)) {
            if (allowedFields.includes(key)) {
                updates[key] = req.body[key];
            }
        }

        // If region is being updated, check it exists
        if (updates.region) {
            const regionExists = await Region.findById(updates.region);
            if (!regionExists) {
                return res.status(400).json({ message: 'Region does not exist' });
            }
        }

        const programUpdated = await SocialProgram.findByIdAndUpdate(
            req.params.id,
            updates,
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

exports.getInequalityAnalysis = async (req, res) => {
    try {
        const { country } = req.params

        const giniData = await getLatestGini(country)

        const programs = await SocialProgram.find()

        const totalBudgetUsed = programs.reduce(
            (sum, program) => sum + program.budgetUsed,
            0
        )

        let analysisMessage

        if (giniData.giniIndex > 45) {
            analysisMessage = "High inequality detected. Increased social spending may be necessary.";
        } else if (giniData.giniIndex > 35) {
            analysisMessage = "Moderate inequality observed. Social programs play a key role in redistribution.";
        } else {
            analysisMessage = "Relatively low inequality. Current social programs may be effective.";
        }

        res.status(200).json({
            country,
            giniYear: giniData.year,
            giniIndex: giniData.giniIndex,
            totalPrograms: programs.length,
            totalBudgetUsed,
            analysis: analysisMessage
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
        }       
    }
