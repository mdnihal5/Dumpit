import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL for our API
const API_URL = 'http://localhost:5000/api'; // Change this to your actual API URL

// Create an axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in requests
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Get the token from storage
      const token = await AsyncStorage.getItem('token');
      
      // If token exists, add it to the headers
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

// Add a response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 (unauthorized) and not a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Get refresh token
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          // No refresh token, redirect to login
          // This would typically use a navigation reference or Redux action
          // which we'll implement later
          return Promise.reject(error);
        }
        
        // Attempt to refresh the token
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken
        });
        
        if (response.data.token) {
          // Store the new tokens
          await AsyncStorage.setItem('token', response.data.token);
          await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
          
          // Update the current request with the new token
          originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`;
          
          // Retry the original request
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Failed to refresh token
        // Clear stored tokens and redirect to login
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('refreshToken');
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient; 