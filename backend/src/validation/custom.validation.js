/**
 * Custom validation helpers for Joi schemas
 */

/**
 * Validates MongoDB ObjectId
 * @param {string} value - The value to validate
 * @param {object} helpers - Joi helpers
 * @returns {string|object} - Returns the value if valid, error if invalid
 */
const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('Invalid ID format');
  }
  return value;
};

/**
 * Validates password strength
 * @param {string} value - The password to validate
 * @param {object} helpers - Joi helpers
 * @returns {string|object} - Returns the value if valid, error if invalid
 */
const password = (value, helpers) => {
  if (value.length < 6) {
    return helpers.message('Password must be at least 6 characters');
  }
  return value;
};

module.exports = {
  objectId,
  password,
}; 