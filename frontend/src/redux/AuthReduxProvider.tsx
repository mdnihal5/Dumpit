import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { ToastAndroid } from 'react-native';
import { User } from '../types/user';
import { useAppDispatch, useAppSelector } from './hooks';
import { authApi } from '../api/auth';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  fetchCurrentUser,
} from './slices/authSlice';

// Auth context state interface
interface AuthContextState {
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
const AuthContext = createContext<AuthContextState>({
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

// Provider component that wraps app and uses Redux
export const AuthReduxProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use typed dispatch and selector
  const dispatch = useAppDispatch();
  const { user, token, refreshToken, isLoading, isAuthenticated, error } = 
    useAppSelector(state => state.auth);

  // Check if user is already logged in
  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token]);

  // Show error toast when there's an error
  useEffect(() => {
    if (error) {
      ToastAndroid.show(error, ToastAndroid.SHORT);
    }
  }, [error]);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const action = await dispatch(loginUser({ email, password }));
      if (action.meta.requestStatus === 'rejected') {
        throw new Error(action.payload as string);
      }
    } catch (error: any) {
      ToastAndroid.show(error.message || 'Login failed', ToastAndroid.SHORT);
      throw error;
    }
  };

  // Register function
  const register = async (name: string, email: string, phone: string, password: string) => {
    try {
      const action = await dispatch(registerUser({ name, email, phone, password }));
      if (action.meta.requestStatus === 'rejected') {
        throw new Error(action.payload as string);
      }
    } catch (error: any) {
      ToastAndroid.show(error.message || 'Registration failed', ToastAndroid.SHORT);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    await dispatch(logoutUser());
  };

  // Directly use API calls for these functions to avoid TypeScript complexity
  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      const response = await authApi.forgotPassword({ email });
      ToastAndroid.show(response.message, ToastAndroid.SHORT);
      return !!response.success;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to process request';
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      return false;
    }
  };
  
  const resetPassword = async (password: string, resetToken: string): Promise<boolean> => {
    try {
      const response = await authApi.resetPassword({ password, resetToken });
      ToastAndroid.show(response.message, ToastAndroid.SHORT);
      return !!response.success;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Password reset failed';
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      return false;
    }
  };
  
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const response = await authApi.changePassword({ currentPassword, newPassword });
      ToastAndroid.show(response.message, ToastAndroid.SHORT);
      return !!response.success;
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
    isAuthenticated,
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