const mongoose = require('mongoose')

// Constants
const BUDGET_PER_PERSON_THRESHOLD = 1_000_000
const VALID_SECTORS = ['Welfare', 'Education', 'Health', 'Housing', 'Food Assistance']
const VALID_TARGET_GROUPS = ['Low Income', 'Middle Income', 'Rural', 'Urban Poor', 'Disabled']

// Validate create program request
const validateCreateProgram = (req, res, next) => {
    const { programName, sector, targetGroup, beneficiariesCount, budgetUsed, year, region } = req.body
    const errors = []

    // Required fields
    if (!programName || programName.trim().length === 0) {
        errors.push('Program name is required')
    } else if (programName.trim().length > 100) {
        errors.push('Program name must not exceed 100 characters')
    }

    if (!sector) {
        errors.push('Sector is required')
    } else if (!VALID_SECTORS.includes(sector)) {
        errors.push(`Sector must be one of: ${VALID_SECTORS.join(', ')}`)
    }

    if (!targetGroup) {
        errors.push('Target group is required')
    } else if (!VALID_TARGET_GROUPS.includes(targetGroup)) {
        errors.push(`Target group must be one of: ${VALID_TARGET_GROUPS.join(', ')}`)
    }

    if (beneficiariesCount === undefined || beneficiariesCount === null) {
        errors.push('Beneficiaries count is required')
    } else if (!Number.isInteger(beneficiariesCount) || beneficiariesCount < 0) {
        errors.push('Beneficiaries count must be a positive integer')
    }

    if (budgetUsed === undefined || budgetUsed === null) {
        errors.push('Budget used is required')
    } else if (typeof budgetUsed !== 'number' || budgetUsed < 0) {
        errors.push('Budget must be a positive number')
    }

    if (!year) {
        errors.push('Year is required')
    } else if (!Number.isInteger(year) || year < 1900) {
        errors.push('Year must be a valid integer (1900 or later)')
    }

    if (!region) {
        errors.push('Region is required')
    } else if (!mongoose.Types.ObjectId.isValid(region)) {
        errors.push('Invalid region ID format')
    }

    // Business Rule 2 — Low Income must have beneficiaries > 0
    if (targetGroup === 'Low Income' && beneficiariesCount !== undefined && beneficiariesCount <= 0) {
        errors.push('Beneficiaries count must be greater than zero for Low Income target group')
    }

    // Business Rule 3 — Year cannot exceed current year
    if (year) {
        const currentYear = new Date().getFullYear()
        if (year > currentYear) {
            errors.push(`Program year cannot exceed current year (${currentYear})`)
        }
    }

    // Business Rule 4 — Budget per beneficiary threshold
    if (beneficiariesCount > 0 && budgetUsed) {
        const budgetPerPerson = budgetUsed / beneficiariesCount
        if (budgetPerPerson > BUDGET_PER_PERSON_THRESHOLD) {
            errors.push(`Budget per beneficiary exceeds threshold (${BUDGET_PER_PERSON_THRESHOLD.toLocaleString()} per person)`)
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors })
    }

    next()
}

// Validate update program request (only validates fields that are present)
const validateUpdateProgram = (req, res, next) => {
    const { programName, sector, targetGroup, beneficiariesCount, budgetUsed, year, region } = req.body
    const errors = []

    if (programName !== undefined) {
        if (programName.trim().length === 0) {
            errors.push('Program name cannot be empty')
        } else if (programName.trim().length > 100) {
            errors.push('Program name must not exceed 100 characters')
        }
    }

    if (sector !== undefined && !VALID_SECTORS.includes(sector)) {
        errors.push(`Sector must be one of: ${VALID_SECTORS.join(', ')}`)
    }

    if (targetGroup !== undefined && !VALID_TARGET_GROUPS.includes(targetGroup)) {
        errors.push(`Target group must be one of: ${VALID_TARGET_GROUPS.join(', ')}`)
    }

    if (beneficiariesCount !== undefined) {
        if (!Number.isInteger(beneficiariesCount) || beneficiariesCount < 0) {
            errors.push('Beneficiaries count must be a positive integer')
        }
    }

    if (budgetUsed !== undefined) {
        if (typeof budgetUsed !== 'number' || budgetUsed < 0) {
            errors.push('Budget must be a positive number')
        }
    }

    if (year !== undefined) {
        const currentYear = new Date().getFullYear()
        if (!Number.isInteger(year) || year < 1900) {
            errors.push('Year must be a valid integer (1900 or later)')
        } else if (year > currentYear) {
            errors.push(`Program year cannot exceed current year (${currentYear})`)
        }
    }

    if (region !== undefined && !mongoose.Types.ObjectId.isValid(region)) {
        errors.push('Invalid region ID format')
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors })
    }

    next()
}

// Validate MongoDB ObjectId in URL params
const validateProgramId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ errors: ['Invalid program ID format'] })
    }
    next()
}

module.exports = { validateCreateProgram, validateUpdateProgram, validateProgramId }
