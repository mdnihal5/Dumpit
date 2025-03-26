import apiClient from './apiClient';

const ProductService = {
  /**
   * Get list of products with optional filters
   * @param {Object} params Query parameters (search, category, vendor, page, limit, sort)
   * @returns {Promise} Response with products data
   */
  getProducts: async (params = {}) => {
    try {
      const response = await apiClient.get('/products', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get featured products
   * @returns {Promise} Response with featured products
   */
  getFeaturedProducts: async () => {
    try {
      const response = await apiClient.get('/products/featured');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get products by category
   * @param {string} categoryId Category ID
   * @param {Object} params Additional query parameters (page, limit, sort)
   * @returns {Promise} Response with category products
   */
  getProductsByCategory: async (categoryId, params = {}) => {
    try {
      const response = await apiClient.get(`/products/category/${categoryId}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get products by vendor
   * @param {string} vendorId Vendor ID
   * @param {Object} params Additional query parameters (page, limit, sort)
   * @returns {Promise} Response with vendor products
   */
  getProductsByVendor: async (vendorId, params = {}) => {
    try {
      const response = await apiClient.get(`/products/vendor/${vendorId}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get product details by ID
   * @param {string} id Product ID
   * @returns {Promise} Response with product details
   */
  getProductById: async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Search products with filters
   * @param {string} query Search query
   * @param {Object} filters Filter parameters (category, price range, etc.)
   * @param {Object} pagination Pagination parameters (page, limit)
   * @param {Object} sorting Sorting parameters (field, direction)
   * @returns {Promise} Response with search results
   */
  searchProducts: async (query, filters = {}, pagination = {}, sorting = {}) => {
    try {
      const params = {
        q: query,
        ...filters,
        ...pagination,
        ...sorting
      };
      const response = await apiClient.get('/products', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default ProductService; 