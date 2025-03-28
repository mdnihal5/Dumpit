import { useState, useEffect, useContext, createContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/api';
import { ToastAndroid, Platform, Alert } from 'react-native';
import { useAppDispatch, useAppSelector } from './useRedux';
import { 
  login as loginAction, 
  register as registerAction, 
  logout as logoutAction,
  verifyToken as verifyTokenAction,
  clearError as clearErrorAction
} from '../store/slices/authSlice';

// Helper for showing feedback consistently across platforms
const showFeedback = (message: string, isError = false) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else if (isError) {
    Alert.alert('Error', message);
  }
};

// Define types
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, password: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  updateProfile: (userData: any) => Promise<boolean>;
}

// Create context
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load user from storage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          await fetchUserProfile();
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Fetch user profile from API
  const fetchUserProfile = async () => {
    try {
      const response = await authService.getProfile();
      if (response.data.success) {
        setUser(response.data.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      await AsyncStorage.removeItem('token');
      setUser(null);
      return false;
    }
  };

  // Login user
  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      
      if (response.data.success) {
        await AsyncStorage.setItem('token', response.data.token);
        await fetchUserProfile();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Register user
  const register = async (userData: any) => {
    try {
      const response = await authService.register(userData);
      
      if (response.data.success) {
        await AsyncStorage.setItem('token', response.data.token);
        await fetchUserProfile();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.removeItem('token');
      setUser(null);
    }
  };

  // Forgot password
  const forgotPassword = async (email: string) => {
    try {
      const response = await authService.forgotPassword(email);
      return response.data.success;
    } catch (error) {
      console.error('Forgot password error:', error);
      return false;
    }
  };

  // Reset password
  const resetPassword = async (token: string, password: string) => {
    try {
      const response = await authService.resetPassword(token, password);
      return response.data.success;
    } catch (error) {
      console.error('Reset password error:', error);
      return false;
    }
  };

  // Change password
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const response = await authService.changePassword({
        currentPassword,
        newPassword,
      });
      return response.data.success;
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    }
  };

  // Update profile
  const updateProfile = async (userData: any) => {
    try {
      const response = await authService.updateProfile(userData);
      
      if (response.data.success) {
        setUser({
          ...user,
          ...response.data.data,
        } as User);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        changePassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

export default useAuth; 