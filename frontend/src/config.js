// API Configuration
export const API_BASE_URL = 'http://localhost:8000/api';

// App Configuration
export const APP_NAME = 'DumpIt';
export const APP_VERSION = '1.0.0';

// Map Configuration
export const MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with actual API key

// Static Content URLs
export const DEFAULT_AVATAR = 'https://via.placeholder.com/150';
export const DEFAULT_PRODUCT_IMAGE = 'https://via.placeholder.com/300';

// Pagination Settings
export const DEFAULT_PAGE_SIZE = 10;

// Toast Configuration
export const TOAST_DURATION = 3000; // 3 seconds

// Local Storage Keys (in addition to the ones in tokenStorage)
export const STORAGE_KEYS = {
  CART: 'cart_items',
  RECENT_SEARCHES: 'recent_searches',
  THEME: 'app_theme',
  NOTIFICATIONS: 'notifications'
};

// Feature Flags
export const FEATURES = {
  ENABLE_NOTIFICATIONS: true,
  ENABLE_LOCATION: true,
  ENABLE_REVIEWS: true,
  ENABLE_PAYMENTS: true
}; 