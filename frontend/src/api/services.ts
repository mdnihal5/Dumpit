import apiClient from './client';
import { 
  ApiResponse, 
  AuthData, 
  User, 
  LoginRequest, 
  RegisterRequest, 
  ChangePasswordRequest,
  Product,
  Category,
  Order,
  Address,
  ApiAddressResponse,
  ApiAddressItemResponse,
  AddressData
} from './types';
import { API_CONFIG } from '../utils/constants';

// Types for auth responses and requests
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: any;
    token: string;
    refreshToken?: string;
  };
  error?: string;
}

/**
 * Authentication Services
 */
export const authService = {
  login: (data: LoginRequest) => {
    console.log('Login request with:', { ...data, password: '******' });
    return apiClient.post<ApiResponse<AuthData>>(API_CONFIG.ENDPOINTS.LOGIN, data);
  },
  
  register: (data: RegisterRequest) => {
    console.log('Register request with:', { ...data, password: '******' });
    return apiClient.post<ApiResponse<AuthData>>(API_CONFIG.ENDPOINTS.REGISTER, data);
  },
  
  logout: () => {
    console.log('Logout request');
    return apiClient.get<ApiResponse>(API_CONFIG.ENDPOINTS.LOGOUT);
  },
  
  forgotPassword: (email: string) => {
    console.log('Forgot password request for:', email);
    return apiClient.post<ApiResponse>(API_CONFIG.ENDPOINTS.FORGOT_PASSWORD, { email });
  },
  
  resetPassword: (token: string, password: string) => {
    console.log('Reset password request');
    return apiClient.put<ApiResponse>(`${API_CONFIG.ENDPOINTS.RESET_PASSWORD}/${token}`, { password });
  }
};

/**
 * User Services
 */
