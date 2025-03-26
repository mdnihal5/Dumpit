import api, { handleApiError } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './apiClient';
import { saveToken, clearToken, saveUserData } from '../utils/tokenStorage';

/**
 * Auth Service
 * Handles authentication-related API calls
 */
const authService = {
  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - User data and tokens
   */
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      await saveToken(token);
      await saveUserData(user);
      
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.'
      };
    }
  },
  
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} - User data and tokens
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      const { token, user } = response.data;
      
      await saveToken(token);
      await saveUserData(user);
      
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.'
      };
    }
  },
  
  /**
   * Logout user
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
      await clearToken();
      return { success: true };
    } catch (error) {
      // Still clear token on front-end even if backend logout fails
      await clearToken();
      return { success: true };
    }
  },
  
  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} - Updated user data
   */
  updateProfile: async (userData) => {
    try {
      const response = await apiClient.put('/users/profile', userData);
      await saveUserData(response.data);
      return { success: true, user: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile. Please try again.'
      };
    }
  },
  
  /**
   * Send password reset email
   * @param {string} email - User email
   * @returns {Promise<Object>} - Success message
   */
  forgotPassword: async (email) => {
    try {
      await apiClient.post('/auth/forgot-password', { email });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to process request. Please try again.'
      };
    }
  },
  
  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} password - New password
   * @returns {Promise<Object>} - Success message
   */
  resetPassword: async (token, newPassword) => {
    try {
      await apiClient.post('/auth/reset-password', { token, newPassword });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reset password. Please try again.'
      };
    }
  },
  
  /**
   * Change user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} - Success message
   */
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/auth/change-password', {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: newPassword,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Get current user data
   * @returns {Promise<Object>} - User data
   */
  getUser: async () => {
    try {
      const response = await api.get('/auth/user');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Verify email with token
   * @param {string} token - Verification token
   * @returns {Promise<Object>} - Success message
   */
  verifyEmail: async (token) => {
    try {
      const response = await api.post('/auth/verify-email', { token });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Resend verification email
   * @returns {Promise<Object>} - Success message
   */
  resendVerificationEmail: async () => {
    try {
      const response = await api.post('/auth/resend-verification');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  /**
   * Check if user is authenticated
   * @returns {Promise<boolean>}
   */
  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      return !!token; // Convert to boolean
    } catch (error) {
      return false;
    }
  },
};

export default authService; 