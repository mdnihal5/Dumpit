import apiClient from './client'
import {User} from '../types/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {API_CONFIG, STORAGE_KEYS} from '../utils/constants'

export interface AuthResponse {
  success: boolean
  message: string
  data?: {
    user: User
    token: string
    refreshToken: string
  }
  error?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  phone: string
  password: string
  role?: 'customer' | 'vendor' | 'admin'
}

const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      console.log('Attempting login with:', {...credentials, password: '*****'})
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, credentials)
      console.log('Login response:', response.data.user)

      // Save tokens if successful
      if (response.data.success) {
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.data.token)
        if (response.data.data.refreshToken) {
          await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.data.refreshToken)
        }
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.data.user))
      }

      return response.data
    } catch (error: any) {
      console.error('Login error details:', {
        message: error.message,
        status: error.response?.status,
        responseData: error.response?.data,
      })
      return {
        success: false,
        message: error.response?.data?.message || 'Network error or server unavailable',
        error: error.response?.data?.error || error.message,
      }
    }
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.REGISTER, credentials)
      return response.data
    } catch (error: any) {
      console.error('Registration error:', error.message)
      return {
        success: false,
        message: 'Network error or server unavailable',
        error: error.response?.data?.message || error.message,
      }
    }
  },

  forgotPassword: async (email: string): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.FORGOT_PASSWORD, {email})
      return response.data
    } catch (error: any) {
      console.error('Forgot password error:', error.message)
      return {
        success: false,
        message: 'Network error or server unavailable',
        error: error.response?.data?.message || error.message,
      }
    }
  },

  resetPassword: async (resetToken: string, newPassword: string): Promise<AuthResponse> => {
    try {
      const response = await apiClient.put(`${API_CONFIG.ENDPOINTS.RESET_PASSWORD}/${resetToken}`, {
        password: newPassword,
      })
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to reset password',
        error: error.response?.data?.message || error.message,
      }
    }
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<AuthResponse> => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
      const response = await apiClient.put(
        API_CONFIG.ENDPOINTS.CHANGE_PASSWORD,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to change password',
        error: error.response?.data?.message || error.message,
      }
    }
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)

      if (!token) {
        return {success: false, message: 'Not authenticated'}
      }

      const response = await apiClient.get(API_CONFIG.ENDPOINTS.ME, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error: any) {
      console.error('Get current user error:', error.message)
      return {
        success: false,
        message: 'Network error or server unavailable',
        error: error.response?.data?.message || error.message,
      }
    }
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.REFRESH_TOKEN, {refreshToken})
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to refresh token',
        error: error.response?.data?.message || error.message,
      }
    }
  },

  logout: async (): Promise<AuthResponse> => {
    try {
      // Clear storage regardless of API response
      await AsyncStorage.multiRemove([STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.REFRESH_TOKEN, STORAGE_KEYS.USER])
      return {success: true, message: 'Logged out successfully'}
    } catch (error: any) {
      console.error('Logout error:', error.message)
      return {success: false, message: 'Error during logout'}
    }
  },
}

export default authService
