import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Auth stack parameter list
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  ChangePassword: undefined;
};

// Main stack parameter list
export type MainStackParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
  OrderHistory: undefined;
  ProductDetails: { productId: string };
  Cart: undefined;
  Checkout: undefined;
  
  // Profile related screens
  ChangePassword: undefined;
  Notifications: undefined;
  Privacy: undefined;
  SavedAddresses: undefined;
  Wishlist: undefined;
  
  // Vendor specific screens
  ProductManagement: undefined;
  OrderManagement: undefined;
  Reports: undefined;
  
  // Admin specific screens
  UserManagement: undefined;
  VendorManagement: undefined;
  CategoryManagement: undefined;
};

// Root stack parameter list
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Splash: undefined;
};

// Navigation prop types
export type AuthScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type MainScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;
export type RootScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>; 