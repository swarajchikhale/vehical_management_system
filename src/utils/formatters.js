/**
 * Formats a numeric value into Indian Rupees (INR) string representation.
 * @param {number} amount - The numerical amount to format.
 * @param {boolean} includeDecimals - Whether to enforce decimal digits (default: true).
 * @returns {string} Formatted INR currency string (e.g. ₹9,500.00 or ₹9,500)
 */
export const formatINR = (amount, includeDecimals = true) => {
  const numericVal = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0
  }).format(numericVal);
};

/**
 * Formats a date string into Indian standard date format (DD/MM/YYYY).
 * @param {string} dateString - Date string (YYYY-MM-DD)
 * @returns {string} Formatted date string
 */
export const formatDateIN = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};
