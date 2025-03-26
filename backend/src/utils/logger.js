/**
 * Logger utility for consistent logging across the application
 */

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

const logger = {
  /**
   * Log info messages
   * @param {String} message - Message to log
   * @param {Object} data - Optional data to log
   */
  info: (message, data = null) => {
    if (process.env.NODE_ENV !== "test") {
      console.log(`${colors.blue}[INFO]${colors.reset} ${message}`);
      if (data) console.log(data);
    }
  },

  /**
   * Log success messages
   * @param {String} message - Message to log
   * @param {Object} data - Optional data to log
   */
  success: (message, data = null) => {
    if (process.env.NODE_ENV !== "test") {
      console.log(`${colors.green}[SUCCESS]${colors.reset} ${message}`);
      if (data) console.log(data);
    }
  },

  /**
   * Log warning messages
   * @param {String} message - Message to log
   * @param {Object} data - Optional data to log
   */
  warn: (message, data = null) => {
    if (process.env.NODE_ENV !== "test") {
      console.log(`${colors.yellow}[WARNING]${colors.reset} ${message}`);
      if (data) console.log(data);
    }
  },

  /**
   * Log error messages
   * @param {String} message - Message to log
   * @param {Object|Error} error - Optional error to log
   */
  error: (message, error = null) => {
    if (process.env.NODE_ENV !== "test") {
      console.error(`${colors.red}[ERROR]${colors.reset} ${message}`);
      if (error) {
        if (error instanceof Error) {
          console.error(`${colors.red}${error.stack}${colors.reset}`);
        } else {
          console.error(error);
        }
      }
    }
  },

  /**
   * Log debug messages (only in development environment)
   * @param {String} message - Message to log
   * @param {Object} data - Optional data to log
   */
  debug: (message, data = null) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`${colors.magenta}[DEBUG]${colors.reset} ${message}`);
      if (data) console.log(data);
    }
  },

  /**
   * Log HTTP request information
   * @param {Object} req - Express request object
   */
  request: (req) => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `${colors.cyan}[REQUEST]${colors.reset} ${req.method} ${req.originalUrl}`
      );
    }
  },
};

module.exports = logger; 