import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthService } from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock user data
const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+91 9876543210'
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // For demo, just return mock user without actual API call
      // const response = await AuthService.login(email, password);
      // return response.data;
      return { user: mockUser, token: 'dummy_token_12345' };
    } catch (error) {
      return rejectWithValue({ 
        message: error.response?.data?.message || 'Login failed. Please check your credentials.' 
      });
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, phone, password }, { rejectWithValue }) => {
    try {
      // For demo, just return mock user without actual API call
      // const response = await AuthService.register(name, email, phone, password);
      // return response.data;
      return { user: { ...mockUser, name, email, phone }, token: 'dummy_token_12345' };
    } catch (error) {
      return rejectWithValue({ 
        message: error.response?.data?.message || 'Registration failed. Please try again.' 
      });
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Remove token from AsyncStorage
      await AsyncStorage.removeItem('token');
      return true;
    } catch (error) {
      return rejectWithValue({ message: 'Logout failed. Please try again.' });
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email }, { rejectWithValue }) => {
    try {
      // For demo, just pretend we sent a reset email
      // const response = await AuthService.forgotPassword(email);
      // return response.data;
      return { success: true, message: 'Reset email sent successfully' };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to send reset email. Please try again.'
      });
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      // For demo, just check if we have a token saved
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      
      // In real app, we would verify token and get user data
      // const response = await AuthService.getCurrentUser();
      // return response.data;
      
      return { user: mockUser };
    } catch (error) {
      return rejectWithValue({ message: 'Session expired. Please login again.' });
    }
  }
);

export const checkOnboardingStatus = createAsyncThunk(
  'auth/checkOnboardingStatus',
  async (_, { rejectWithValue }) => {
    try {
      const hasOnboarded = await AsyncStorage.getItem('HAS_ONBOARDED');
      return { hasOnboarded: hasOnboarded === 'true' };
    } catch (error) {
      return rejectWithValue({ message: 'Failed to check onboarding status' });
    }
  }
);

export const setOnboardingComplete = createAsyncThunk(
  'auth/setOnboardingComplete',
  async (_, { rejectWithValue }) => {
    try {
      await AsyncStorage.setItem('HAS_ONBOARDED', 'true');
      return { success: true };
    } catch (error) {
      return rejectWithValue({ message: 'Failed to set onboarding status' });
    }
  }
);

// For managing addresses
export const getAddresses = createAsyncThunk(
  'auth/getAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const data = await AuthService.getAddresses();
      return data.addresses;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const addAddress = createAsyncThunk(
  'auth/addAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const data = await AuthService.addAddress(addressData);
      return data.address;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateAddress = createAsyncThunk(
  'auth/updateAddress',
  async ({ addressId, addressData }, { rejectWithValue }) => {
    try {
      const data = await AuthService.updateAddress(addressId, addressData);
      return data.address;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'auth/deleteAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      await AuthService.deleteAddress(addressId);
      return addressId;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  'auth/setDefaultAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      const data = await AuthService.setDefaultAddress(addressId);
      return data.address;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const data = await AuthService.updateProfile(profileData);
      return data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const data = await AuthService.getUserProfile();
      return data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  hasOnboarded: false,
  addresses: [],
  loading: false,
  error: null,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAuth: () => initialState,
    setOnboardingState: (state, action) => {
      state.hasOnboarded = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Register cases
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Logout cases
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get current user cases
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      
      // Onboarding status check
      .addCase(checkOnboardingStatus.fulfilled, (state, action) => {
        state.hasOnboarded = action.payload.hasOnboarded;
      })
      
      // Set onboarding complete
      .addCase(setOnboardingComplete.fulfilled, (state) => {
        state.hasOnboarded = true;
      })
      
      // Address management
      .addCase(getAddresses.fulfilled, (state, action) => {
        state.addresses = action.payload;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        const index = state.addresses.findIndex(addr => addr._id === action.payload._id);
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(addr => addr._id !== action.payload);
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.map(addr => ({
          ...addr,
          isDefault: addr._id === action.payload._id
        }));
      })
      
      // Profile management
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

export const { clearError, resetAuth, setOnboardingState } = authSlice.actions;
export default authSlice.reducer; 