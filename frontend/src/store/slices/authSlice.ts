import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../../services/api';
import { AuthState, User } from '../../types/auth';

// Type for login credentials
interface LoginCredentials {
  email: string;
  password: string;
}

// Type for register credentials
interface RegisterCredentials {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: 'customer' | 'vendor' | 'admin';
}

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
      console.log('Redux login with:', { ...credentials, password: '******' });
      const response = await authService.login(credentials);
      
      if (response.data && response.data.success) {
        // Store auth data in AsyncStorage
        await AsyncStorage.setItem('token', response.data.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        return {
          user: response.data.data.user,
          token: response.data.data.token,
        };
      }
      return rejectWithValue(response.data.message || 'Login failed');
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
      
      if (response.data && response.data.success) {
        // Store auth data in AsyncStorage
        await AsyncStorage.setItem('token', response.data.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        return {
          user: response.data.data.user,
          token: response.data.data.token,
        };
      }
      return rejectWithValue(response.data.message || 'Registration failed');
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
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      
      return null;
    } catch (error: any) {
      // Even if the server-side logout fails, we still clear client-side auth
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
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
      
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      
      // Verify the token by getting current user
      const response = await authService.getCurrentUser();
      
      if (response.data && response.data.success && response.data.data) {
        const userData = response.data.data.user || response.data.data;
        // Update stored user data with latest from server
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        
        return {
          user: userData,
          token,
        };
      } else {
        // Clear auth data if token verification fails
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        return rejectWithValue('Invalid or expired token');
      }
    } catch (error: any) {
      console.error('Token verification error:', error);
      // Clear auth data if verification fails
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      
      if (error.response) {
        return rejectWithValue(error.response.data?.message || 'Token verification failed');
      }
      return rejectWithValue(error.message || 'Token verification failed');
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
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // Update AsyncStorage with the updated user
        AsyncStorage.setItem('user', JSON.stringify(state.user));
      }
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
      state.refreshToken = null;
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
      state.refreshToken = null;
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
      state.refreshToken = null;
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

export const { clearError, updateUserProfile } = authSlice.actions;
export default authSlice.reducer; 