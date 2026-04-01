/**
 * Format number as currency (USD with 2 decimals)
 * @param {number} amount
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format number with thousands separator
 * @param {number} num
 * @returns {string}
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return "0";
  return new Intl.NumberFormat("en-US").format(num);
};

/**
 * Format date to readable format
 * @param {string|Date} dateString
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

/**
 * Format a decimal ratio (0–1) as a percentage string.
 * @param {number} value
 * @returns {string}
 */
export const formatDecimalPercent = (value) => {
  if (value === null || value === undefined) return "0%";
  return `${(value * 100).toFixed(2)}%`;
};

/**
 * Format a whole-number percentage (0–100) as a percentage string.
 * @param {number} value
 * @returns {string}
 */
export const formatWholePercent = (value) => {
  if (value === null || value === undefined) return "0%";
  return `${Number(value).toFixed(2)}%`;
};

/**
 * Truncate text with ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
