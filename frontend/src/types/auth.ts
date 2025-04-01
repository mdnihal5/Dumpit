export interface Address {
  _id?: string;
  type: 'home' | 'work' | 'other';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'vendor' | 'admin';
  avatar?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  status?: 'active' | 'inactive' | 'blocked';
  addresses?: Address[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  images: string[];
  inStock: boolean;
  quantity: number;
  vendor: string;
  ratings: Rating[];
  createdAt: string;
  updatedAt: string;
}

export interface Rating {
  _id?: string;
  user: string;
  rating: number;
  review?: string;
  createdAt?: string;
}

export interface Order {
  _id: string;
  user: string | User;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: string | Product;
  quantity: number;
  price: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export enum AuthActionTypes {
  LOGIN_REQUEST = 'auth/loginRequest',
  LOGIN_SUCCESS = 'auth/loginSuccess',
  LOGIN_FAILURE = 'auth/loginFailure',
  
  REGISTER_REQUEST = 'auth/registerRequest',
  REGISTER_SUCCESS = 'auth/registerSuccess',
  REGISTER_FAILURE = 'auth/registerFailure',
  
  LOGOUT = 'auth/logout',
  
  VERIFY_TOKEN_REQUEST = 'auth/verifyTokenRequest',
  VERIFY_TOKEN_SUCCESS = 'auth/verifyTokenSuccess',
  VERIFY_TOKEN_FAILURE = 'auth/verifyTokenFailure',
  
  CLEAR_ERROR = 'auth/clearError',
} 