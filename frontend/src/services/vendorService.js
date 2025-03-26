import axios from 'axios';
import { API_URL } from '../config';
import { handleApiError } from '../utils/errorHandler';
import authService from './authService';

/**
 * Vendor Service
 * Handles vendor-related API calls
 */
const vendorService = {
  /**
   * Get all vendors with optional filtering and pagination
   * @param {number} page - Page number for pagination
   * @param {number} limit - Number of items per page
   * @param {object} filters - Filters to apply (category, location, etc.)
   * @returns {Promise<object>} - Vendors data and pagination info
   */
  async getVendors(page = 1, limit = 20, filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters
      });
      
      const response = await axios.get(`${API_URL}/vendors?${queryParams}`);
      return {
        success: true,
        vendors: response.data.vendors,
        total: response.data.total,
        pages: response.data.pages
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get vendor by ID
   * @param {string} vendorId - Vendor ID
   * @returns {Promise<object>} - Vendor data
   */
  async getVendorById(vendorId) {
    try {
      const response = await axios.get(`${API_URL}/vendors/${vendorId}`);
      return {
        success: true,
        vendor: response.data.vendor
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get popular vendors
   * @param {number} limit - Number of vendors to return
   * @returns {Promise<object>} - Popular vendors data
   */
  async getPopularVendors(limit = 5) {
    try {
      const response = await axios.get(`${API_URL}/vendors/popular?limit=${limit}`);
      return {
        success: true,
        vendors: response.data.vendors
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get vendors by category ID
   * @param {string} categoryId - Category ID
   * @param {number} page - Page number for pagination
   * @param {number} limit - Number of items per page
   * @param {object} filters - Additional filters to apply
   * @returns {Promise<object>} - Vendors data and pagination info
   */
  async getVendorsByCategory(categoryId, page = 1, limit = 20, filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters
      });
      
      const response = await axios.get(`${API_URL}/categories/${categoryId}/vendors?${queryParams}`);
      return {
        success: true,
        vendors: response.data.vendors,
        total: response.data.total,
        pages: response.data.pages
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Search for vendors by query string
   * @param {string} query - Search query string
   * @param {number} page - Page number for pagination
   * @param {number} limit - Number of items per page
   * @param {object} filters - Additional filters to apply
   * @returns {Promise<object>} - Vendors data and pagination info
   */
  async searchVendors(query, page = 1, limit = 20, filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        q: query,
        page,
        limit,
        ...filters
      });
      
      const response = await axios.get(`${API_URL}/vendors/search?${queryParams}`);
      return {
        success: true,
        vendors: response.data.vendors,
        total: response.data.total,
        pages: response.data.pages
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get vendor reviews
   * @param {string} vendorId - Vendor ID
   * @param {number} page - Page number for pagination
   * @param {number} limit - Number of items per page
   * @returns {Promise<object>} - Reviews data and pagination info
   */
  async getVendorReviews(vendorId, page = 1, limit = 10) {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit
      });
      
      const response = await axios.get(`${API_URL}/vendors/${vendorId}/reviews?${queryParams}`);
      return {
        success: true,
        reviews: response.data.reviews,
        total: response.data.total,
        pages: response.data.pages,
        averageRating: response.data.averageRating
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Submit a vendor review
   * @param {string} vendorId - Vendor ID
   * @param {object} reviewData - Review data (rating, comment)
   * @returns {Promise<object>} - Review submission result
   */
  async submitVendorReview(vendorId, reviewData) {
    try {
      const token = await authService.getToken();
      
      const response = await axios.post(
        `${API_URL}/vendors/${vendorId}/reviews`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      return {
        success: true,
        review: response.data.review,
        message: response.data.message
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get nearby vendors based on location
   * @param {number} latitude - Latitude coordinate
   * @param {number} longitude - Longitude coordinate
   * @param {number} radius - Search radius in kilometers
   * @param {number} limit - Number of vendors to return
   * @returns {Promise<object>} - Nearby vendors data
   */
  async getNearbyVendors(latitude, longitude, radius = 10, limit = 20) {
    try {
      const queryParams = new URLSearchParams({
        latitude,
        longitude,
        radius,
        limit
      });
      
      const response = await axios.get(`${API_URL}/vendors/nearby?${queryParams}`);
      return {
        success: true,
        vendors: response.data.vendors
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get vendor products
   * @param {string} vendorId - Vendor ID
   * @param {number} page - Page number
   * @param {number} limit - Number of products per page
   * @param {string} sort - Sort order
   * @returns {Promise<Object>} - Vendor products data with pagination info
   */
  getVendorProducts: async (vendorId, page = 1, limit = DEFAULT_PAGE_SIZE, sort = '-createdAt') => {
    try {
      const response = await apiClient.get(`/vendors/${vendorId}/products`, {
        params: { page, limit, sort }
      });
      
      return { 
        success: true, 
        products: response.data.products,
        total: response.data.total,
        pages: response.data.pages
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch vendor products. Please try again.'
      };
    }
  },
};

export default vendorService; 