import { NavigatorScreenParams } from '@react-navigation/native';
import { MainTabParamList } from './MainTabNavigator';

// Auth stack screens
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
};

// Main app screens
export type MainStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  
  // New screens
  OrderDetails: { orderId: string };
  SavedAddresses: undefined;
  AddAddress: undefined;
  EditAddress: { address: any };
  ChangePassword: undefined;
  ProductDetails: { productId: string };
  Shop: { shopId: string };
  Category: { categoryId: string; categoryName: string };
  NotificationSettings: undefined;
  
  // Profile related screens
  EditProfile: undefined;
  Addresses: undefined;
  Privacy: undefined;
  Settings: undefined;
  
  // Product related screens
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
  
  // Tab screens - also defined in MainTabParamList but needed for stack navigation
  Home: undefined;
  Cart: undefined;
  OrderHistory: undefined;
  Notifications: undefined;
  Profile: undefined;
  Shops: undefined;
  Search: undefined;
  Products: undefined;
};

// Root navigator that contains auth and main stacks
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  Splash: undefined;
  ProductDetails: { productId: string };
  Shop: { shopId: string };
}; 