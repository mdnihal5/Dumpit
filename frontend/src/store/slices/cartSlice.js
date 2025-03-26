import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../../services';

// Initial state
const initialState = {
  items: [],
  isLoading: false,
  error: null,
  total: 0,
  itemCount: 0,
};

// Async thunks for cart operations
export const getCartItems = createAsyncThunk(
  'cart/getItems',
  async (_, { rejectWithValue }) => {
    try {
      const items = await cartService.getCartItems();
      return items;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addItem',
  async ({ product, quantity = 1, vendorId = null }, { rejectWithValue }) => {
    try {
      const updatedCart = await cartService.addToCart(product, quantity, vendorId);
      return updatedCart;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateItemQuantity',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const updatedCart = await cartService.updateCartItemQuantity(productId, quantity);
      return updatedCart;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeItem',
  async (productId, { rejectWithValue }) => {
    try {
      const updatedCart = await cartService.removeFromCart(productId);
      return updatedCart;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartService.clearCart();
      return [];
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Helpers to calculate cart totals
const calculateTotal = (items) => {
  return items.reduce((total, item) => {
    const price = item.product.discountPrice || item.product.price;
    return total + (price * item.quantity);
  }, 0);
};

const calculateItemCount = (items) => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get cart items cases
      .addCase(getCartItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.total = calculateTotal(action.payload);
        state.itemCount = calculateItemCount(action.payload);
      })
      .addCase(getCartItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get cart items';
      })
      
      // Add to cart cases
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.total = calculateTotal(action.payload);
        state.itemCount = calculateItemCount(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to add item to cart';
      })
      
      // Update cart item quantity cases
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.total = calculateTotal(action.payload);
        state.itemCount = calculateItemCount(action.payload);
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update cart item quantity';
      })
      
      // Remove from cart cases
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.total = calculateTotal(action.payload);
        state.itemCount = calculateItemCount(action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to remove item from cart';
      })
      
      // Clear cart cases
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false;
        state.items = [];
        state.total = 0;
        state.itemCount = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to clear cart';
      });
  },
});

// Export actions and reducer
export const { clearError } = cartSlice.actions;
export default cartSlice.reducer; 