import api, { handleApiError } from './api';
import { DEFAULT_PAGE_SIZE } from '../utils/config';

/**
 * Order Service
 * Handles order-related API calls
 */
const orderService = {
  /**
   * Get user orders
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - Orders data with pagination info
   */
  getOrders: async (params = {}) => {
    try {
      const response = await api.get('/orders', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get order by ID
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} - Order data
   */
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Create a new order
   * @param {Object} orderData - Order data
   * @returns {Promise<Object>} - Created order data
   */
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Cancel an order
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} - Updated order data
   */
  cancelOrder: async (orderId) => {
    try {
      const response = await api.post(`/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Track an order
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} - Tracking data
   */
  trackOrder: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/track`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Rate an order
   * @param {string} orderId - Order ID
   * @param {number} rating - Rating value (1-5)
   * @param {string} review - Review text
   * @returns {Promise<Object>} - Updated order data
   */
  rateOrder: async (orderId, rating, review) => {
    try {
      const response = await api.post(`/orders/${orderId}/rate`, {
        rating,
        review
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get order invoice
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} - Invoice data
   */
  getOrderInvoice: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/invoice`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Reorder previous order
   * @param {string} orderId - Order ID to reorder
   * @returns {Promise<Object>} - New cart data with items from previous order
   */
  reorder: async (orderId) => {
    try {
      const response = await api.post(`/orders/${orderId}/reorder`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Request order return/refund
   * @param {string} orderId - Order ID
   * @param {Object} returnData - Return request data
   * @returns {Promise<Object>} - Return request data
   */
  requestReturn: async (orderId, returnData) => {
    try {
      const response = await api.post(`/orders/${orderId}/return`, returnData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get available payment methods for checkout
   * @returns {Promise<Object>} - Payment methods data
   */
  getPaymentMethods: async () => {
    try {
      const response = await api.get('/payment-methods');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Process payment for order
   * @param {string} orderId - Order ID
   * @param {Object} paymentData - Payment data
   * @returns {Promise<Object>} - Payment result data
   */
  processPayment: async (orderId, paymentData) => {
    try {
      const response = await api.post(`/orders/${orderId}/payment`, paymentData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default orderService; 