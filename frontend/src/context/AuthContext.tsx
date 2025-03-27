import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../api/auth';
import { ToastAndroid } from 'react-native';

// User type definition
export type User = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  status: string;
  addresses: any[];
  createdAt: string;
  updatedAt: string;
};

// Auth context state interface
interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (password: string, resetToken: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

// Create the context with default values
const AuthContext = createContext<AuthState>({
  user: null,
  token: null,
  refreshToken: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  forgotPassword: async () => false,
  resetPassword: async () => false,
  changePassword: async () => false,
});

// Provider component that wraps app
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        setIsLoading(true);
        // Get saved tokens and user data
        const storedUser = await AsyncStorage.getItem('user');
        const storedToken = await AsyncStorage.getItem('token');
        const storedRefreshToken = await AsyncStorage.getItem('refreshToken');

        if (storedUser && storedToken && storedRefreshToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          setRefreshToken(storedRefreshToken);
          
          // Verify token validity by fetching current user
          try {
            const { data } = await authApi.getCurrentUser();
            setUser(data.user);
          } catch (error) {
            // If verification fails, clear everything
            await AsyncStorage.multiRemove(['user', 'token', 'refreshToken']);
            setUser(null);
            setToken(null);
            setRefreshToken(null);
          }
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredData();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authApi.login({ email, password });
      
      if (response.success) {
        const { user, token, refreshToken } = response.data;
        
        // Save in state
        setUser(user);
        setToken(token);
        setRefreshToken(refreshToken);
        
        // Save in storage
        await AsyncStorage.setItem('user', JSON.stringify(user));
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('refreshToken', refreshToken);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, phone: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authApi.register({ name, email, phone, password });
      
      if (response.success) {
        const { user, token, refreshToken } = response.data;
        
        // Save in state
        setUser(user);
        setToken(token);
        setRefreshToken(refreshToken);
        
        // Save in storage
        await AsyncStorage.setItem('user', JSON.stringify(user));
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('refreshToken', refreshToken);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      await authApi.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear state
      setUser(null);
      setToken(null);
      setRefreshToken(null);
      
      // Clear storage
      await AsyncStorage.multiRemove(['user', 'token', 'refreshToken']);
      setIsLoading(false);
    }
  };

  // Forgot password function
  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      const response = await authApi.forgotPassword({ email });
      ToastAndroid.show(response.message, ToastAndroid.SHORT);
      return response.success;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to process request';
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      return false;
    }
  };

  // Reset password function
  const resetPassword = async (password: string, resetToken: string): Promise<boolean> => {
    try {
      const response = await authApi.resetPassword({ password, resetToken });
      ToastAndroid.show(response.message, ToastAndroid.SHORT);
      return response.success;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Password reset failed';
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      return false;
    }
  };

  // Change password function
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const response = await authApi.changePassword({
        currentPassword,
        newPassword,
      });
      ToastAndroid.show(response.message, ToastAndroid.SHORT);
      return response.success;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to change password';
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      return false;
    }
  };

  const value = {
    user,
    token,
    refreshToken,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext); 