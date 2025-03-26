// API configuration
export const API_URL = 'http://10.0.2.2:5000/api'; // For Android Emulator to connect to localhost
// Use 'http://localhost:5000/api' for iOS simulator

// App configuration
export const APP_NAME = 'DumpIt';

// Default pagination limit
export const DEFAULT_PAGE_SIZE = 10;

// Cloudinary image optimization
export const cloudinaryOptimize = (url, width = 500) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-IN', options);
};

// Format time
export const formatTime = (dateString) => {
  const options = { hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleTimeString('en-IN', options);
};

// Format date and time
export const formatDateTime = (dateString) => {
  return `${formatDate(dateString)} at ${formatTime(dateString)}`;
}; 