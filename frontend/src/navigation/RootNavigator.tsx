import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { RootStackParamList } from './types';
import { useAuth } from '../context/AuthContext';
import { colors, typography } from '../utils/theme';
import { navigationRef } from './navigationService';

// Import navigators
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

// Splash screen component
const SplashScreen: React.FC = () => (
  <View style={styles.splashContainer}>
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={styles.splashText}>DumpIt</Text>
  </View>
);

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isAppReady, setIsAppReady] = useState(false);
  const prevAuthState = useRef(isAuthenticated);

  // Wait for auth state to be loaded
  useEffect(() => {
    if (!isLoading) {
      // Auth state is ready, set app as ready
      console.log('Auth state ready, authenticated:', isAuthenticated);
      setIsAppReady(true);
    }
  }, [isLoading, isAuthenticated]);

  // Handle auth state changes after initial load
  useEffect(() => {
    if (isAppReady && prevAuthState.current !== isAuthenticated) {
      console.log('Auth state changed:', isAuthenticated);
      prevAuthState.current = isAuthenticated;
    }
  }, [isAuthenticated, isAppReady]);

  if (isLoading || !isAppReady) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen 
            name="Main" 
            component={MainNavigator} 
            options={{
              animation: 'fade',
            }} 
          />
        ) : (
          <Stack.Screen 
            name="Auth" 
            component={AuthNavigator} 
            options={{
              animation: 'fade',
            }} 
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  splashText: {
    marginTop: 20,
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  splashSubtext: {
    marginTop: 10,
    fontSize: 16,
    color: colors.darkGray,
  },
});

export default RootNavigator; 