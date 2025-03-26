import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';

// Import screens
import { HomeScreen, CartScreen } from '../screens/main';
import { ProductDetailScreen } from '../screens/product';
import { OrdersScreen, OrderDetailsScreen } from '../screens/order';
import { ProfileScreen } from '../screens/profile';

// Import colors
import { Colors } from '../styles';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Stack
const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
    </Stack.Navigator>
  );
};

// Orders Stack
const OrdersStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="OrdersList" component={OrdersScreen} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
    </Stack.Navigator>
  );
};

// Profile Stack
const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

// Main Tab Navigator
const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Orders') {
            iconName = 'package';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          } else if (route.name === 'Cart') {
            iconName = 'shopping-cart';
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.PRIMARY,
        tabBarInactiveTintColor: Colors.TEXT.SECONDARY,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: Colors.BORDER.LIGHT,
          elevation: 0,
        },
        tabBarLabelStyle: {
          marginBottom: 5,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Orders" component={OrdersStack} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default MainNavigator; 