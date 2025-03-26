import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../services';

// Initial state
const initialState = {
  profile: null,
  addresses: [],
  paymentMethods: [],
  notifications: [],
  preferences: null,
  isLoading: false,
  error: null,
};

// Async thunks for user operations
export const getUserProfile = createAsyncThunk(
  'user/getUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const result = await userService.getUserProfile();
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const result = await userService.updateUserProfile(profileData);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAddresses = createAsyncThunk(
  'user/getAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const result = await userService.getAddresses();
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addAddress = createAsyncThunk(
  'user/addAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const result = await userService.addAddress(addressData);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateAddress = createAsyncThunk(
  'user/updateAddress',
  async ({ addressId, addressData }, { rejectWithValue }) => {
    try {
      const result = await userService.updateAddress(addressId, addressData);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'user/deleteAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      const result = await userService.deleteAddress(addressId);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getPaymentMethods = createAsyncThunk(
  'user/getPaymentMethods',
  async (_, { rejectWithValue }) => {
    try {
      const result = await userService.getPaymentMethods();
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addPaymentMethod = createAsyncThunk(
  'user/addPaymentMethod',
  async (paymentData, { rejectWithValue }) => {
    try {
      const result = await userService.addPaymentMethod(paymentData);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updatePaymentMethod = createAsyncThunk(
  'user/updatePaymentMethod',
  async ({ paymentId, paymentData }, { rejectWithValue }) => {
    try {
      const result = await userService.updatePaymentMethod(paymentId, paymentData);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deletePaymentMethod = createAsyncThunk(
  'user/deletePaymentMethod',
  async (paymentId, { rejectWithValue }) => {
    try {
      const result = await userService.deletePaymentMethod(paymentId);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getNotifications = createAsyncThunk(
  'user/getNotifications',
  async (params = {}, { rejectWithValue }) => {
    try {
      const result = await userService.getNotifications(params);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'user/markNotificationAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const result = await userService.markNotificationAsRead(notificationId);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const clearAllNotifications = createAsyncThunk(
  'user/clearAllNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const result = await userService.clearAllNotifications();
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getUserPreferences = createAsyncThunk(
  'user/getUserPreferences',
  async (_, { rejectWithValue }) => {
    try {
      const result = await userService.getUserPreferences();
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUserPreferences = createAsyncThunk(
  'user/updateUserPreferences',
  async (preferencesData, { rejectWithValue }) => {
    try {
      const result = await userService.updateUserPreferences(preferencesData);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUserData: (state) => {
      state.profile = null;
      state.addresses = [];
      state.paymentMethods = [];
      state.notifications = [];
      state.preferences = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get user profile cases
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.profile;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get user profile';
      })
      
      // Update user profile cases
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.profile;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update user profile';
      })
      
      // Get addresses cases
      .addCase(getAddresses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = action.payload.addresses;
      })
      .addCase(getAddresses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get addresses';
      })
      
      // Add address cases
      .addCase(addAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = [...state.addresses, action.payload.address];
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to add address';
      })
      
      // Update address cases
      .addCase(updateAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = state.addresses.map(address => 
          address.id === action.payload.address.id 
            ? action.payload.address 
            : address
        );
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update address';
      })
      
      // Delete address cases
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = state.addresses.filter(
          address => address.id !== action.meta.arg
        );
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete address';
      })
      
      // Get payment methods cases
      .addCase(getPaymentMethods.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPaymentMethods.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paymentMethods = action.payload.paymentMethods;
      })
      .addCase(getPaymentMethods.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get payment methods';
      })
      
      // Add payment method cases
      .addCase(addPaymentMethod.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addPaymentMethod.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paymentMethods = [...state.paymentMethods, action.payload.paymentMethod];
      })
      .addCase(addPaymentMethod.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to add payment method';
      })
      
      // Update payment method cases
      .addCase(updatePaymentMethod.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePaymentMethod.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paymentMethods = state.paymentMethods.map(method => 
          method.id === action.payload.paymentMethod.id 
            ? action.payload.paymentMethod 
            : method
        );
      })
      .addCase(updatePaymentMethod.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update payment method';
      })
      
      // Delete payment method cases
      .addCase(deletePaymentMethod.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePaymentMethod.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paymentMethods = state.paymentMethods.filter(
          method => method.id !== action.meta.arg
        );
      })
      .addCase(deletePaymentMethod.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete payment method';
      })
      
      // Get notifications cases
      .addCase(getNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload.notifications;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get notifications';
      })
      
      // Mark notification as read cases
      .addCase(markNotificationAsRead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = state.notifications.map(notification => 
          notification.id === action.meta.arg
            ? { ...notification, read: true }
            : notification
        );
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to mark notification as read';
      })
      
      // Clear all notifications cases
      .addCase(clearAllNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearAllNotifications.fulfilled, (state) => {
        state.isLoading = false;
        state.notifications = [];
      })
      .addCase(clearAllNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to clear notifications';
      })
      
      // Get user preferences cases
      .addCase(getUserPreferences.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserPreferences.fulfilled, (state, action) => {
        state.isLoading = false;
        state.preferences = action.payload.preferences;
      })
      .addCase(getUserPreferences.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get user preferences';
      })
      
      // Update user preferences cases
      .addCase(updateUserPreferences.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.isLoading = false;
        state.preferences = action.payload.preferences;
      })
      .addCase(updateUserPreferences.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update user preferences';
      });
  },
});

// Export actions and reducer
export const { clearError, clearUserData } = userSlice.actions;
export default userSlice.reducer; 