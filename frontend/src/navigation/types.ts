import { NavigatorScreenParams } from '@react-navigation/native';

// Auth stack screens
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
};

// Main app screens
export type MainStackParamList = {
  // Core screens
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
  
  // Profile related screens
  EditProfile: undefined;
  Addresses: undefined;
  ChangePassword: undefined;
  SavedAddresses: undefined;
  Wishlist: undefined;
  OrderHistory: undefined;
  Notifications: undefined;
  Privacy: undefined;
  
  // Product related screens
  ProductDetails: { productId: string };
  Cart: undefined;
  Checkout: undefined;
  
  // Vendor specific screens
  ProductManagement: undefined;
  OrderManagement: undefined;
  Reports: undefined;
  
  // Admin specific screens
  UserManagement: undefined;
  VendorManagement: undefined;
  CategoryManagement: undefined;
  
  // Info screens
  AboutUs: undefined;
  PrivacyPolicy: undefined;
  TermsConditions: undefined;
};

// Root navigator that contains auth and main stacks
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
  Splash: undefined;
}; 