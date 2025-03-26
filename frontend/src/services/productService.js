import axios from 'axios';
import { API_URL } from '../config';
import { handleApiError } from '../utils/errorHandler';
import authService from './authService';

/**
 * Product Service
 * Handles product-related API calls
 */
const productService = {
  /**
   * Get all products with optional filtering and pagination
   * @param {number} page - Page number for pagination
   * @param {number} limit - Number of items per page
   * @param {object} filters - Filters to apply (category, price range, etc.)
   * @returns {Promise<object>} - Products data and pagination info
   */
  async getProducts(page = 1, limit = 20, filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters
      });
      
      const response = await axios.get(`${API_URL}/products?${queryParams}`);
      return {
        success: true,
        products: response.data.products,
        total: response.data.total,
        pages: response.data.pages
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get products by category ID
   * @param {string} categoryId - Category ID
   * @param {number} page - Page number for pagination
   * @param {number} limit - Number of items per page
   * @param {object} filters - Additional filters to apply
   * @returns {Promise<object>} - Products data and pagination info
   */
  async getProductsByCategory(categoryId, page = 1, limit = 20, filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters
      });
      
      const response = await axios.get(`${API_URL}/categories/${categoryId}/products?${queryParams}`);
      return {
        success: true,
        products: response.data.products,
        total: response.data.total,
        pages: response.data.pages,
        category: response.data.category
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get products by vendor ID
   * @param {string} vendorId - Vendor ID
   * @param {number} page - Page number for pagination
   * @param {number} limit - Number of items per page
   * @param {object} filters - Additional filters to apply
   * @returns {Promise<object>} - Products data and pagination info
   */
  async getProductsByVendor(vendorId, page = 1, limit = 20, filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters
      });
      
      const response = await axios.get(`${API_URL}/vendors/${vendorId}/products?${queryParams}`);
      return {
        success: true,
        products: response.data.products,
        total: response.data.total,
        pages: response.data.pages,
        vendor: response.data.vendor
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Search for products by query string
   * @param {string} query - Search query string
   * @param {number} page - Page number for pagination
   * @param {number} limit - Number of items per page
   * @param {object} filters - Additional filters to apply
   * @returns {Promise<object>} - Products data and pagination info
   */
  async searchProducts(query, page = 1, limit = 20, filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        q: query,
        page,
        limit,
        ...filters
      });
      
      const response = await axios.get(`${API_URL}/products/search?${queryParams}`);
      return {
        success: true,
        products: response.data.products,
        total: response.data.total,
        pages: response.data.pages
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get product by ID
   * @param {string} productId - Product ID
   * @returns {Promise<object>} - Product data
   */
  async getProductById(productId) {
    try {
      const response = await axios.get(`${API_URL}/products/${productId}`);
      return {
        success: true,
        product: response.data.product
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get featured products
   * @param {number} limit - Number of products to return
   * @returns {Promise<object>} - Featured products data
   */
  async getFeaturedProducts(limit = 6) {
    try {
      const response = await axios.get(`${API_URL}/products/featured?limit=${limit}`);
      return {
        success: true,
        products: response.data.products
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get newest products
   * @param {number} limit - Number of products to return
   * @returns {Promise<object>} - Newest products data
   */
  async getNewestProducts(limit = 6) {
    try {
      const response = await axios.get(`${API_URL}/products/newest?limit=${limit}`);
      return {
        success: true,
        products: response.data.products
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get product reviews
   * @param {string} productId - Product ID
   * @param {number} page - Page number for pagination
   * @param {number} limit - Number of items per page
   * @returns {Promise<object>} - Reviews data and pagination info
   */
  async getProductReviews(productId, page = 1, limit = 10) {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit
      });
      
      const response = await axios.get(`${API_URL}/products/${productId}/reviews?${queryParams}`);
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
   * Submit a product review
   * @param {string} productId - Product ID
   * @param {object} reviewData - Review data (rating, comment)
   * @returns {Promise<object>} - Review submission result
   */
  async submitProductReview(productId, reviewData) {
    try {
      const token = await authService.getToken();
      
      const response = await axios.post(
        `${API_URL}/products/${productId}/reviews`,
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
   * Get related products
   * @param {string} productId - Product ID
   * @param {number} limit - Number of products to return
   * @returns {Promise<object>} - Related products data
   */
  async getRelatedProducts(productId, limit = 4) {
    try {
      const response = await axios.get(`${API_URL}/products/${productId}/related?limit=${limit}`);
      return {
        success: true,
        products: response.data.products
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get product categories
   */
  getCategories: async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      return { success: true, categories: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch categories. Please try again.'
      };
    }
  },
  
  /**
   * Get category details by ID
   */
  getCategoryById: async (categoryId) => {
    try {
      const response = await axios.get(`${API_URL}/categories/${categoryId}`);
      return { success: true, category: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch category details. Please try again.'
      };
    }
  },
  
  /**
   * Get popular products
   * @param {number} limit - Number of products to retrieve
   * @returns {Promise<Object>} - Popular products data
   */
  getPopularProducts: async (limit = 10) => {
    try {
      const response = await axios.get(`${API_URL}/products/popular?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default productService; 