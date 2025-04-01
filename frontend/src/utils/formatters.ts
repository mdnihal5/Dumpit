/**
 * Utility functions for formatting data
 */

/**
 * Formats a number as currency with $ symbol
 * @param value - The number to format
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number): string => {
  return `$${value.toFixed(2)}`;
};

/**
 * Formats a phone number string to (XXX) XXX-XXXX format
 * @param phoneNumber - The phone number to format
 * @returns Formatted phone number string
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove any non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if the input is valid
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  // Return the original if it doesn't match the expected format
  return phoneNumber;
};

/**
 * Formats a date to a readable string like "Jan 1, 2023"
 * @param date - Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Formats a date to include time like "Jan 1, 2023, 2:30 PM"
 * @param date - Date to format
 * @returns Formatted date and time string
 */
export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
};

/**
 * Truncates text to a specified length and adds an ellipsis
 * @param text - Text to truncate
 * @param length - Maximum length before truncation
 * @returns Truncated text with ellipsis
 */
export const truncateText = (text: string, length: number): string => {
  if (text.length <= length) {
    return text;
  }
  return text.substring(0, length) + '...';
};

/**
 * Formats a file size in bytes to a human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}; 