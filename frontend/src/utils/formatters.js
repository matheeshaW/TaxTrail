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
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

/**
 * Format percentage
 * @param {number} value
 * @returns {string}
 */
export const formatPercent = (value) => {
  if (value === null || value === undefined) return "0%";
  return `${(value * 100).toFixed(2)}%`;
};

/**
 * Truncate text with ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
