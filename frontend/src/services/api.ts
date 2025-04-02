import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {API_URL} from '@env'
import useAuth from '../hooks/useAuth'
// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      console.log(
        `API Request: ${config.method?.toUpperCase()} ${config.url}`,
        config.data ? JSON.stringify(config.data).substring(0, 500) : ''
      )
      return config
    } catch (error) {
      console.error('Request interceptor error:', error)
      return config
    }
  },
  (error) => {
    console.error('Request error interceptor:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} from ${response.config.url?.split('?')[0]}`)
    return response
  },
  (error) => {
    console.error(
      `API Error: ${error.response?.status || 'Network Error'} from ${error.config?.url || 'unknown'}`,
      error.response?.data
    )
    return Promise.reject(error)
  }
)

// Auth Services - matches /api/auth routes
export const authService = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => {
    // Ensure data is properly formatted
    let formattedData = data

    // If email is nested inside email property, extract it
    if (data.email && typeof data.email === 'object' && data.email.email) {
      formattedData = data.email
    }

    // If credentials are passed separately as email & password params
    if (typeof data === 'object' && 'email' in data && 'password' in data) {
      formattedData = {
        email: data.email,
        password: data.password,
      }
    }

    console.log('Formatted login data:', {...formattedData, password: '******'})
    return api.post('/auth/login', formattedData)
  },
  logout: () => api.get('/auth/logout'),
  refreshToken: (data: any) => api.post('/auth/refresh-token', data),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', {email}),
  resetPassword: (token: string, password: string) => api.put(`/auth/reset-password/${token}`, {password}),
  changePassword: (data: any) => api.put('/auth/updatepassword', data),
  updateFcmToken: (token: string) => api.put('/auth/fcm-token', {token}),
  getProfile: () => api.get('/auth/me'),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
}

// User Services - matches /api/auth routes
// const {user} = useAuth()
export const userService = {
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put(`/auth/updatedetails`, data),
  uploadAvatar: (formData: FormData) =>
    api.put('/auth/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
      transformRequest: (data) => {
        // Don't transform FormData
        return data
      },
    }),
  getAddresses: () => api.get('/auth/addresses'),
  addAddress: (data: any) => api.post('/auth/addresses', data),
  updateAddress: (id: string, data: any) => api.put(`/auth/addresses/${id}`, data),
  deleteAddress: (id: string) => api.delete(`/auth/addresses/${id}`),
  setDefaultAddress: (id: string) => api.put(`/auth/addresses/${id}/default`),
  getOrders: () => api.get('/orders/my-orders'),
  getOrderStats: () => api.get('/orders/stats'),
  changePassword: (data: any) => api.put('/auth/updatepassword', data),
}

// Order Services - matches /api/orders routes
export const orderService = {
  createOrder: (data: any) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getOrderById: (id: string) => api.get(`/orders/${id}`),
  cancelOrder: (id: string) => api.put(`/orders/${id}/cancel`),
  // Vendor only
  getVendorOrders: () => api.get('/orders/vendor'),
  updateOrderStatus: (id: string, status: string) => api.put(`/orders/${id}/status`, {status}),
  // Admin only
  getAllOrders: () => api.get('/orders'),
  deleteOrder: (id: string) => api.delete(`/orders/${id}`),
}

// Product Services - matches /api/products routes
export const productService = {
  getAllProducts: (params?: any) => api.get('/products', {params}),
  getProduct: (id: string) => api.get(`/products/${id}`),
  getProductsByVendor: (vendorId: string) => api.get(`/products/vendor/${vendorId}`),
  getProductsByCategory: (category: string) => api.get(`/products/category/${category}`),
  searchProducts: (query: string) => api.get(`/products/search?q=${query}`),
}

// Shop Services - matches /api/shops routes
export const shopService = {
  getAllShops: (params?: any) => api.get('/shops', {params}),
  getShop: (id: string) => api.get(`/shops/${id}`),
  getShopProducts: (id: string) => api.get(`/shops/${id}/products`),
  getShopReviews: (id: string) => api.get(`/shops/${id}/reviews`),
  searchShops: (query: string) => api.get(`/shops/search?q=${query}`),
}

// Review Services - matches /api/reviews routes
export const reviewService = {
  createReview: (data: any) => api.post('/reviews', data),
  updateReview: (id: string, data: any) => api.put(`/reviews/${id}`, data),
  deleteReview: (id: string) => api.delete(`/reviews/${id}`),
  getProductReviews: (productId: string) => api.get(`/reviews/product/${productId}`),
  getVendorReviews: (vendorId: string) => api.get(`/reviews/vendor/${vendorId}`),
}

// Category Services - matches /api/categories routes
export const categoryService = {
  getAllCategories: () => api.get('/categories'),
  getCategory: (id: string) => api.get(`/categories/${id}`),
  getCategoryProducts: (id: string) => api.get(`/categories/${id}/products`),
}

// Payment Services - matches /api/payments routes
export const paymentService = {
  createPayment: (data: any) => api.post('/payments', data),
  getPaymentStatus: (id: string) => api.get(`/payments/${id}/status`),
  verifyPayment: (id: string, data: any) => api.post(`/payments/${id}/verify`, data),
}

// Notification Services - matches /api/notifications routes
export const notificationService = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id: string) => api.delete(`/notifications/${id}`),
  clearAllNotifications: () => api.delete('/notifications/clear-all'),
  getSettings: () => api.get('/notifications/settings'),
  updateSettings: (settings: {orderUpdates?: boolean; promotions?: boolean; systemAlerts?: boolean}) =>
    api.put('/notifications/settings', settings),
}

export default api
