import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import { 
  LoginScreen, 
  RegisterScreen, 
  ForgotPasswordScreen 
} from '../screens/auth';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator; 