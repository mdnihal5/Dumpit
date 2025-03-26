import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './apiClient';
import { STORAGE_KEYS } from '../config';

/**
 * Get cart from local storage
 */
export const getCart = async () => {
  try {
    const cartData = await AsyncStorage.getItem(STORAGE_KEYS.CART);
    return cartData ? JSON.parse(cartData) : { items: [], total: 0 };
  } catch (error) {
    console.error('Error getting cart:', error);
    return { items: [], total: 0 };
  }
};

/**
 * Save cart to local storage
 */
export const saveCart = async (cart) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    return true;
  } catch (error) {
    console.error('Error saving cart:', error);
    return false;
  }
};

/**
 * Add product to cart
 */
export const addToCart = async (product, quantity = 1) => {
  try {
    const cart = await getCart();
    const existingItemIndex = cart.items.findIndex(item => item.product._id === product._id);
    
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product,
        quantity,
        price: product.price,
        vendorId: product.vendor?._id || product.vendorId,
        addedAt: new Date().toISOString()
      });
    }
    
    // Recalculate total
    cart.total = calculateTotal(cart.items);
    
    await saveCart(cart);
    return { success: true, cart };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return { 
      success: false, 
      message: 'Failed to add item to cart. Please try again.'
    };
  }
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (productId, quantity) => {
  try {
    const cart = await getCart();
    const itemIndex = cart.items.findIndex(item => item.product._id === productId);
    
    if (itemIndex === -1) {
      return { 
        success: false, 
        message: 'Item not found in cart' 
      };
    }
    
    if (quantity <= 0) {
      // Remove the item if quantity is 0 or negative
      cart.items = cart.items.filter(item => item.product._id !== productId);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }
    
    // Recalculate total
    cart.total = calculateTotal(cart.items);
    
    await saveCart(cart);
    return { success: true, cart };
  } catch (error) {
    console.error('Error updating cart item:', error);
    return { 
      success: false, 
      message: 'Failed to update cart. Please try again.'
    };
  }
};

/**
 * Remove product from cart
 */
export const removeFromCart = async (productId) => {
  try {
    const cart = await getCart();
    cart.items = cart.items.filter(item => item.product._id !== productId);
    cart.total = calculateTotal(cart.items);
    
    await saveCart(cart);
    return { success: true, cart };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return { 
      success: false, 
      message: 'Failed to remove item from cart. Please try again.'
    };
  }
};

/**
 * Clear cart
 */
export const clearCart = async () => {
  try {
    await saveCart({ items: [], total: 0 });
    return { success: true };
  } catch (error) {
    console.error('Error clearing cart:', error);
    return { 
      success: false, 
      message: 'Failed to clear cart. Please try again.'
    };
  }
};

/**
 * Get count of items in cart
 */
export const getCartItemsCount = async () => {
  try {
    const cart = await getCart();
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  } catch (error) {
    console.error('Error getting cart items count:', error);
    return 0;
  }
};

/**
 * Apply coupon to cart (communicates with backend)
 */
export const applyCoupon = async (couponCode) => {
  try {
    const response = await apiClient.post('/cart/coupons', { code: couponCode });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to apply coupon. Please try again.'
    };
  }
};

/**
 * Send cart to server to calculate shipping options
 */
export const getShippingOptions = async (addressData) => {
  try {
    const cart = await getCart();
    const response = await apiClient.post('/cart/shipping-options', { 
      items: cart.items.map(item => ({
        productId: item.product._id,
        quantity: item.quantity
      })),
      address: addressData
    });
    return { success: true, options: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to get shipping options. Please try again.'
    };
  }
};

/**
 * Calculate cart total
 */
const calculateTotal = (items) => {
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
}; 