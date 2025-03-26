import apiClient from './apiClient';

const OrderService = {
  /**
   * Create a new order
   * @param {Object} orderData Order data
   * @returns {Promise} Response with created order
   */
  createOrder: async (orderData) => {
    try {
      const response = await apiClient.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get current user's orders
   * @param {Object} params Query parameters (page, limit, status)
   * @returns {Promise} Response with user orders
   */
  getMyOrders: async (params = {}) => {
    try {
      const response = await apiClient.get('/orders/my-orders', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get order details by ID
   * @param {string} id Order ID
   * @returns {Promise} Response with order details
   */
  getOrderById: async (id) => {
    try {
      const response = await apiClient.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Cancel an order
   * @param {string} id Order ID
   * @param {Object} cancelData Cancellation reason data
   * @returns {Promise} Response with cancelled order
   */
  cancelOrder: async (id, cancelData) => {
    try {
      const response = await apiClient.put(`/orders/${id}/cancel`, cancelData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Track order status and location
   * @param {string} id Order ID
   * @returns {Promise} Response with order tracking details
   */
  trackOrder: async (id) => {
    try {
      const response = await apiClient.get(`/orders/${id}/track`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Add order feedback/review
   * @param {string} id Order ID
   * @param {Object} feedbackData Feedback data (rating, comment)
   * @returns {Promise} Response with updated order
   */
  addOrderFeedback: async (id, feedbackData) => {
    try {
      const response = await apiClient.post(`/orders/${id}/feedback`, feedbackData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default OrderService; 