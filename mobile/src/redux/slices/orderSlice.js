import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { OrderService } from '../../api';

// Async thunks
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const data = await OrderService.createOrder(orderData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getMyOrders = createAsyncThunk(
  'orders/getMyOrders',
  async (params, { rejectWithValue }) => {
    try {
      const data = await OrderService.getMyOrders(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getOrderById = createAsyncThunk(
  'orders/getOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await OrderService.getOrderById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async ({ id, cancelData }, { rejectWithValue }) => {
    try {
      const data = await OrderService.cancelOrder(id, cancelData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const trackOrder = createAsyncThunk(
  'orders/trackOrder',
  async (id, { rejectWithValue }) => {
    try {
      const data = await OrderService.trackOrder(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const addOrderFeedback = createAsyncThunk(
  'orders/addOrderFeedback',
  async ({ id, feedbackData }, { rejectWithValue }) => {
    try {
      const data = await OrderService.addOrderFeedback(id, feedbackData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Initial state
const initialState = {
  orders: [],
  currentOrder: null,
  trackingInfo: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false,
  },
};

// Order slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearTrackingInfo: (state) => {
      state.trackingInfo = null;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order cases
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.order;
        state.orders.unshift(action.payload.order);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get my orders cases
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.pagination = {
          page: action.payload.page || 1,
          limit: action.payload.limit || 10,
          total: action.payload.total || 0,
          hasMore: action.payload.hasMore || false,
        };
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get order by ID cases
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.order;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Cancel order cases
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update current order if it matches
        if (state.currentOrder && state.currentOrder._id === action.payload.order._id) {
          state.currentOrder = action.payload.order;
        }
        
        // Update order in orders list
        const index = state.orders.findIndex(order => order._id === action.payload.order._id);
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Track order cases
      .addCase(trackOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(trackOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.trackingInfo = action.payload.trackingInfo;
      })
      .addCase(trackOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add order feedback cases
      .addCase(addOrderFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOrderFeedback.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update current order if it matches
        if (state.currentOrder && state.currentOrder._id === action.payload.order._id) {
          state.currentOrder = action.payload.order;
        }
        
        // Update order in orders list
        const index = state.orders.findIndex(order => order._id === action.payload.order._id);
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
      })
      .addCase(addOrderFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearCurrentOrder, clearTrackingInfo, setPage } = orderSlice.actions;
export default orderSlice.reducer; 