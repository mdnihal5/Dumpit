import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Navigation
import MainNavigator from './navigation/MainNavigator';
import AuthNavigator from './navigation/AuthNavigator';

// Context providers
import { AuthProvider } from './context/AuthContext';

// Theme configuration
import { paperTheme } from './utils/theme';

// Type definitions
import { RootStackParamList } from './navigation/types';

// Stack for root navigation
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('@auth_token');
        setUserToken(token);
        setIsLoading(false);
      } catch (e) {
        console.error("Failed to get auth token", e);
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <PaperProvider theme={paperTheme}>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{ headerShown: false }}
              initialRouteName="Auth"
            >
              <Stack.Screen name="Auth" component={AuthNavigator} />
              <Stack.Screen name="Main" component={MainNavigator} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </PaperProvider>
    </AuthProvider>
  );
} 