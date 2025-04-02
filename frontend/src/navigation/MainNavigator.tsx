import React from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from './types';
import MainTabNavigator from './MainTabNavigator';

// Import the screens that definitely exist
import SavedAddressesScreen from '../screens/main/SavedAddressesScreen';
import AddAddressScreen from '../screens/main/AddAddressScreen';
import ChangePasswordScreen from '../screens/auth/ChangePasswordScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CategoryScreen from '../screens/CategoryScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';

// Create a placeholder component for screens that don't exist yet
const PlaceholderScreen: React.FC<any> = ({ route }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Screen not implemented: {route?.name}</Text>
  </View>
);

const Stack = createNativeStackNavigator<MainStackParamList>();

/**
 * Main application navigator that includes tab navigation and all other screens
 */
const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Main Tab Navigator as the root */}
      <Stack.Screen name="Main" component={MainTabNavigator} />
      
      {/* Product related screens */}
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="Category" component={CategoryScreen} />
      <Stack.Screen name="Checkout" component={PlaceholderScreen} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      
      {/* Profile related screens */}
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={PlaceholderScreen} />
      <Stack.Screen name="Addresses" component={PlaceholderScreen} />
      <Stack.Screen name="SavedAddresses" component={SavedAddressesScreen} />
      <Stack.Screen name="AddAddress" component={AddAddressScreen} />
      <Stack.Screen name="EditAddress" component={PlaceholderScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="Privacy" component={PlaceholderScreen} />
      
      {/* Notification screens */}
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      
      {/* Vendor specific screens */}
      <Stack.Screen name="ProductManagement" component={PlaceholderScreen} />
      <Stack.Screen name="OrderManagement" component={PlaceholderScreen} />
      <Stack.Screen name="Reports" component={PlaceholderScreen} />
      
      {/* Admin specific screens */}
      <Stack.Screen name="UserManagement" component={PlaceholderScreen} />
      <Stack.Screen name="VendorManagement" component={PlaceholderScreen} />
      <Stack.Screen name="CategoryManagement" component={PlaceholderScreen} />
      
      {/* Info screens */}
      <Stack.Screen name="AboutUs" component={PlaceholderScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PlaceholderScreen} />
      <Stack.Screen name="TermsConditions" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator; 