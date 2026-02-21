const SocialProgram = require('../models/SocialProgram')
const Region = require('../models/regionModel')
const { getLatestGini } = require('../services/inequalityService')

//Create a new social program

exports.createProgram = async (req, res) => {
    try {
        const { beneficiariesCount, budgetUsed, targetGroup, year } = req.body

        // Rule 2 — Beneficiaries must be > 0 for Low Income
        if (targetGroup === 'Low Income' && (!beneficiariesCount || beneficiariesCount <= 0)) {
            return res.status(400).json({ message: 'Beneficiaries count must be greater than zero for Low Income target group' })
        }

        // Rule 3 — Year must not be in the future
        if (year) {
            const currentYear = new Date().getFullYear()
            if (year > currentYear) {
                return res.status(400).json({
                    message: `Program year cannot exceed current year (${currentYear})`
                })
            }
        }

        // Rule 4 — Budget per beneficiary check
        if (beneficiariesCount && beneficiariesCount > 0 && budgetUsed) {
            const budgetPerPerson = budgetUsed / beneficiariesCount
            if (budgetPerPerson > 1000000) {
                return res.status(400).json({ message: 'Budget per beneficiary exceeds realistic threshold (1,000,000 per person)' })
            }
        }

        // Check if region exists
        const regionExists = await Region.findById(req.body.region)
        if (!regionExists) {
            return res.status(400).json({ message: 'Region does not exist' })
        }

        const program = await SocialProgram.create({
            ...req.body,
            createdBy: req.user.id
        })
        res.status(201).json(program)
    } catch (error) {
        console.log(error)
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message })
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid ID format' })
        }
        res.status(500).json({ message: 'Server error' })
    }
}

//Get all social programs

exports.getAllPrograms = async (req, res) => {
    try {
        const programs = await SocialProgram.find()
            .populate('region', 'regionName')
            .populate('createdBy', 'name email')
        res.status(200).json(programs)
    } catch (error) {
    console.log(error)
    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid ID format' })
    }
    res.status(500).json({ message: 'Server error' })
}
}

//Get a single social program by ID

exports.getProgramById = async (req, res) => {
    try {
        const program = await SocialProgram.findById(req.params.id)
            .populate('region')
            .populate('createdBy', 'name')

        if (!program) {
            return res.status(404).json({ message: 'Program not found' })
        }

        res.status(200).json(program)
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid ID format' })
        }
        res.status(500).json({ message: 'Server error' })
    }
}

//Update a social program

exports.updateProgram = async (req, res) => {
    try {
        // Filter allowed fields
        const allowedFields = ['programName', 'sector', 'targetGroup', 'beneficiariesCount', 'budgetUsed', 'year', 'region']
        const updates = {}
        for (const key of Object.keys(req.body)) {
            if (allowedFields.includes(key)) {
                updates[key] = req.body[key]
            }
        }

        // Fetch existing program to merge with updates for validation
        const existingProgram = await SocialProgram.findById(req.params.id)
        if (!existingProgram) {
            return res.status(404).json({ message: 'Program not found' })
        }

        const finalTargetGroup = updates.targetGroup || existingProgram.targetGroup
        const finalBeneficiaries = updates.beneficiariesCount !== undefined ? updates.beneficiariesCount : existingProgram.beneficiariesCount
        const finalBudget = updates.budgetUsed !== undefined ? updates.budgetUsed : existingProgram.budgetUsed

        // Rule 2 — Beneficiaries must be > 0 for Low Income
        if (finalTargetGroup === 'Low Income' && (!finalBeneficiaries || finalBeneficiaries <= 0)) {
            return res.status(400).json({ message: 'Beneficiaries count must be greater than zero for Low Income target group' })
        }

        // Rule 3 — Year must not be in the future
        if (updates.year) {
            const currentYear = new Date().getFullYear()
            if (updates.year > currentYear) {
                return res.status(400).json({
                    message: `Program year cannot exceed current year (${currentYear})`
                })
            }
        }

        // Rule 4 — Budget per beneficiary check
        if (finalBeneficiaries && finalBeneficiaries > 0 && finalBudget) {
            const budgetPerPerson = finalBudget / finalBeneficiaries
            if (budgetPerPerson > 1000000) {
                return res.status(400).json({ message: 'Budget per beneficiary exceeds realistic threshold (1,000,000 per person)' })
            }
        }

        // If region is being updated, check it exists
        if (updates.region) {
            const regionExists = await Region.findById(updates.region)
            if (!regionExists) {
                return res.status(400).json({ message: 'Region does not exist' })
            }
        }

        const programUpdated = await SocialProgram.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        )

        res.status(200).json(programUpdated)

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message })
    }
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid ID format' })
    }
        res.status(500).json({ message: 'Server error' })
    }
}


//Delete a social program

exports.deleteProgram = async (req, res) => {
    try {
        const programDeleted = await SocialProgram.findByIdAndDelete(req.params.id)

        if (!programDeleted) {
            return res.status(404).json({ message: 'Program not found' })
        }

        res.status(204).send()
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid ID format' })
        }
        res.status(500).json({ message: 'Server error' })
    }
}

exports.getInequalityAnalysis = async (req, res) => {
    try {
        const { country } = req.params

        const giniData = await getLatestGini(country)

        const programs = await SocialProgram.find()

        const totalPrograms = programs.length

        const totalBudgetUsed = programs.reduce(
            (sum, program) => sum + program.budgetUsed,
            0
        )

        const totalBeneficiaries = programs.reduce(
            (sum, program) => sum + (program.beneficiariesCount || 0),
            0
        )

        let analysisMessage;

        if (giniData.giniIndex >= 45) {
            // Rule 5 — High inequality + few programs = policy gap
            if (totalPrograms < 3) {
                analysisMessage = "High inequality detected but limited social programs found. Policy gap identified."
            } else {
                analysisMessage = "High income inequality detected. Strong redistribution policies and expanded social welfare programs may be required."
            }
        } else if (giniData.giniIndex >= 35) {
            analysisMessage = "Moderate income inequality observed. Social programs play an important role in wealth redistribution and poverty mitigation."
        } else {
            analysisMessage = "Lower income inequality observed. Current social welfare initiatives appear relatively balanced."
        }

        res.status(200).json({
            country,
            giniYear: giniData.year,
            giniIndex: giniData.giniIndex,
            totalPrograms,
            totalBudgetUsed,
            totalBeneficiaries,
            analysis: analysisMessage,
            sdgAlignment: 'SDG 10 - Reduced Inequalities'
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
        }       
    }
