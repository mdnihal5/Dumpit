import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('TOKEN');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Mock data for local development
const mockUser = {
  _id: '123456',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '1234567890',
  profileImage: null
};

const mockAddresses = [
  {
    _id: 'addr1',
    name: 'John Doe',
    phone: '1234567890',
    street: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94105',
    landmark: 'Near Golden Gate Park',
    formattedAddress: '123 Main St, Near Golden Gate Park, San Francisco, CA - 94105',
    addressType: 'home',
    isDefault: true
  },
  {
    _id: 'addr2',
    name: 'John Doe',
    phone: '1234567890',
    street: '456 Market St',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94103',
    landmark: 'Near Ferry Building',
    formattedAddress: '456 Market St, Near Ferry Building, San Francisco, CA - 94103',
    addressType: 'work',
    isDefault: false
  }
];

// Authentication services
const AuthService = {
  /**
   * Login with email and password
   * @param {string} email User email
   * @param {string} password User password
   * @returns {Promise} Response with user data and tokens
   */
  login: async (email, password) => {
    try {
      // Simulate API call
      console.log('Logging in with:', email, password);
      
      // Store token in AsyncStorage
      await AsyncStorage.setItem('TOKEN', 'mock-token-xyz');
      
      // Store user in AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      
      return { user: mockUser, token: 'mock-token-xyz' };
      
      // Uncomment for real API call
      /*
      const response = await api.post('/auth/login', { email, password });
      
      // Store token in AsyncStorage
      await AsyncStorage.setItem('TOKEN', response.data.token);
      
      // Store user in AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data;
      */
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  /**
   * Register new user
   * @param {Object} userData User registration data
   * @returns {Promise} Response with user data
   */
  register: async (userData) => {
    try {
      // Simulate API call
      console.log('Registering user:', userData);
      
      return { success: true, message: 'Registration successful' };
      
      // Uncomment for real API call
      /*
      const response = await api.post('/auth/register', userData);
      return response.data;
      */
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },
  
  /**
   * Logout user and clear storage
   * @returns {Promise} Success status
   */
  logout: async () => {
    try {
      // Remove token from AsyncStorage
      await AsyncStorage.removeItem('TOKEN');
      
      // Remove user from AsyncStorage
      await AsyncStorage.removeItem('user');
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
  
  /**
   * Get current user data
   * @returns {Promise} Current user data
   */
  getCurrentUser: async () => {
    try {
      // Get user from AsyncStorage
      const userData = await AsyncStorage.getItem('user');
      
      if (userData) {
        return { user: JSON.parse(userData) };
      }
      
      // Simulate API call
      console.log('Getting current user');
      
      return { user: mockUser };
      
      // Uncomment for real API call
      /*
      const response = await api.get('/auth/me');
      return response.data;
      */
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },
  
  /**
   * Reset password
   * @param {string} email User email
   * @returns {Promise} Success status
   */
  forgotPassword: async (email) => {
    try {
      // Simulate API call
      console.log('Forgot password for:', email);
      
      return { success: true, message: 'Reset link sent to your email' };
      
      // Uncomment for real API call
      /*
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
      */
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },
  
  /**
   * Reset password with token
   * @param {string} resetToken Password reset token
   * @param {string} newPassword New password
   * @returns {Promise} Success status
   */
  resetPassword: async (resetToken, newPassword) => {
    try {
      // Simulate API call
      console.log('Resetting password with token:', resetToken);
      
      return { success: true, message: 'Password reset successful' };
      
      // Uncomment for real API call
      /*
      const response = await api.post('/auth/reset-password', { token, password });
      return response.data;
      */
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },
  
  /**
   * Change password
   * @param {string} currentPassword Current password
   * @param {string} newPassword New password
   * @returns {Promise} Success status
   */
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Check if user is logged in
   * @returns {Promise<boolean>} True if logged in
   */
  isLoggedIn: async () => {
    try {
      const token = await AsyncStorage.getItem('TOKEN');
      return !!token;
    } catch (error) {
      return false;
    }
  },
  
  // Update profile
  updateProfile: async (profileData) => {
    try {
      // Simulate API call
      console.log('Updating profile:', profileData);
      
      // Get current user
      const userData = await AsyncStorage.getItem('user');
      const currentUser = userData ? JSON.parse(userData) : mockUser;
      
      // Update user data
      const updatedUser = { ...currentUser, ...profileData };
      
      // Store updated user in AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      
      return { user: updatedUser };
      
      // Uncomment for real API call
      /*
      const response = await api.put('/auth/profile', profileData);
      
      // Update user in AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data;
      */
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
  
  // Get user profile
  getUserProfile: async () => {
    try {
      // Get user from AsyncStorage
      const userData = await AsyncStorage.getItem('user');
      
      if (userData) {
        return { user: JSON.parse(userData) };
      }
      
      // Simulate API call
      console.log('Getting user profile');
      
      return { user: mockUser };
      
      // Uncomment for real API call
      /*
      const response = await api.get('/auth/profile');
      return response.data;
      */
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  },
  
  // Get addresses
  getAddresses: async () => {
    try {
      // Simulate API call
      console.log('Getting addresses');
      
      return { addresses: mockAddresses };
      
      // Uncomment for real API call
      /*
      const response = await api.get('/auth/addresses');
      return response.data;
      */
    } catch (error) {
      console.error('Get addresses error:', error);
      throw error;
    }
  },
  
  // Add address
  addAddress: async (addressData) => {
    try {
      // Simulate API call
      console.log('Adding address:', addressData);
      
      const newAddress = {
        _id: `addr${Date.now()}`,
        ...addressData
      };
      
      return { address: newAddress };
      
      // Uncomment for real API call
      /*
      const response = await api.post('/auth/addresses', addressData);
      return response.data;
      */
    } catch (error) {
      console.error('Add address error:', error);
      throw error;
    }
  },
  
  // Update address
  updateAddress: async (addressId, addressData) => {
    try {
      // Simulate API call
      console.log('Updating address:', addressId, addressData);
      
      const updatedAddress = {
        _id: addressId,
        ...addressData
      };
      
      return { address: updatedAddress };
      
      // Uncomment for real API call
      /*
      const response = await api.put(`/auth/addresses/${addressId}`, addressData);
      return response.data;
      */
    } catch (error) {
      console.error('Update address error:', error);
      throw error;
    }
  },
  
  // Delete address
  deleteAddress: async (addressId) => {
    try {
      // Simulate API call
      console.log('Deleting address:', addressId);
      
      return { success: true };
      
      // Uncomment for real API call
      /*
      const response = await api.delete(`/auth/addresses/${addressId}`);
      return response.data;
      */
    } catch (error) {
      console.error('Delete address error:', error);
      throw error;
    }
  },
  
  // Set default address
  setDefaultAddress: async (addressId) => {
    try {
      // Simulate API call
      console.log('Setting default address:', addressId);
      
      const updatedAddress = mockAddresses.find(addr => addr._id === addressId);
      
      if (updatedAddress) {
        updatedAddress.isDefault = true;
      }
      
      return { address: updatedAddress };
      
      // Uncomment for real API call
      /*
      const response = await api.put(`/auth/addresses/${addressId}/default`);
      return response.data;
      */
    } catch (error) {
      console.error('Set default address error:', error);
      throw error;
    }
  }
};

export default AuthService; 