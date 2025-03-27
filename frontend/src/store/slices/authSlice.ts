import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import authService, { LoginCredentials, RegisterCredentials } from '../../api/authService';
import { AuthState, User } from '../../types/auth';

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      
      // Store auth data in AsyncStorage
      await AsyncStorage.setItem('token', response.data!.token);
      await AsyncStorage.setItem('refreshToken', response.data!.refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(response.data!.user));
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.register(credentials);
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      
      // Store auth data in AsyncStorage
      await AsyncStorage.setItem('token', response.data!.token);
      await AsyncStorage.setItem('refreshToken', response.data!.refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(response.data!.user));
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      
      // Remove auth data from AsyncStorage
      await AsyncStorage.multiRemove(['token', 'refreshToken', 'user']);
      
      return null;
    } catch (error: any) {
      // Even if the server-side logout fails, we still clear client-side auth
      await AsyncStorage.multiRemove(['token', 'refreshToken', 'user']);
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      // First check if we have a token in AsyncStorage
      const token = await AsyncStorage.getItem('token');
      const userJSON = await AsyncStorage.getItem('user');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      
      if (!token || !userJSON || !refreshToken) {
        return rejectWithValue('No authentication data found');
      }
      
      // Verify the token by getting current user
      const response = await authService.getCurrentUser();
      
      if (!response.success) {
        // Try to refresh token if verification fails
        try {
          const refreshResponse = await authService.refreshToken(refreshToken);
          
          if (refreshResponse.success) {
            // Store new tokens
            await AsyncStorage.setItem('token', refreshResponse.data!.token);
            await AsyncStorage.setItem('refreshToken', refreshResponse.data!.refreshToken);
            
            // If we have user info in refresh response, update it
            if (refreshResponse.data?.user) {
              await AsyncStorage.setItem('user', JSON.stringify(refreshResponse.data.user));
              return refreshResponse.data;
            } else {
              // Use existing user with new tokens
              return {
                user: JSON.parse(userJSON),
                token: refreshResponse.data!.token,
                refreshToken: refreshResponse.data!.refreshToken,
              };
            }
          } else {
            // Clear auth data if token refresh fails
            await AsyncStorage.multiRemove(['token', 'refreshToken', 'user']);
            return rejectWithValue(refreshResponse.message);
          }
        } catch (refreshError: any) {
          // Clear auth data if token refresh fails
          await AsyncStorage.multiRemove(['token', 'refreshToken', 'user']);
          return rejectWithValue(refreshError.message || 'Token refresh failed');
        }
      }
      
      // Update stored user data with latest from server
      if (response.data?.user) {
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        
        return {
          user: response.data.user,
          token,
          refreshToken,
        };
      } else {
        // Fallback to existing user data if not in response
        return {
          user: JSON.parse(userJSON),
          token,
          refreshToken,
        };
      }
    } catch (error: any) {
      // Try to refresh token if verification fails with error
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          await AsyncStorage.multiRemove(['token', 'refreshToken', 'user']);
          return rejectWithValue('No refresh token found');
        }
        
        const refreshResponse = await authService.refreshToken(refreshToken);
        
        if (refreshResponse.success) {
          // Store new tokens
          await AsyncStorage.setItem('token', refreshResponse.data!.token);
          await AsyncStorage.setItem('refreshToken', refreshResponse.data!.refreshToken);
          await AsyncStorage.setItem('user', JSON.stringify(refreshResponse.data!.user));
          
          return refreshResponse.data;
        } else {
          // Clear auth data if token refresh fails
          await AsyncStorage.multiRemove(['token', 'refreshToken', 'user']);
          return rejectWithValue(refreshResponse.message);
        }
      } catch (refreshError: any) {
        // Clear auth data if token refresh fails
        await AsyncStorage.multiRemove(['token', 'refreshToken', 'user']);
        return rejectWithValue(refreshError.message || 'Token verification and refresh failed');
      }
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload as string;
    });
    
    // Register
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload as string;
    });
    
    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.error = null;
    });
    
    // Verify token
    builder.addCase(verifyToken.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(verifyToken.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
    });
    builder.addCase(verifyToken.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.error = action.payload as string;
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer; 