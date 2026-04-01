/**
 * Validation utility functions for form validation
 * Used across all modules (Tax, Budget, Social, Regional)
 */

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
 * @returns {string|null}
 */
export const validateLength = (value, minLength, maxLength, fieldName) => {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  if (value.length > maxLength) {
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

export default {
  validateRequired,
  validateEmail,
  validateRange,
  validateLength,
  validateUrl,
  validateFutureDate,
  validatePercentage,
  validatePhone,
};
