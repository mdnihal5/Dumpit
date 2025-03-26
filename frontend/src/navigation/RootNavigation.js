import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { getToken } from '../utils/tokenStorage';

// Import navigators
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const RootNavigation = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await getToken();
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Error checking auth state:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    // You can add a splash screen or loading component here
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigation; 