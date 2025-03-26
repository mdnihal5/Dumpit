/**
 * Handle API error responses and return a standardized format
 * @param {Error} error - The error object from axios
 * @returns {object} Standardized error response
 */
export const handleApiError = (error) => {
  // Network error
  if (!error.response) {
    return {
      success: false,
      message: 'Network error. Please check your internet connection and try again.',
      statusCode: 0,
    };
  }

  const { status } = error.response;
  const message = error.response.data?.message || 'An unexpected error occurred. Please try again.';

  // Special case for unauthorized (likely token expired)
  if (status === 401) {
    // You might want to handle auth token refresh or logout here
    return {
      success: false,
      message: 'Your session has expired. Please log in again.',
      statusCode: 401,
      authError: true
    };
  }

  // Special case for forbidden
  if (status === 403) {
    return {
      success: false,
      message: 'You don\'t have permission to perform this action.',
      statusCode: 403,
      authError: true
    };
  }

  // Server error
  if (status >= 500) {
    return {
      success: false,
      message: 'Server error. Please try again later.',
      statusCode: status
    };
  }

  // Bad request or other client errors
  return {
    success: false,
    message,
    statusCode: status,
    data: error.response.data
  };
};

/**
 * Log errors for debugging purposes
 * @param {Error} error - The error object
 * @param {string} context - Context where the error occurred
 */
export const logError = (error, context = '') => {
  if (__DEV__) {
    console.error(`[${context}] Error:`, error);
    
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
};

/**
 * Format validation error messages from the API
 * @param {object} errors - Validation errors object from the API
 * @returns {string} Formatted error message
 */
export const formatValidationErrors = (errors) => {
  if (!errors) return 'Validation failed. Please check your input.';
  
  return Object.entries(errors)
    .map(([field, messages]) => {
      if (Array.isArray(messages)) {
        return `${field}: ${messages.join(', ')}`;
      }
      return `${field}: ${messages}`;
    })
    .join('\n');
}; 