import api, { handleApiError } from './api';

/**
 * User Service
 * Handles user-related API calls
 */
const userService = {
  /**
   * Get user profile
   * @returns {Promise<Object>} - User profile data
   */
  getUserProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} - Updated user profile data
   */
  updateUserProfile: async (profileData) => {
    try {
      const response = await api.put('/user/profile', profileData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get user addresses
   * @returns {Promise<Object>} - User addresses data
   */
  getAddresses: async () => {
    try {
      const response = await api.get('/user/addresses');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Add a new address
   * @param {Object} addressData - Address data
   * @returns {Promise<Object>} - Created address data
   */
  addAddress: async (addressData) => {
    try {
      const response = await api.post('/user/addresses', addressData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Update an address
   * @param {string} addressId - Address ID
   * @param {Object} addressData - Updated address data
   * @returns {Promise<Object>} - Updated address data
   */
  updateAddress: async (addressId, addressData) => {
    try {
      const response = await api.put(`/user/addresses/${addressId}`, addressData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Delete an address
   * @param {string} addressId - Address ID
   * @returns {Promise<Object>} - Success response
   */
  deleteAddress: async (addressId) => {
    try {
      const response = await api.delete(`/user/addresses/${addressId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get user payment methods
   * @returns {Promise<Object>} - Payment methods data
   */
  getPaymentMethods: async () => {
    try {
      const response = await api.get('/user/payment-methods');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Add a new payment method
   * @param {Object} paymentData - Payment method data
   * @returns {Promise<Object>} - Created payment method data
   */
  addPaymentMethod: async (paymentData) => {
    try {
      const response = await api.post('/user/payment-methods', paymentData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Update a payment method
   * @param {string} paymentId - Payment method ID
   * @param {Object} paymentData - Updated payment method data
   * @returns {Promise<Object>} - Updated payment method data
   */
  updatePaymentMethod: async (paymentId, paymentData) => {
    try {
      const response = await api.put(`/user/payment-methods/${paymentId}`, paymentData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Delete a payment method
   * @param {string} paymentId - Payment method ID
   * @returns {Promise<Object>} - Success response
   */
  deletePaymentMethod: async (paymentId) => {
    try {
      const response = await api.delete(`/user/payment-methods/${paymentId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get user notifications
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - Notifications data
   */
  getNotifications: async (params = {}) => {
    try {
      const response = await api.get('/user/notifications', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   * @returns {Promise<Object>} - Updated notification data
   */
  markNotificationAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/user/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Clear all notifications
   * @returns {Promise<Object>} - Success response
   */
  clearAllNotifications: async () => {
    try {
      const response = await api.delete('/user/notifications');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get user preferences
   * @returns {Promise<Object>} - User preferences data
   */
  getUserPreferences: async () => {
    try {
      const response = await api.get('/user/preferences');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Update user preferences
   * @param {Object} preferencesData - Updated preferences data
   * @returns {Promise<Object>} - Updated preferences data
   */
  updateUserPreferences: async (preferencesData) => {
    try {
      const response = await api.put('/user/preferences', preferencesData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get user wishlist
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - Wishlist data
   */
  getWishlist: async (params = {}) => {
    try {
      const response = await api.get('/user/wishlist', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Add product to wishlist
   * @param {string} productId - Product ID
   * @returns {Promise<Object>} - Updated wishlist data
   */
  addToWishlist: async (productId) => {
    try {
      const response = await api.post('/user/wishlist', { productId });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Remove product from wishlist
   * @param {string} productId - Product ID
   * @returns {Promise<Object>} - Updated wishlist data
   */
  removeFromWishlist: async (productId) => {
    try {
      const response = await api.delete(`/user/wishlist/${productId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default userService; 