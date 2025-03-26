import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { HomeScreen } from '../screens/home';
import { ProductDetailScreen, ProductListScreen, SearchScreen } from '../screens/product';
import { CartScreen, CheckoutScreen } from '../screens/cart';
import { ProfileScreen } from '../screens/profile';
import { VendorDetailScreen } from '../screens/vendor';

const Stack = createStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="VendorDetail" component={VendorDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default MainStack; 