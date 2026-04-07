/**
 * Validation utility functions for form validation
 * Used across all modules (Tax, Budget, Social, Regional)
 */

import {
  SECTOR_VALUES,
  SOCIAL_PROGRAM_BUDGET_MAX,
  SOCIAL_PROGRAM_BUDGET_PER_BENEFICIARY_MAX,
  SOCIAL_PROGRAM_PROGRAM_NAME_MAX_LENGTH,
  SOCIAL_PROGRAM_TARGET_GROUP_VALUES,
  SOCIAL_PROGRAM_YEAR_MIN,
} from "./constants";

/**
 * Validate required field
 * @param {any} value
 * @param {string} fieldName
 * @returns {string|null}
 */
export const validateRequired = (value, fieldName) => {
  if (value === "" || value === null || value === undefined) {
    return `${fieldName} is required`;
  }
  return null;
};

/**
 * Validate email format
 * @param {string} email
 * @returns {string|null}
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format";
  }
  return null;
};

/**
 * Validate number is within range
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @param {string} fieldName
 * @returns {string|null}
 */
export const validateRange = (value, min, max, fieldName) => {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return `${fieldName} must be a number`;
  }
  if (num < min) {
    return `${fieldName} cannot be less than ${min}`;
  }
  if (num > max) {
    return `${fieldName} cannot be greater than ${max}`;
  }
  return null;
};

/**
 * Validate string length
 * @param {string} value
 * @param {number} minLength
 * @param {number} maxLength
 * @param {string} fieldName
 * @returns {string|null}
 */
export const validateLength = (value, minLength, maxLength, fieldName) => {
  const safeValue = value == null ? "" : String(value);
  if (safeValue.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  if (safeValue.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  return null;
};

/**
 * Validate URL format
 * @param {string} url
 * @returns {string|null}
 */
export const validateUrl = (url) => {
  try {
    new URL(url);
    return null;
  } catch {
    return "Invalid URL format";
  }
};

/**
 * Validate date is not in the past
 * @param {string|Date} date
 * @returns {string|null}
 */
export const validateFutureDate = (date) => {
  const selectedDate = new Date(date);

  if (isNaN(selectedDate.getTime())) {
    return "Invalid date";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return "Date cannot be in the past";
  }
  return null;
};

/**
 * Validate percentage (0-100)
 * @param {number} value
 * @returns {string|null}
 */
export const validatePercentage = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return "Percentage must be a number";
  }
  if (num < 0 || num > 100) {
    return "Percentage must be between 0 and 100";
  }
  return null;
};

/**
 * Validate phone number (basic)
 * @param {string} phone
 * @returns {string|null}
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
  if (!phoneRegex.test(phone)) {
    return "Invalid phone number format";
  }
  return null;
};

const currentYear = () => new Date().getFullYear();

/**
 * Social Program — programName (required, max length)
 * @param {string} value
 * @returns {string|null}
 */
export const validateSocialProgramProgramName = (value) => {
  const required = validateRequired(value, "Program name");
  if (required) return required;
  const trimmed = String(value).trim();
  if (trimmed.length > SOCIAL_PROGRAM_PROGRAM_NAME_MAX_LENGTH) {
    return `Program name must not exceed ${SOCIAL_PROGRAM_PROGRAM_NAME_MAX_LENGTH} characters`;
  }
  return null;
};

/**
 * Social Program — sector enum
 * @param {string} value
 * @returns {string|null}
 */
export const validateSocialProgramSector = (value) => {
  const required = validateRequired(value, "Sector");
  if (required) return required;
  if (!SECTOR_VALUES.includes(value)) {
    return `Sector must be one of: ${SECTOR_VALUES.join(", ")}`;
  }
  return null;
};

/**
 * Social Program — targetGroup enum
 * @param {string} value
 * @returns {string|null}
 */
export const validateSocialProgramTargetGroup = (value) => {
  const required = validateRequired(value, "Target group");
  if (required) return required;
  if (!SOCIAL_PROGRAM_TARGET_GROUP_VALUES.includes(value)) {
    return `Target group must be one of: ${SOCIAL_PROGRAM_TARGET_GROUP_VALUES.join(", ")}`;
  }
  return null;
};

/**
 * Social Program — beneficiariesCount (integer, >= 0)
 * @param {number|string} value
 * @returns {string|null}
 */
export const validateSocialProgramBeneficiariesCount = (value) => {
  const required = validateRequired(value, "Beneficiaries count");
  if (required) return required;
  const num = Number(value);
  if (!Number.isInteger(num) || num < 0) {
    return "Beneficiaries count must be a non-negative integer";
  }
  return null;
};

