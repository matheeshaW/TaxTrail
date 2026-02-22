const SocialProgram = require('../models/SocialProgram')
const Region = require('../models/regionModel')
const { getLatestGini } = require('./inequalityService')

// Shared validation rules for create and update
const validateProgramRules = ({ targetGroup, beneficiariesCount, budgetUsed, year }) => {
    // Rule 2 — Beneficiaries must be > 0 for Low Income
    if (targetGroup === 'Low Income' && (!beneficiariesCount || beneficiariesCount <= 0)) {
        throw { status: 400, message: 'Beneficiaries count must be greater than zero for Low Income target group' }
    }

    // Rule 3 — Year must not be in the future
    if (year) {
        const currentYear = new Date().getFullYear()
        if (year > currentYear) {
            throw { status: 400, message: `Program year cannot exceed current year (${currentYear})` }
        }
    }

    // Rule 4 — Budget per beneficiary check
    if (beneficiariesCount && beneficiariesCount > 0 && budgetUsed) {
        const budgetPerPerson = budgetUsed / beneficiariesCount
        if (budgetPerPerson > 1000000) {
            throw { status: 400, message: 'Budget per beneficiary exceeds realistic threshold (1,000,000 per person)' }
        }
    }
}

const validateRegionExists = async (regionId) => {
    const regionExists = await Region.findById(regionId)
    if (!regionExists) {
        throw { status: 400, message: 'Region does not exist' }
    }
}

const createProgram = async (data, userId) => {
    const { beneficiariesCount, budgetUsed, targetGroup, year, region } = data

    validateProgramRules({ targetGroup, beneficiariesCount, budgetUsed, year })
    await validateRegionExists(region)

    const program = await SocialProgram.create({
        ...data,
        createdBy: userId
    })

    return program
}

const getAllPrograms = async () => {
    const programs = await SocialProgram.find()
        .populate('region', 'regionName')
        .populate('createdBy', 'name email')

    return programs
}

const getProgramById = async (id) => {
    const program = await SocialProgram.findById(id)
        .populate('region')
        .populate('createdBy', 'name')

    if (!program) {
        throw { status: 404, message: 'Program not found' }
    }

    return program
}

const updateProgram = async (id, body) => {
    // Filter allowed fields
    const allowedFields = ['programName', 'sector', 'targetGroup', 'beneficiariesCount', 'budgetUsed', 'year', 'region']
    const updates = {}
    for (const key of Object.keys(body)) {
        if (allowedFields.includes(key)) {
            updates[key] = body[key]
        }
    }

    // Fetch existing program to merge with updates for validation
    const existingProgram = await SocialProgram.findById(id)
    if (!existingProgram) {
        throw { status: 404, message: 'Program not found' }
    }

    const finalTargetGroup = updates.targetGroup || existingProgram.targetGroup
    const finalBeneficiaries = updates.beneficiariesCount !== undefined ? updates.beneficiariesCount : existingProgram.beneficiariesCount
    const finalBudget = updates.budgetUsed !== undefined ? updates.budgetUsed : existingProgram.budgetUsed

    validateProgramRules({
        targetGroup: finalTargetGroup,
        beneficiariesCount: finalBeneficiaries,
        budgetUsed: finalBudget,
        year: updates.year
    })

    // If region is being updated, check it exists
    if (updates.region) {
        await validateRegionExists(updates.region)
    }

    const programUpdated = await SocialProgram.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
    )

    return programUpdated
}

const deleteProgram = async (id) => {
    const programDeleted = await SocialProgram.findByIdAndDelete(id)

    if (!programDeleted) {
        throw { status: 404, message: 'Program not found' }
    }

    return programDeleted
}

const getInequalityAnalysis = async (country) => {
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

    let analysisMessage

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

    return {
        country,
        giniYear: giniData.year,
        giniIndex: giniData.giniIndex,
        totalPrograms,
        totalBudgetUsed,
        totalBeneficiaries,
        analysis: analysisMessage,
        sdgAlignment: 'SDG 10 - Reduced Inequalities'
    }
}

module.exports = {
    validateProgramRules,
    createProgram,
    getAllPrograms,
    getProgramById,
    updateProgram,
    deleteProgram,
    getInequalityAnalysis
}
