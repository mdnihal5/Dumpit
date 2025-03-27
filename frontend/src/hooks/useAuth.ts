import { useCallback } from 'react';
import { ToastAndroid, Platform, Alert } from 'react-native';
import authService, { LoginCredentials, RegisterCredentials } from '../api/authService';
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

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { 
    user, 
    token, 
    refreshToken, 
    isLoading, 
    isAuthenticated, 
    error 
  } = useAppSelector(state => state.auth);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const resultAction = await dispatch(loginAction(credentials));
      if (loginAction.fulfilled.match(resultAction)) {
        return { success: true };
      } else {
        const errorMsg = resultAction.payload as string;
        showFeedback(errorMsg, true);
        return { 
          success: false, 
          error: errorMsg
        };
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Login failed';
      showFeedback(errorMsg, true);
      return { 
        success: false, 
        error: errorMsg
      };
    }
  }, [dispatch]);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      const resultAction = await dispatch(registerAction(credentials));
      if (registerAction.fulfilled.match(resultAction)) {
        showFeedback('Registration successful!');
        return { success: true };
      } else {
        const errorMsg = resultAction.payload as string;
        showFeedback(errorMsg, true);
        return { 
          success: false, 
          error: errorMsg
        };
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Registration failed';
      showFeedback(errorMsg, true);
      return { 
        success: false, 
        error: errorMsg
      };
    }
  }, [dispatch]);

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutAction());
      showFeedback('Successfully logged out');
      return { success: true };
    } catch (error: any) {
      const errorMsg = error.message || 'Logout failed';
      showFeedback(errorMsg, true);
      return { 
        success: false, 
        error: errorMsg
      };
    }
  }, [dispatch]);

  const verifyToken = useCallback(async () => {
    try {
      const resultAction = await dispatch(verifyTokenAction());
      return verifyTokenAction.fulfilled.match(resultAction);
    } catch (error: any) {
      console.error('Token verification error:', error);
      return false;
    }
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearErrorAction());
  }, [dispatch]);

  // Forgot password function
  const forgotPassword = useCallback(async (email: string): Promise<boolean> => {
    try {
      const response = await authService.forgotPassword(email);
      showFeedback(response.message);
      return response.success;
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to process request';
      showFeedback(errorMsg, true);
      return false;
    }
  }, []);

  // Reset password function
  const resetPassword = useCallback(async (resetToken: string, newPassword: string): Promise<boolean> => {
    try {
      const response = await authService.resetPassword(resetToken, newPassword);
      showFeedback(response.message);
      return response.success;
    } catch (error: any) {
      const errorMsg = error.message || 'Password reset failed';
      showFeedback(errorMsg, true);
      return false;
    }
  }, []);

  // Change password function
  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const response = await authService.changePassword(currentPassword, newPassword);
      showFeedback(response.message);
      return response.success;
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to change password';
      showFeedback(errorMsg, true);
      return false;
    }
  }, []);

  return {
    user,
    token,
    refreshToken,
    isLoading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    verifyToken,
    clearError,
    forgotPassword,
    resetPassword,
    changePassword
  };
};

export default useAuth; 