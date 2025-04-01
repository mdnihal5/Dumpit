/**
 * Async handler middleware
 * Wraps async controller functions to handle errors without try/catch blocks
 * @param {Function} fn - The async controller function to wrap
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler; 