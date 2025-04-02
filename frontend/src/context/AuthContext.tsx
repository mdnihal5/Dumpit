import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, userService } from '../api/services';
import { Platform, ToastAndroid, Alert } from 'react-native';
import { User, LoginRequest, RegisterRequest, ChangePasswordRequest } from '../api/types';
import * as NavigationService from '../navigation/navigationService';

// Auth context state interface
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, password: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
}

// Helper for showing feedback consistently across platforms
const showFeedback = (message: string, isError = false) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else if (isError) {
    Alert.alert('Error', message);
  } else {
    Alert.alert('Success', message);
  }
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  forgotPassword: async () => false,
  resetPassword: async () => false,
  changePassword: async () => false,
  updateProfile: async () => false,
});

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load stored auth data on mount
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        setIsLoading(true);
        const storedToken = await AsyncStorage.getItem('token');
        
        if (storedToken) {
          setToken(storedToken);
          await fetchUserProfile();
        }
      } catch (error) {
        console.error('Error loading stored auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  // Fetch user profile
  const fetchUserProfile = async (): Promise<boolean> => {
    try {
      const response = await userService.getProfile();
      
      if (response.data && response.data.success && response.data.data) {
        // API might return the user directly or nested within a user property
        // Handle both cases by checking the shape of the returned data
        const userData = (response.data.data as any).user || response.data.data;
        setUser(userData as User);
        return true;
      }
      
      // If unsuccessful, clear token
      await AsyncStorage.removeItem('token');
      setToken(null);
      setUser(null);
      return false;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      await AsyncStorage.removeItem('token');
      setToken(null);
      setUser(null);
      return false;
    }
  };

  // Login
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log('Login attempt with:', { email, password: '******' });
      
      const response = await authService.login({ email, password });
      console.log('Login response:', response.data);
      
      if (response.data.success && response.data.data) {
        const { token, user } = response.data.data;
        
        // Store token
        await AsyncStorage.setItem('token', token);
        setToken(token);
        
        // Set user data directly from response
        setUser(user);

        // Navigate to main app (if navigationRef is ready)
        if (NavigationService.navigationRef.current) {
          NavigationService.resetToMain();
        }

        return true;
      }
      
      showFeedback(response.data.message || 'Login failed', true);
      return false;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Login failed';
      console.error('Login error:', errorMsg);
      showFeedback(errorMsg, true);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register
  const register = useCallback(async (data: RegisterRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.register(data);
      
      if (response.data.success && response.data.data) {
        const { token, user } = response.data.data;
        
        // Store token
        await AsyncStorage.setItem('token', token);
        setToken(token);
        
        // Set user directly
        setUser(user);

        // Navigate to main app (if navigationRef is ready)
        if (NavigationService.navigationRef.current) {
          NavigationService.resetToMain();
        }

        return true;
      }
      
      showFeedback(response.data.message || 'Registration failed', true);
      return false;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Registration failed';
      console.error('Registration error:', errorMsg);
      showFeedback(errorMsg, true);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear auth data regardless of API response
      await AsyncStorage.removeItem('token');
      setToken(null);
      setUser(null);

      // Navigate to auth stack (if navigationRef is ready)
      if (NavigationService.navigationRef.current) {
        NavigationService.resetToAuth();
      }

      setIsLoading(false);
    }
  }, []);

  // Forgot password
  const forgotPassword = useCallback(async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.forgotPassword(email);
      
      if (response.data && response.data.success) {
        showFeedback(response.data.message || 'Password reset instructions sent to your email');
        return true;
      }
      
      showFeedback(response.data?.message || 'Failed to process request', true);
      return false;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to process request';
      console.error('Forgot password error:', errorMsg);
      showFeedback(errorMsg, true);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reset password
  const resetPassword = useCallback(async (token: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.resetPassword(token, password);
      
      if (response.data && response.data.success) {
        showFeedback(response.data.message || 'Password reset successful');
        return true;
      }
      
      showFeedback(response.data?.message || 'Password reset failed', true);
      return false;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to reset password';
      console.error('Reset password error:', errorMsg);
      showFeedback(errorMsg, true);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Change password
  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await userService.changePassword({ currentPassword, newPassword });
      
      if (response.data && response.data.success) {
        showFeedback(response.data.message || 'Password changed successfully');
        return true;
      }
      
      showFeedback(response.data?.message || 'Failed to change password', true);
      return false;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to change password';
      console.error('Change password error:', errorMsg);
      showFeedback(errorMsg, true);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (data: Partial<User>): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await userService.updateProfile(data);
      
      if (response.data && response.data.success) {
        // Update user state with new data
        setUser(prevUser => ({
          ...prevUser!,
          ...response.data.data
        }));
        
        showFeedback(response.data.message || 'Profile updated successfully');
        return true;
      }
      
      showFeedback(response.data?.message || 'Failed to update profile', true);
      return false;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to update profile';
      console.error('Update profile error:', errorMsg);
      showFeedback(errorMsg, true);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Context value
  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext); 