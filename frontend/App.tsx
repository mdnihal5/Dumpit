import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import { paperTheme } from './src/utils/theme';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';

// Loading component for PersistGate
const LoadingComponent = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={paperTheme.colors.primary} />
    <Text style={styles.loadingText}>Loading DumpIt</Text>
  </View>
);

// Error component for PersistGate failures
const PersistError = () => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorTitle}>Something went wrong</Text>
    <Text style={styles.errorMessage}>Please restart the application</Text>
  </View>
);

export default function App() {
  return (
    <ReduxProvider store={store}>
      <PersistGate 
        loading={<LoadingComponent />} 
        persistor={persistor}
        onBeforeLift={() => {
          // You can do additional setup here before state is rehydrated
          console.log('Before state rehydration');
        }}
      >
        <PaperProvider theme={paperTheme}>
          <StatusBar style="auto" />
          <RootNavigator />
          <Toast />
        </PaperProvider>
      </PersistGate>
    </ReduxProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: paperTheme.colors.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: paperTheme.colors.primary,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: paperTheme.colors.background,
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: paperTheme.colors.error,
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: paperTheme.colors.text,
    textAlign: 'center',
  },
});
