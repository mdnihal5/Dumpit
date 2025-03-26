import apiClient from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

class CartService {
  /**
   * Get the current user's cart
   * @returns {Promise<Object>} The cart data
   */
  async getCart() {
    try {
      const response = await apiClient.get('/cart');
      return response.data;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  /**
   * Add a product to the cart
   * @param {string} productId - The ID of the product to add
   * @param {number} quantity - The quantity to add (default: 1)
   * @returns {Promise<Object>} The updated cart
   */
  async addToCart(productId, quantity = 1) {
    try {
      const response = await apiClient.post('/cart/items', { productId, quantity });
      return response.data;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  /**
   * Update the quantity of a product in the cart
   * @param {string} itemId - The cart item ID
   * @param {number} quantity - The new quantity
   * @returns {Promise<Object>} The updated cart
   */
  async updateCartItem(itemId, quantity) {
    try {
      const response = await apiClient.put(`/cart/items/${itemId}`, { quantity });
      return response.data;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  /**
   * Remove an item from the cart
   * @param {string} itemId - The cart item ID to remove
   * @returns {Promise<Object>} The updated cart
   */
  async removeFromCart(itemId) {
    try {
      const response = await apiClient.delete(`/cart/items/${itemId}`);
      return response.data;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  /**
   * Clear all items from the cart
   * @returns {Promise<Object>} The empty cart
   */
  async clearCart() {
    try {
      const response = await apiClient.delete('/cart');
      return response.data;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  /**
   * Apply a coupon or promo code to the cart
   * @param {string} code - The coupon/promo code to apply
   * @returns {Promise<Object>} The updated cart with discount
   */
  async applyCoupon(code) {
    try {
      const response = await apiClient.post('/cart/coupon', { code });
      return response.data;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  /**
   * Remove applied coupon from the cart
   * @returns {Promise<Object>} The updated cart without discount
   */
  async removeCoupon() {
    try {
      const response = await apiClient.delete('/cart/coupon');
      return response.data;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  /**
   * Calculate shipping costs based on address
   * @param {Object} address - The shipping address
   * @returns {Promise<Object>} The updated cart with shipping costs
   */
  async calculateShipping(address) {
    try {
      const response = await apiClient.post('/cart/shipping', { address });
      return response.data;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  /**
   * Handle offline cart operations by storing in AsyncStorage
   * @param {Object} cartData - The cart data to store
   * @returns {Promise<void>}
   */
  async saveOfflineCart(cartData) {
    try {
      await AsyncStorage.setItem('offline_cart', JSON.stringify(cartData));
    } catch (error) {
      console.error('Error saving offline cart:', error);
      throw error;
    }
  }

  /**
   * Retrieve offline cart data
   * @returns {Promise<Object|null>} The offline cart data or null
   */
  async getOfflineCart() {
    try {
      const cartData = await AsyncStorage.getItem('offline_cart');
      return cartData ? JSON.parse(cartData) : null;
    } catch (error) {
      console.error('Error retrieving offline cart:', error);
      throw error;
    }
  }

  /**
   * Sync offline cart with server when online
   * @returns {Promise<Object>} The synced cart
   */
  async syncOfflineCart() {
    try {
      const offlineCart = await this.getOfflineCart();
      
      if (!offlineCart || !offlineCart.items || offlineCart.items.length === 0) {
        return null;
      }
      
      // For each item in offline cart, add to server cart
      for (const item of offlineCart.items) {
        await this.addToCart(item.product.id, item.quantity);
      }
      
      // Clear offline cart after sync
      await AsyncStorage.removeItem('offline_cart');
      
      // Return the updated cart from server
      return await this.getCart();
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  /**
   * Handle API errors
   * @private
   * @param {Error} error - The error to handle
   */
  _handleError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Cart API Error Response:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Cart API No Response:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Cart API Error:', error.message);
    }
  }
}

export default new CartService(); 