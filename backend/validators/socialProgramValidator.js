const mongoose = require('mongoose')
const { body } = require('express-validator')

// Constants
const BUDGET_PER_PERSON_THRESHOLD = 1_000_000
const VALID_SECTORS = ['Welfare', 'Education', 'Health', 'Housing', 'Food Assistance']
const VALID_TARGET_GROUPS = ['Low Income', 'Middle Income', 'Rural', 'Urban Poor', 'Disabled']

exports.createProgramValidator = [
  body('programName')
    .isString().trim().notEmpty().withMessage('Program name is required')
    .isLength({ max: 100 }).withMessage('Program name must not exceed 100 characters'),

  body('sector')
    .isIn(VALID_SECTORS).withMessage(`Sector must be one of: ${VALID_SECTORS.join(', ')}`),

  body('targetGroup')
    .isIn(VALID_TARGET_GROUPS).withMessage(`Target group must be one of: ${VALID_TARGET_GROUPS.join(', ')}`),

  body('beneficiariesCount')
    .isInt({ min: 0 }).withMessage('Beneficiaries count must be a positive integer'),

  body('budgetUsed')
    .isFloat({ min: 0 }).withMessage('Budget must be a positive number'),

  body('year')
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage(`Year must be between 1900 and ${new Date().getFullYear()}`),

  body('region')
    .notEmpty().withMessage('Region is required'),

  // Custom validation for business rules
  body().custom(({ targetGroup, beneficiariesCount, budgetUsed }) => {
    if (targetGroup === 'Low Income' && beneficiariesCount <= 0) {
      throw new Error('Beneficiaries count must be greater than zero for Low Income target group')
    }
    if (beneficiariesCount > 0 && budgetUsed) {
      const budgetPerPerson = budgetUsed / beneficiariesCount
      if (budgetPerPerson > BUDGET_PER_PERSON_THRESHOLD) {
        throw new Error(`Budget per beneficiary exceeds threshold (${BUDGET_PER_PERSON_THRESHOLD.toLocaleString()} per person)`)
      }
    }
    return true
  })
]

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

// Update program validator using express-validator
exports.updateProgramValidator = [
  body('programName')
    .optional()
    .isString().trim().notEmpty().withMessage('Program name cannot be empty')
    .isLength({ max: 100 }).withMessage('Program name must not exceed 100 characters'),

  body('sector')
    .optional()
    .isIn(VALID_SECTORS).withMessage(`Sector must be one of: ${VALID_SECTORS.join(', ')}`),

  body('targetGroup')
    .optional()
    .isIn(VALID_TARGET_GROUPS).withMessage(`Target group must be one of: ${VALID_TARGET_GROUPS.join(', ')}`),

  body('beneficiariesCount')
    .optional()
    .isInt({ min: 0 }).withMessage('Beneficiaries count must be a positive integer'),

  body('budgetUsed')
    .optional()
    .isFloat({ min: 0 }).withMessage('Budget must be a positive number'),

  body('year')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage(`Year must be between 1900 and ${new Date().getFullYear()}`),

  body('region')
    .optional()
    .notEmpty().withMessage('Region cannot be empty'),

  // Custom validation for business rules
  body().custom(({ targetGroup, beneficiariesCount, budgetUsed }) => {
    if (targetGroup === 'Low Income' && beneficiariesCount !== undefined && beneficiariesCount <= 0) {
      throw new Error('Beneficiaries count must be greater than zero for Low Income target group')
    }
    if (beneficiariesCount > 0 && budgetUsed) {
      const budgetPerPerson = budgetUsed / beneficiariesCount
      if (budgetPerPerson > BUDGET_PER_PERSON_THRESHOLD) {
        throw new Error(`Budget per beneficiary exceeds threshold (${BUDGET_PER_PERSON_THRESHOLD.toLocaleString()} per person)`)
      }
    }
    return true
  })
]

module.exports = { validateCreateProgram, validateUpdateProgram, validateProgramId }
