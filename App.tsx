import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { BackHandler, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './src/navigation'; // Import our Navigation component

export default function App() {
  // Handle back button press across the app
  useEffect(() => {
    const backAction = () => {
      // Instead of exiting the app, let the navigation handle back actions
      // Return true to prevent default back behavior
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Navigation />
    </SafeAreaProvider>
  );
} 