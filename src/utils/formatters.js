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

/**
 * Maps status strings to CSS badge classes for vehicles, services, and bookings.
 * @param {string} status - Status key (e.g. 'available', 'rented', 'active', 'completed')
 * @returns {string} Tailwind/CSS badge class string
 */
export const getStatusBadgeClass = (status) => {
  const normalized = (status || '').toLowerCase();
  switch (normalized) {
    case 'available':
    case 'completed':
    case 'paid':
    case 'active':
      return 'badge-success';
    case 'rented':
    case 'assigned':
    case 'in_progress':
      return 'badge-warning';
    case 'maintenance':
    case 'cancelled':
    case 'pending':
      return 'badge-danger';
    default:
      return 'badge-secondary';
  }
};

/**
 * Returns formatted human-readable label for status key.
 * @param {string} status - Raw status string
 * @returns {string} Capitalized status label
 */
export const getStatusLabel = (status) => {
  if (!status) return 'Unknown';
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Returns a human-readable relative time string (e.g. 'Just now', '5m ago', '2h ago').
 * @param {string|Date} dateVal - Date object or ISO string
 * @returns {string} Relative time string
 */
export const formatTimeAgo = (dateVal) => {
  if (!dateVal) return 'Just now';
  const past = new Date(dateVal).getTime();
  if (isNaN(past)) return 'Just now';
  const diffSecs = Math.floor((Date.now() - past) / 1000);
  if (diffSecs < 60) return 'Just now';
  if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
  if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
  return `${Math.floor(diffSecs / 86400)}d ago`;
};

/**
 * Returns formatted mileage rating for vehicle specifications display.
 * @param {number|string} val - Mileage number or default string
 * @param {string} unit - 'kmpl' or 'km/charge' (default: 'km/l')
 * @returns {string} Formatted mileage string
 */
export const formatMileage = (val, unit = 'km/l') => {
  if (!val) return '16.5 km/l';
  const num = Number(val);
  return isNaN(num) ? `${val}` : `${num.toFixed(1)} ${unit}`;
};

/**
 * Normalizes and formats fuel / powertrain type label.
 * @param {string} type - 'petrol', 'diesel', 'electric', 'hybrid'
 * @returns {string} Capitalized fuel type string
 */
export const formatFuelType = (type) => {
  if (!type) return 'Petrol';
  const normalized = type.toLowerCase().trim();
  switch (normalized) {
    case 'ev':
    case 'electric':
      return 'Electric (Zero Emission)';
    case 'hybrid':
      return 'Hybrid Petrol';
    case 'diesel':
      return 'Turbo Diesel';
    case 'cng':
      return 'Eco CNG';
    default:
      return 'Premium Petrol';
  }
};

/**
 * Returns formatted safety star rating and crash test compliance label.
 * @param {number} rating - NCAP safety rating (1 to 5)
 * @returns {string} Formatted safety rating with stars
 */
export const formatSafetyRating = (rating = 5) => {
  const stars = Math.min(5, Math.max(1, Math.round(Number(rating) || 5)));
  return `${'★'.repeat(stars)} (${stars}/5 NCAP Safety)`;
};

/**
 * Calculates estimated daily fuel savings comparing EV/Hybrid against standard petrol.
 * @param {string} fuelType - Vehicle fuel type ('electric', 'hybrid', 'cng', 'diesel')
 * @param {number} dailyKm - Average expected daily commute (default: 80 km)
 * @returns {number} Estimated savings in INR per day
 */
export const calculateFuelSavings = (fuelType, dailyKm = 80) => {
  const normalized = (fuelType || '').toLowerCase();
  if (normalized.includes('electric') || normalized === 'ev') {
    return Math.round(dailyKm * 5.2); // ~₹416/day savings
  }
  if (normalized.includes('hybrid')) {
    return Math.round(dailyKm * 2.8); // ~₹224/day savings
  }
  if (normalized.includes('cng')) {
    return Math.round(dailyKm * 3.4); // ~₹272/day savings
  }
  return 0;
};

/**
 * Returns formatted seating capacity label based on vehicle type.
 * @param {string} vehicleType - 'car', 'bike', 'van', 'bus', 'truck'
 * @returns {string} Formatted seat count string
 */
export const formatSeatingCapacity = (vehicleType) => {
  const normalized = (vehicleType || '').toLowerCase();
  switch (normalized) {
    case 'bike':
      return '2 Seats';
    case 'van':
      return '7-8 Seats';
    case 'bus':
      return '24+ Seats';
    case 'truck':
      return '3 Seats (Cabin)';
    default:
      return '5 Seats';
  }
};

/**
 * Returns estimated luggage trunk capacity in liters/bags.
 * @param {string} vehicleType - Vehicle category type
 * @returns {string} Boot space representation
 */
export const formatLuggageCapacity = (vehicleType) => {
  const normalized = (vehicleType || '').toLowerCase();
  switch (normalized) {
    case 'bike':
      return 'Compact Top-Box';
    case 'van':
      return '650L (5 Large Bags)';
    case 'bus':
      return 'Commercial Cargo Bay';
    case 'truck':
      return 'Heavy Cargo Bed';
    default:
      return '450L (3 Large Bags)';
  }
};




