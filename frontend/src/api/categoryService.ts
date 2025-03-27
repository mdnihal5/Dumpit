import apiClient from './client';
import { API_CONFIG } from '../utils/constants';

export interface Category {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesResponse {
  success: boolean;
  message?: string;
  error?: string;
  count?: number;
  data?: Category[];
}

export interface CategoryResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: Category;
}

const categoryService = {
  // Get all categories
  getCategories: async (): Promise<CategoriesResponse> => {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.CATEGORIES);
      return response.data;
    } catch (error: any) {
      return { 
        success: false, 
        message: 'Failed to fetch categories',
        error: error.response?.data?.message || error.message 
      };
    }
  },

  // Get category by ID
  getCategoryById: async (categoryId: string): Promise<CategoryResponse> => {
    try {
      const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${categoryId}`);
      return response.data;
    } catch (error: any) {
      return { 
        success: false, 
        message: 'Failed to fetch category details',
        error: error.response?.data?.message || error.message 
      };
    }
  },

  // Get products by category
  getProductsByCategory: async (categoryId: string): Promise<any> => {
    try {
      const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${categoryId}/products`);
      return response.data;
    } catch (error: any) {
      return { 
        success: false, 
        message: 'Failed to fetch products for this category',
        error: error.response?.data?.message || error.message 
      };
    }
  },
};

export default categoryService; 