/**
 * Social Program — budgetUsed (>= 0, <= schema max)
 * @param {number|string} value
 * @returns {string|null}
 */
export const validateSocialProgramBudgetUsed = (value) => {
  const required = validateRequired(value, "Budget used");
  if (required) return required;
  const num = Number(value);
  if (Number.isNaN(num) || num < 0) {
    return "Budget must be a non-negative number";
  }
  if (num > SOCIAL_PROGRAM_BUDGET_MAX) {
    return `Budget cannot exceed ${SOCIAL_PROGRAM_BUDGET_MAX.toLocaleString()}`;
  }
  return null;
};

/**
 * Social Program — year (1900 .. current calendar year)
 * @param {number|string} value
 * @returns {string|null}
 */
export const validateSocialProgramYear = (value) => {
  const required = validateRequired(value, "Year");
  if (required) return required;
  const num = Number(value);
  const max = currentYear();
  if (!Number.isInteger(num)) {
    return "Year must be a valid integer";
  }
  if (num < SOCIAL_PROGRAM_YEAR_MIN || num > max) {
    return `Year must be between ${SOCIAL_PROGRAM_YEAR_MIN} and ${max}`;
  }
  return null;
};

/**
 * Social Program — region ObjectId (required for create)
 * @param {string} value
 * @returns {string|null}
 */
export const validateSocialProgramRegion = (value) => {
  const required = validateRequired(value, "Region");
  if (required) return required;
  const id = String(value).trim();
  if (!/^[a-f\d]{24}$/i.test(id)) {
    return "Invalid region ID format";
  }
  return null;
};

/**
 * Low Income → beneficiariesCount must be > 0 (matches backend rule)
 * @param {string} targetGroup
 * @param {number} beneficiariesCount
 * @returns {string|null}
 */
export const validateSocialProgramLowIncomeBeneficiaries = (
  targetGroup,
  beneficiariesCount,
) => {
  if (targetGroup === "Low Income" && beneficiariesCount <= 0) {
    return "Beneficiaries count must be greater than zero for Low Income target group";
  }
  return null;
};

/**
 * budgetUsed / beneficiariesCount must not exceed per-person threshold when count > 0
 * @param {number} beneficiariesCount
 * @param {number} budgetUsed
 * @returns {string|null}
 */
export const validateSocialProgramBudgetPerBeneficiary = (
  beneficiariesCount,
  budgetUsed,
) => {
  if (beneficiariesCount > 0 && budgetUsed != null && budgetUsed !== "") {
    const budget = Number(budgetUsed);
    if (Number.isNaN(budget)) return null;
    const per = budget / beneficiariesCount;
    if (per > SOCIAL_PROGRAM_BUDGET_PER_BENEFICIARY_MAX) {
      return `Budget per beneficiary exceeds threshold (${SOCIAL_PROGRAM_BUDGET_PER_BENEFICIARY_MAX.toLocaleString()} per person)`;
    }
  }
  return null;
};

/**
 * Run all Social Program create validations; returns first error message or null.
 * @param {{ programName: string, sector: string, targetGroup: string, beneficiariesCount: number, budgetUsed: number, year: number, region: string }} values
 * @returns {string|null}
 */
export const validateSocialProgramCreate = (values) => {
  const checks = [
    validateSocialProgramProgramName(values.programName),
    validateSocialProgramSector(values.sector),
    validateSocialProgramTargetGroup(values.targetGroup),
    validateSocialProgramBeneficiariesCount(values.beneficiariesCount),
    validateSocialProgramBudgetUsed(values.budgetUsed),
    validateSocialProgramYear(values.year),
    validateSocialProgramRegion(values.region),
    validateSocialProgramLowIncomeBeneficiaries(
      values.targetGroup,
      Number(values.beneficiariesCount),
    ),
    validateSocialProgramBudgetPerBeneficiary(
      Number(values.beneficiariesCount),
      values.budgetUsed,
    ),
  ];
  return checks.find(Boolean) ?? null;
};

export default {
  validateRequired,
  validateEmail,
  validateRange,
  validateLength,
  validateUrl,
  validateFutureDate,
  validatePercentage,
  validatePhone,
  validateSocialProgramProgramName,
  validateSocialProgramSector,
  validateSocialProgramTargetGroup,
  validateSocialProgramBeneficiariesCount,
  validateSocialProgramBudgetUsed,
  validateSocialProgramYear,
  validateSocialProgramRegion,
  validateSocialProgramLowIncomeBeneficiaries,
  validateSocialProgramBudgetPerBeneficiary,
  validateSocialProgramCreate,
};
