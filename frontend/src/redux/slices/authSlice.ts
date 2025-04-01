import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../types/user';

// Define the state interface
interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
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

// Async thunks for API calls
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.login({ email, password });
      
      if (response.success) {
        const { user, token, refreshToken } = response.data;
        
        // Save tokens and user data in AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(user));
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('refreshToken', refreshToken);
        console.log(user);
        return { user, token, refreshToken };
      } else {
        return rejectWithValue(response.message || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    { name, email, phone, password }: { name: string; email: string; phone: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authApi.register({ name, email, phone, password });
      
      if (response.success) {
        const { user, token, refreshToken } = response.data;
        
        // Save tokens and user data in AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(user));
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('refreshToken', refreshToken);
        
        return { user, token, refreshToken };
      } else {
        return rejectWithValue(response.message || 'Registration failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      
      // Clear storage regardless of API success
      await AsyncStorage.multiRemove(['user', 'token', 'refreshToken']);
      
      return true;
    } catch (error: any) {
      console.error('Logout error:', error);
      
      // Still clear storage even if API fails
      await AsyncStorage.multiRemove(['user', 'token', 'refreshToken']);
      
      return true; // Return success anyway since we've cleared local storage
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getCurrentUser();
      
      if (response.success) {
        const { user } = response.data;
        
        // Update stored user data
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        return { user };
      } else {
        return rejectWithValue(response.message || 'Failed to fetch user');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch user';
      return rejectWithValue(errorMessage);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.forgotPassword({ email });
      return { success: response.success, message: response.message };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to process request';
      return rejectWithValue(errorMessage);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ password, resetToken }: { password: string; resetToken: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.resetPassword({ password, resetToken });
      return { success: response.success, message: response.message };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Password reset failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.changePassword({ currentPassword, newPassword });
      return { success: response.success, message: response.message };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to change password';
      return rejectWithValue(errorMessage);
    }
  }
);

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string; refreshToken: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Logout
    builder.addCase(logoutUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isLoading = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    });
    builder.addCase(logoutUser.rejected, (state) => {
      state.isLoading = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    });

    // Fetch current user
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
    });
    builder.addCase(fetchCurrentUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      // If we can't fetch the user, we're not authenticated
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
    });
  },
});

// Export actions
export const { resetAuthState, setCredentials, clearCredentials } = authSlice.actions;

// Export the reducer
export default authSlice.reducer; 