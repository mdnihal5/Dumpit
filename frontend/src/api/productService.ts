import apiClient from './client';
import { Product } from '../types/auth';
import { API_CONFIG, PAGINATION } from '../utils/constants';

export interface ProductsResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    products: Product[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

export interface ProductResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: Product;
}

const productService = {
  // Get all products with pagination and filtering
  getProducts: async (
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT,
    filters?: {
      category?: string;
      vendor?: string;
      minPrice?: number;
      maxPrice?: number;
      sortField?: string;
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<ProductsResponse> => {
    try {
      let queryString = `page=${page}&limit=${limit}`;
      
      if (filters) {
        if (filters.category) queryString += `&category=${filters.category}`;
        if (filters.vendor) queryString += `&vendor=${filters.vendor}`;
        if (filters.minPrice) queryString += `&minPrice=${filters.minPrice}`;
        if (filters.maxPrice) queryString += `&maxPrice=${filters.maxPrice}`;
        if (filters.sortField) queryString += `&sortField=${filters.sortField}`;
        if (filters.sortOrder) queryString += `&sortOrder=${filters.sortOrder}`;
      }
      
      const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.PRODUCTS}?${queryString}`);
      return response.data;
    } catch (error: any) {
      return { 
        success: false, 
        message: 'Failed to fetch products',
        error: error.response?.data?.message || error.message 
      };
    }
  },

  // Get featured products
  getFeaturedProducts: async (): Promise<ProductsResponse> => {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.FEATURED_PRODUCTS);
      return response.data;
    } catch (error: any) {
      return { 
        success: false, 
        message: 'Failed to fetch featured products',
        error: error.response?.data?.message || error.message 
      };
    }
  },

  // Get products by category
  getProductsByCategory: async (categoryId: string): Promise<ProductsResponse> => {
    try {
      const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.PRODUCTS}/category/${categoryId}`);
      return response.data;
    } catch (error: any) {
      return { 
        success: false, 
        message: 'Failed to fetch products for this category',
        error: error.response?.data?.message || error.message 
      };
    }
  },

  // Get products by vendor
  getProductsByVendor: async (vendorId: string): Promise<ProductsResponse> => {
    try {
      const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.PRODUCTS}/vendor/${vendorId}`);
      return response.data;
    } catch (error: any) {
      return { 
        success: false, 
        message: 'Failed to fetch products for this vendor',
        error: error.response?.data?.message || error.message 
      };
    }
  },

  // Get product by ID
  getProductById: async (productId: string): Promise<ProductResponse> => {
    try {
      const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${productId}`);
      return response.data;
    } catch (error: any) {
      return { 
        success: false, 
        message: 'Failed to fetch product details',
        error: error.response?.data?.message || error.message 
      };
    }
  },

  // Search products
  searchProducts: async (
    query: string,
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT
  ): Promise<ProductsResponse> => {
    try {
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.PRODUCTS}/search?query=${query}&page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error: any) {
      return { 
        success: false, 
        message: 'Failed to search products',
        error: error.response?.data?.message || error.message 
      };
    }
  },
};

export default productService; 