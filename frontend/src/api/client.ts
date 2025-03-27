import axios from 'axios';
import { API_CONFIG } from '../utils/constants';

// Create a simple axios instance with minimal config
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: API_CONFIG.TIMEOUT,
});

export default apiClient; 