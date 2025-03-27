import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from './types';

// Import screens
import HomeScreen from '../screens/main/HomeScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

// Placeholder for screens that will be created next
const SettingsScreen = () => null;
const EditProfileScreen = () => null;
const AddressesScreen = () => null;
const ChangePasswordScreen = () => null;
const AboutUsScreen = () => null;
const PrivacyPolicyScreen = () => null;
const TermsConditionsScreen = () => null;
const SavedAddressesScreen = () => null;
const WishlistScreen = () => null;
const OrderHistoryScreen = () => null;
const NotificationsScreen = () => null;
const PrivacyScreen = () => null;
const ProductDetailsScreen = () => null;
const CartScreen = () => null;
const CheckoutScreen = () => null;
const ProductManagementScreen = () => null;
const OrderManagementScreen = () => null;
const ReportsScreen = () => null;
const UserManagementScreen = () => null;
const VendorManagementScreen = () => null;
const CategoryManagementScreen = () => null;

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Core screens */}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      
      {/* Profile related screens */}
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Addresses" component={AddressesScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="SavedAddresses" component={SavedAddressesScreen} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
      <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
      
      {/* Product related screens */}
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      
      {/* Vendor specific screens */}
      <Stack.Screen name="ProductManagement" component={ProductManagementScreen} />
      <Stack.Screen name="OrderManagement" component={OrderManagementScreen} />
      <Stack.Screen name="Reports" component={ReportsScreen} />
      
      {/* Admin specific screens */}
      <Stack.Screen name="UserManagement" component={UserManagementScreen} />
      <Stack.Screen name="VendorManagement" component={VendorManagementScreen} />
      <Stack.Screen name="CategoryManagement" component={CategoryManagementScreen} />
      
      {/* Info screens */}
      <Stack.Screen name="AboutUs" component={AboutUsScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator; 