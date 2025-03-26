import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../store/store';

// API base URL
const API_URL = process.env.API_URL || 'https://api.constructionapp.com/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  async (config) => {
    try {
      // Get token from store or storage
      const state = store.getState();
      let token = state.auth?.accessToken;
      
      // If no token in store, try to get from storage
      if (!token) {
        token = await AsyncStorage.getItem('accessToken');
      }
      
      // If token exists, add to headers
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for refresh token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Get refresh token from store or storage
        const state = store.getState();
        let refreshToken = state.auth?.refreshToken;
        
        // If no refresh token in store, try to get from storage
        if (!refreshToken) {
          refreshToken = await AsyncStorage.getItem('refreshToken');
        }
        
        if (!refreshToken) {
          // If no refresh token, redirect to login
          store.dispatch({ type: 'auth/logout' });
          return Promise.reject(error);
        }
        
        // Request new access token using refresh token
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken,
        });
        
        // Get new tokens
        const { accessToken, newRefreshToken } = response.data;
        
        // Store new tokens
        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('refreshToken', newRefreshToken || refreshToken);
        
        // Update auth header
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        
        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, logout
        store.dispatch({ type: 'auth/logout' });
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper function to handle API errors
export const handleApiError = (error) => {
  let errorMessage = 'Something went wrong, please try again.';
  
  if (error.response) {
    // The request was made and the server responded with a status code
    const { status, data } = error.response;
    
    if (status === 400) {
      errorMessage = data.message || 'Invalid request, please check your data.';
    } else if (status === 401) {
      errorMessage = 'Unauthorized, please login again.';
    } else if (status === 403) {
      errorMessage = 'You do not have permission to perform this action.';
    } else if (status === 404) {
      errorMessage = 'Resource not found.';
    } else if (status === 422) {
      errorMessage = data.message || 'Validation error, please check your data.';
      
      // Handle validation errors
      if (data.errors) {
        const firstError = Object.values(data.errors)[0];
        if (Array.isArray(firstError) && firstError.length > 0) {
          errorMessage = firstError[0];
        }
      }
    } else if (status >= 500) {
      errorMessage = 'Server error, please try again later.';
    }
  } else if (error.request) {
    // The request was made but no response was received
    errorMessage = 'Network error, please check your connection.';
  }
  
  return errorMessage;
};

// Export the API client
export default api; 