/**
 * Common API response type
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

/**
 * User model
 */
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Auth-related types
 */
export interface AuthData {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'customer' | 'vendor' | 'admin';
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * Product-related types
 */
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: Category | string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Category-related types
 */
export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Order-related types
 */
export interface Order {
  _id: string;
  user: User | string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: Product | string;
  quantity: number;
  price: number;
}

/**
 * Address types
 */
export interface Address {
  _id?: string;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

/**
 * Address API response types
 */
export interface ApiAddressResponse extends ApiResponse<Address[]> {
  count?: number;
}

export interface ApiAddressItemResponse extends ApiResponse<Address> {}

export interface AddressData {
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
} 