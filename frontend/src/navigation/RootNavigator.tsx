import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { RootStackParamList } from './types';
import useAuth from '../hooks/useAuth';
import { colors, typography } from '../utils/theme';

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
  const { isAuthenticated, isLoading, verifyToken } = useAuth();
  const [isAppReady, setIsAppReady] = useState(false);

  // Verify token and simulate a splash screen
  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Verify the token
        await verifyToken();
        
        // Add any initialization logic here
        // Like loading fonts, initial data, etc.
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (e) {
        console.warn('Error loading app:', e);
      } finally {
        setIsAppReady(true);
      }
    };

    prepareApp();
  }, [verifyToken]);

  if (!isAppReady || isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
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