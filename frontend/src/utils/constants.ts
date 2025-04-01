import { API_URL, APP_NAME, APP_VERSION } from '@env';

/**
 * Application-wide constants
 */

// App branding
export const BRANDING = {
  APP_NAME: APP_NAME || 'Dumpit',
  TAGLINE: 'Your one-stop shop for construction materials',
  VERSION: APP_VERSION || '1.0.0',
};

// API Configuration
export const API_CONFIG = {
  // Base API URL - this should be the only place to change the API URL
  BASE_URL: API_URL || 'http://localhost:4040/api',
  
  // Timeout in milliseconds
  TIMEOUT: 15000,
  
  // API Endpoints (for easy reference)
  ENDPOINTS: {
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgotpassword',
    RESET_PASSWORD: '/auth/resetpassword',
    CHANGE_PASSWORD: '/auth/updatepassword',
    UPDATE_PROFILE: '/auth/updatedetails',
    REFRESH_TOKEN: '/auth/refresh-token',
    ME: '/auth/me',
    AVATAR: '/auth/avatar',
    
    // Addresses (now under auth)
    USER_ADDRESSES: '/auth/addresses',
    ADD_ADDRESS: '/auth/addresses',
    UPDATE_ADDRESS: '/auth/addresses',
    DELETE_ADDRESS: '/auth/addresses',
    SET_DEFAULT_ADDRESS: '/auth/addresses',
    
    // Products
    PRODUCTS: '/products',
    FEATURED_PRODUCTS: '/products/featured',
    
    // Categories
    CATEGORIES: '/categories',
    
    // Orders
    ORDERS: '/orders',
    MY_ORDERS: '/orders/myorders',
    ORDER_FROM_CART: '/orders/from-cart',
    CANCEL_ORDER: '/orders/cancel',
    
    // Cart
    CART: '/cart',
    
    // Shops
    SHOPS: '/shops',
    
    // Notifications
    NOTIFICATIONS: '/notifications',
    NOTIFICATION_SETTINGS: '/notifications/settings',
    MARK_NOTIFICATION_READ: '/notifications',
    MARK_ALL_NOTIFICATIONS_READ: '/notifications',
  },
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
};

// App Configuration
export const APP_CONFIG = {
  APP_NAME: BRANDING.APP_NAME,
  VERSION: BRANDING.VERSION,
};

// Default pagination values
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
}; 