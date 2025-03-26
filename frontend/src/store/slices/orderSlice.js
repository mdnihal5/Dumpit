import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from '../../services';

// Initial state
const initialState = {
  orders: [],
  order: null,
  isLoading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
  hasMore: true,
};

// Async thunks for order operations
export const getOrders = createAsyncThunk(
  'orders/getOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const result = await orderService.getOrders(params);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getOrderById = createAsyncThunk(
  'orders/getOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const result = await orderService.getOrderById(orderId);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const result = await orderService.createOrder(orderData);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const result = await orderService.cancelOrder(orderId);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const trackOrder = createAsyncThunk(
  'orders/trackOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const result = await orderService.trackOrder(orderId);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const rateOrder = createAsyncThunk(
  'orders/rateOrder',
  async ({ orderId, rating, review }, { rejectWithValue }) => {
    try {
      const result = await orderService.rateOrder(orderId, rating, review);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Order slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearOrder: (state) => {
      state.order = null;
    },
    clearOrders: (state) => {
      state.orders = [];
      state.totalPages = 0;
      state.currentPage = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get orders cases
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Handle pagination
        if (action.meta.arg.page > 1) {
          // Append orders for pagination
          state.orders = [...state.orders, ...action.payload.orders];
        } else {
          // Replace orders for new search/filter
          state.orders = action.payload.orders;
        }
        
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.hasMore = action.payload.currentPage < action.payload.totalPages;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get orders';
      })
      
      // Get order by ID cases
      .addCase(getOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload.order;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get order details';
      })
      
      // Create order cases
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload.order;
        state.orders = [action.payload.order, ...state.orders];
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create order';
      })
      
      // Cancel order cases
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Update the order in the orders list
        state.orders = state.orders.map(order => 
          order.id === action.payload.order.id 
            ? action.payload.order 
            : order
        );
        
        // Update current order if it's the one being canceled
        if (state.order && state.order.id === action.payload.order.id) {
          state.order = action.payload.order;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to cancel order';
      })
      
      // Track order cases
      .addCase(trackOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(trackOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Update tracking info in current order
        if (state.order && state.order.id === action.meta.arg) {
          state.order = {
            ...state.order,
            tracking: action.payload.tracking
          };
        }
      })
      .addCase(trackOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to track order';
      })
      
      // Rate order cases
      .addCase(rateOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(rateOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Update order with rating
        if (state.order && state.order.id === action.meta.arg.orderId) {
          state.order = {
            ...state.order,
            rating: action.payload.rating,
            review: action.payload.review
          };
        }
        
        // Update in orders list
        state.orders = state.orders.map(order => 
          order.id === action.meta.arg.orderId
            ? {
                ...order,
                rating: action.payload.rating,
                review: action.payload.review
              }
            : order
        );
      })
      .addCase(rateOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to rate order';
      });
  },
});

// Export actions and reducer
export const { clearError, clearOrder, clearOrders } = orderSlice.actions;
export default orderSlice.reducer; 