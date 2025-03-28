import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, 
        config.data ? JSON.stringify(config.data).substring(0, 500) : '');
      return config;
    } catch (error) {
      console.error("Request interceptor error:", error);
      return config;
    }
  },
  (error) => {
    console.error("Request error interceptor:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} from ${response.config.url?.split('?')[0]}`);
    return response;
  },
  (error) => {
    console.error(`API Error: ${error.response?.status || 'Network Error'} from ${error.config?.url || 'unknown'}`, 
      error.response?.data);
    return Promise.reject(error);
  }
);

// Auth Services - matches /api/auth routes
export const authService = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  refreshToken: (data: any) => api.post('/auth/refresh-token', data),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => 
    api.put(`/auth/reset-password/${token}`, { password }),
  changePassword: (data: any) => api.put('/auth/change-password', data),
  updateFcmToken: (token: string) => api.put('/auth/fcm-token', { token }),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

// User Services - matches /api/users routes
export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  uploadAvatar: (formData: FormData) => 
    api.put('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  getAddresses: () => api.get('/users/addresses'),
  addAddress: (data: any) => api.post('/users/addresses', data),
  updateAddress: (id: string, data: any) => 
    api.put(`/users/addresses/${id}`, data),
  deleteAddress: (id: string) => api.delete(`/users/addresses/${id}`),
  setDefaultAddress: (id: string) => 
    api.put(`/users/addresses/${id}/default`),
  getOrders: () => api.get('/users/orders'),
  getOrderStats: () => api.get('/users/order-stats'),
};

// Order Services - matches /api/orders routes
export const orderService = {
  createOrder: (data: any) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getOrderById: (id: string) => api.get(`/orders/${id}`),
  cancelOrder: (id: string) => api.put(`/orders/${id}/cancel`),
  // Vendor only
  getVendorOrders: () => api.get('/orders/vendor'),
  updateOrderStatus: (id: string, status: string) => 
    api.put(`/orders/${id}/status`, { status }),
  // Admin only
  getAllOrders: () => api.get('/orders'),
  deleteOrder: (id: string) => api.delete(`/orders/${id}`),
};

// Product Services - matches /api/products routes
export const productService = {
  getAllProducts: (params?: any) => api.get('/products', { params }),
  getProduct: (id: string) => api.get(`/products/${id}`),
  getProductsByVendor: (vendorId: string) => 
    api.get(`/products/vendor/${vendorId}`),
  getProductsByCategory: (category: string) => 
    api.get(`/products/category/${category}`),
  searchProducts: (query: string) => 
    api.get(`/products/search?q=${query}`),
};

// Vendor Services - matches /api/vendors routes
export const vendorService = {
  getAllVendors: (params?: any) => api.get('/vendors', { params }),
  getVendor: (id: string) => api.get(`/vendors/${id}`),
  getVendorProducts: (id: string) => api.get(`/vendors/${id}/products`),
  getVendorReviews: (id: string) => api.get(`/vendors/${id}/reviews`),
  searchVendors: (query: string) => api.get(`/vendors/search?q=${query}`),
};

// Review Services - matches /api/reviews routes
export const reviewService = {
  createReview: (data: any) => api.post('/reviews', data),
  updateReview: (id: string, data: any) => api.put(`/reviews/${id}`, data),
  deleteReview: (id: string) => api.delete(`/reviews/${id}`),
  getProductReviews: (productId: string) => 
    api.get(`/reviews/product/${productId}`),
  getVendorReviews: (vendorId: string) => 
    api.get(`/reviews/vendor/${vendorId}`),
};

// Category Services - matches /api/categories routes
export const categoryService = {
  getAllCategories: () => api.get('/categories'),
  getCategory: (id: string) => api.get(`/categories/${id}`),
  getCategoryProducts: (id: string) => api.get(`/categories/${id}/products`),
};

// Payment Services - matches /api/payments routes
export const paymentService = {
  createPayment: (data: any) => api.post('/payments', data),
  getPaymentStatus: (id: string) => api.get(`/payments/${id}/status`),
  verifyPayment: (id: string, data: any) => 
    api.post(`/payments/${id}/verify`, data),
};

export default api; 