export const userService = {
  getProfile: () => {
    console.log('Get profile request');
    return apiClient.get<ApiResponse<User>>(API_CONFIG.ENDPOINTS.ME);
  },
  
  updateProfile: (data: Partial<User>) => {
    console.log('Update profile request');
    return apiClient.put<ApiResponse<User>>(API_CONFIG.ENDPOINTS.UPDATE_PROFILE, data);
  },
  
  getAddresses: () => {
    console.log('Get addresses request');
    return apiClient.get<ApiAddressResponse>(API_CONFIG.ENDPOINTS.USER_ADDRESSES);
  },
  
  addAddress: (addressData: AddressData) => {
    console.log('Add address request');
    return apiClient.post<ApiAddressItemResponse>(API_CONFIG.ENDPOINTS.ADD_ADDRESS, addressData);
  },
  
  updateAddress: (addressId: string, addressData: Partial<AddressData>) => {
    console.log('Update address request');
    return apiClient.put<ApiAddressItemResponse>(`${API_CONFIG.ENDPOINTS.UPDATE_ADDRESS}/${addressId}`, addressData);
  },
  
  deleteAddress: (addressId: string) => {
    console.log('Delete address request');
    return apiClient.delete<ApiResponse>(`${API_CONFIG.ENDPOINTS.DELETE_ADDRESS}/${addressId}`);
  },
  
  setDefaultAddress: (addressId: string) => {
    console.log('Set default address request');
    return apiClient.put<ApiAddressItemResponse>(`${API_CONFIG.ENDPOINTS.SET_DEFAULT_ADDRESS}/${addressId}/default`);
  },
  
  uploadAvatar: (formData: FormData) => {
    console.log('Upload avatar request');
    return apiClient.put<ApiResponse<User>>(API_CONFIG.ENDPOINTS.AVATAR, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  changePassword: (data: ChangePasswordRequest) => {
    console.log('Change password request');
    return apiClient.put<ApiResponse>(API_CONFIG.ENDPOINTS.CHANGE_PASSWORD, data);
  }
};

/**
 * Product Services
 */
export const productService = {
  getAllProducts: (params?: any) => {
    console.log('Get all products request with params:', params);
    return apiClient.get<ApiResponse<Product[]>>(API_CONFIG.ENDPOINTS.PRODUCTS, { params });
  },
  
  getProduct: (id: string) => {
    console.log('Get product request for:', id);
    return apiClient.get<ApiResponse<Product>>(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`);
  },
  
  searchProducts: (query: string) => {
    console.log('Search products request for:', query);
    return apiClient.get<ApiResponse<Product[]>>(`${API_CONFIG.ENDPOINTS.PRODUCTS}/search?q=${query}`);
  },
  
  getProductsByCategory: (category: string) => {
    console.log('Get products by category request for:', category);
    return apiClient.get<ApiResponse<Product[]>>(`${API_CONFIG.ENDPOINTS.PRODUCTS}/category/${category}`);
  }
};

/**
 * Order Services
 */
export const orderService = {
  createOrder: (data: any) => {
    console.log('Create order request');
    return apiClient.post<ApiResponse<Order>>(API_CONFIG.ENDPOINTS.ORDERS, data);
  },
  
  createOrderFromCart: (data: any) => {
    console.log('Create order from cart request');
    return apiClient.post<ApiResponse<Order>>(API_CONFIG.ENDPOINTS.ORDER_FROM_CART, data);
  },
  
  getMyOrders: () => {
    console.log('Get my orders request');
    return apiClient.get<ApiResponse<Order[]>>(API_CONFIG.ENDPOINTS.MY_ORDERS);
  },
  
  getOrderById: (id: string) => {
    console.log('Get order by id request for:', id);
    return apiClient.get<ApiResponse<Order>>(`${API_CONFIG.ENDPOINTS.ORDERS}/${id}`);
  },
  
  getShopOrders: (shopId: string) => {
    console.log('Get shop orders request for shop:', shopId);
    return apiClient.get<ApiResponse<Order[]>>(`${API_CONFIG.ENDPOINTS.ORDERS}/shop/${shopId}`);
  },
  
  cancelOrder: (id: string) => {
    console.log('Cancel order request for:', id);
    return apiClient.put<ApiResponse<Order>>(`${API_CONFIG.ENDPOINTS.ORDERS}/${id}/cancel`);
  },
  
  updateOrderStatus: (id: string, status: string) => {
    console.log('Update order status request for:', id);
    return apiClient.put<ApiResponse<Order>>(`${API_CONFIG.ENDPOINTS.ORDERS}/${id}`, { status });
  }
};

/**
 * Cart Services
 */
export const cartService = {
  getCart: () => {
    console.log('Get cart request');
    return apiClient.get<ApiResponse<any>>(API_CONFIG.ENDPOINTS.CART);
  },
  
  addToCart: (productId: string, quantity: number) => {
    console.log('Add to cart request');
    return apiClient.post<ApiResponse<any>>(API_CONFIG.ENDPOINTS.CART, { productId, quantity });
  },
  
  updateCartItem: (itemId: string, quantity: number) => {
    console.log('Update cart item request');
    return apiClient.put<ApiResponse<any>>(`${API_CONFIG.ENDPOINTS.CART}/${itemId}`, { quantity });
  },
  
  removeCartItem: (itemId: string) => {
    console.log('Remove cart item request');
    return apiClient.delete<ApiResponse<any>>(`${API_CONFIG.ENDPOINTS.CART}/${itemId}`);
  },
  
  clearCart: () => {
    console.log('Clear cart request');
    return apiClient.delete<ApiResponse<any>>(API_CONFIG.ENDPOINTS.CART);
  }
};

/**
 * Shop Services
 */
export const shopService = {
  getAllShops: (params?: any) => {
    console.log('Get all shops request with params:', params);
    return apiClient.get<ApiResponse<any[]>>(API_CONFIG.ENDPOINTS.SHOPS, { params });
  },
  
  getShop: (id: string) => {
    console.log('Get shop request for:', id);
    return apiClient.get<ApiResponse<any>>(`${API_CONFIG.ENDPOINTS.SHOPS}/${id}`);
  },
  
  createShop: (data: any) => {
    console.log('Create shop request');
    return apiClient.post<ApiResponse<any>>(API_CONFIG.ENDPOINTS.SHOPS, data);
  },
  
  updateShop: (id: string, data: any) => {
    console.log('Update shop request');
    return apiClient.put<ApiResponse<any>>(`${API_CONFIG.ENDPOINTS.SHOPS}/${id}`, data);
  },
  
  deleteShop: (id: string) => {
    console.log('Delete shop request');
    return apiClient.delete<ApiResponse<any>>(`${API_CONFIG.ENDPOINTS.SHOPS}/${id}`);
  },
  
  addShopReview: (id: string, review: any) => {
    console.log('Add shop review request');
    return apiClient.post<ApiResponse<any>>(`${API_CONFIG.ENDPOINTS.SHOPS}/${id}/reviews`, review);
  },
  
  uploadShopImages: (id: string, images: FormData) => {
    console.log('Upload shop images request');
    return apiClient.put<ApiResponse<any>>(`${API_CONFIG.ENDPOINTS.SHOPS}/${id}/images`, images, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  getShopProducts: (id: string) => {
    console.log('Get shop products request for:', id);
    return apiClient.get<ApiResponse<any>>(`${API_CONFIG.ENDPOINTS.SHOPS}/${id}/products`);
  },
  
  getShopReviews: (id: string) => {
    console.log('Get shop reviews request for:', id);
    return apiClient.get<ApiResponse<any>>(`${API_CONFIG.ENDPOINTS.SHOPS}/${id}/reviews`);
  },
  
  searchShops: (query: string) => {
    console.log('Search shops request for:', query);
    return apiClient.get<ApiResponse<any>>(`${API_CONFIG.ENDPOINTS.SHOPS}/search?q=${query}`);
  }
};

/**
 * Notification Services
 */
export const notificationService = {
  getNotifications: () => {
    console.log('Get notifications request');
    return apiClient.get<ApiResponse<any[]>>(API_CONFIG.ENDPOINTS.NOTIFICATIONS);
  },
  
  markAsRead: (id: string) => {
    console.log('Mark notification as read request');
    return apiClient.put<ApiResponse<any>>(`${API_CONFIG.ENDPOINTS.MARK_NOTIFICATION_READ}/${id}`);
  },
  
  markAllAsRead: () => {
    console.log('Mark all notifications as read request');
    return apiClient.put<ApiResponse<any>>(API_CONFIG.ENDPOINTS.MARK_ALL_NOTIFICATIONS_READ);
  },
  
  deleteNotification: (id: string) => {
    console.log('Delete notification request');
    return apiClient.delete<ApiResponse<any>>(`${API_CONFIG.ENDPOINTS.NOTIFICATIONS}/${id}`);
  },
  
  clearAllNotifications: () => {
    console.log('Clear all notifications request');
    return apiClient.delete<ApiResponse<any>>(API_CONFIG.ENDPOINTS.NOTIFICATIONS);
  },
  
  getSettings: () => {
    console.log('Get notification settings request');
    return apiClient.get<ApiResponse<any>>(API_CONFIG.ENDPOINTS.NOTIFICATION_SETTINGS);
  },
  
  updateSettings: (settings: any) => {
    console.log('Update notification settings request');
    return apiClient.put<ApiResponse<any>>(API_CONFIG.ENDPOINTS.NOTIFICATION_SETTINGS, settings);
  }
};

/**
 * Category Services
 */
export const categoryService = {
  getAllCategories: () => {
    console.log('Get all categories request');
    return apiClient.get<ApiResponse<Category[]>>(API_CONFIG.ENDPOINTS.CATEGORIES);
  },
  
  getCategory: (id: string) => {
    console.log('Get category request for:', id);
    return apiClient.get<ApiResponse<Category>>(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${id}`);
  },
  
  getCategoryProducts: (id: string) => {
    console.log('Get category products request for:', id);
    return apiClient.get<ApiResponse<Product[]>>(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${id}/products`);
  }
};

// Export all services
export default {
  auth: authService,
  user: userService,
  product: productService,
  order: orderService,
  category: categoryService,
  cart: cartService,
  shop: shopService,
  notification: notificationService
}; 