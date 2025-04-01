export interface User {
  _id: string;
  
  // Required fields
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'vendor' | 'admin';
  
  // Optional fields that may be populated by the server
  avatar?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  status?: 'active' | 'inactive' | 'blocked';
  addresses?: any[];
  createdAt?: string;
  updatedAt?: string;
} 