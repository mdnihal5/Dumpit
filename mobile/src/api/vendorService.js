import apiClient from './apiClient';

const VendorService = {
  /**
   * Get list of vendors with optional filters
   * @param {Object} params Query parameters (search, category, location, page, limit, sort)
   * @returns {Promise} Response with vendors data
   */
  getVendors: async (params = {}) => {
    try {
      const response = await apiClient.get('/vendors', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get vendor details by ID
   * @param {string} id Vendor ID
   * @returns {Promise} Response with vendor details
   */
  getVendorById: async (id) => {
    try {
      const response = await apiClient.get(`/vendors/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get featured vendors
   * @returns {Promise} Response with featured vendors
   */
  getFeaturedVendors: async () => {
    try {
      const response = await apiClient.get('/vendors/featured');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get vendors by category
   * @param {string} category Category name
   * @param {Object} params Additional query parameters (page, limit, sort)
   * @returns {Promise} Response with category vendors
   */
  getVendorsByCategory: async (category, params = {}) => {
    try {
      const response = await apiClient.get(`/vendors/category/${category}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get nearby vendors based on location
   * @param {number} latitude User's latitude
   * @param {number} longitude User's longitude
   * @param {number} radius Search radius in kilometers
   * @param {Object} params Additional query parameters (category, page, limit, sort)
   * @returns {Promise} Response with nearby vendors
   */
  getNearbyVendors: async (latitude, longitude, radius = 10, params = {}) => {
    try {
      const response = await apiClient.get('/vendors/nearby', { 
        params: {
          latitude,
          longitude,
          radius,
          ...params
        } 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get vendor reviews
   * @param {string} vendorId Vendor ID
   * @param {Object} params Pagination parameters (page, limit)
   * @returns {Promise} Response with vendor reviews
   */
  getVendorReviews: async (vendorId, params = {}) => {
    try {
      const response = await apiClient.get(`/vendors/${vendorId}/reviews`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default VendorService; 