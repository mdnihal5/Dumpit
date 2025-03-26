import axios from 'axios';
import { getToken, clearToken } from '../utils/tokenStorage';
import { API_BASE_URL } from '../config';

// Create an axios instance with defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Clear token and redirect to login
      await clearToken();
      // Navigation will be handled by the auth state listener
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient; 