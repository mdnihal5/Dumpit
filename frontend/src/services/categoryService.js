import axios from 'axios';
import { API_URL } from '../config';
import { handleApiError } from '../utils/errorHandler';

const categoryService = {
  /**
   * Get all categories
   * @returns {Promise<object>} - Categories data
   */
  async getCategories() {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      return {
        success: true,
        categories: response.data.categories
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get category by ID
   * @param {string} categoryId - Category ID
   * @returns {Promise<object>} - Category data
   */
  async getCategoryById(categoryId) {
    try {
      const response = await axios.get(`${API_URL}/categories/${categoryId}`);
      return {
        success: true,
        category: response.data.category
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get featured categories
   * @param {number} limit - Number of categories to return
   * @returns {Promise<object>} - Featured categories data
   */
  async getFeaturedCategories(limit = 5) {
    try {
      const response = await axios.get(`${API_URL}/categories/featured?limit=${limit}`);
      return {
        success: true,
        categories: response.data.categories
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get subcategories for a parent category
   * @param {string} parentId - Parent category ID
   * @returns {Promise<object>} - Subcategories data
   */
  async getSubcategories(parentId) {
    try {
      const response = await axios.get(`${API_URL}/categories/${parentId}/subcategories`);
      return {
        success: true,
        categories: response.data.categories
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get popular categories
   * @param {number} limit - Number of categories to return
   * @returns {Promise<object>} - Popular categories data
   */
  async getPopularCategories(limit = 5) {
    try {
      const response = await axios.get(`${API_URL}/categories/popular?limit=${limit}`);
      return {
        success: true,
        categories: response.data.categories
      };
    } catch (error) {
      return handleApiError(error);
    }
  }
};

export default categoryService; 