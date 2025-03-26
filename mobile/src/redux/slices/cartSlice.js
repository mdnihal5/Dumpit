import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartService } from '../../api';

// Mock data
const mockCartItems = [
  {
    product: {
      id: '1',
      name: 'Portland Cement',
      price: 350,
      image: 'https://via.placeholder.com/300',
      vendor: { name: 'Cement Depot' },
      unit: 'bag'
    },
    quantity: 5,
    totalPrice: 1750
  },
  {
    product: {
      id: '2',
      name: 'Red Clay Bricks',
      price: 8,
      image: 'https://via.placeholder.com/300',
      vendor: { name: 'Brick Factory' },
      unit: 'piece'
    },
    quantity: 100,
    totalPrice: 800
  }
];

// Initial state
const initialState = {
  items: [],
  subtotal: 0,
  totalItems: 0,
  vendor: null,
  loading: false,
  error: null,
  couponApplied: null,
  discount: 0,
  shipping: 0,
  tax: 0,
  total: 0
};

// Helper functions
const calculateTotals = (items) => {
  return items.reduce(
    (acc, item) => {
      const itemTotal = item.quantity * item.pricePerUnit;
      const itemTax = itemTotal * (item.taxPercentage / 100);
      
      acc.subtotal += itemTotal;
      acc.tax += itemTax;
      acc.total = acc.subtotal + acc.tax;
      
      return acc;
    },
    { subtotal: 0, tax: 0, total: 0 }
  );
};

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      // Try to get cart from API
      const data = await CartService.getCart();
      return data;
    } catch (error) {
      // If API fails, try to get from local storage (offline mode)
      try {
        const offlineCart = await CartService.getOfflineCart();
        if (offlineCart) {
          return offlineCart;
        }
        
        // If no offline cart, return mock data for development
        const items = [...mockCartItems];
        const subtotal = items.reduce((total, item) => total + item.totalPrice, 0);
        const totalItems = items.reduce((total, item) => total + item.quantity, 0);
        
        return { items, subtotal, totalItems };
      } catch (localError) {
        return rejectWithValue(localError.message);
      }
    }
  }
);

export const addToCartThunk = createAsyncThunk(
  'cart/addToCartThunk',
  async ({ productId, quantity = 1 }, { rejectWithValue, getState }) => {
    try {
      // Try to add to cart via API
      const data = await CartService.addToCart(productId, quantity);
      return data;
    } catch (error) {
      // If API fails, update local cart (offline mode)
      try {
        // Get current cart items from state
        const { items } = getState().cart;
        
        // Simulate adding to cart with mock data
        const mockProduct = {
          id: productId,
          name: 'New Product',
          price: 100,
          image: 'https://via.placeholder.com/300',
          vendor: { name: 'Vendor' },
          unit: 'unit'
        };
        
        const newItem = {
          product: mockProduct,
          quantity,
          totalPrice: mockProduct.price * quantity
        };
        
        // Check if product already exists in cart
        const existingItemIndex = items.findIndex(item => item.product.id === productId);
        let updatedItems;
        
        if (existingItemIndex !== -1) {
          // Update existing item
          updatedItems = items.map((item, index) => {
            if (index === existingItemIndex) {
              return {
                ...item,
                quantity: item.quantity + quantity,
                totalPrice: (item.quantity + quantity) * item.product.price
              };
            }
            return item;
          });
        } else {
          // Add new item
          updatedItems = [...items, newItem];
        }
        
        // Calculate subtotal and totalItems
        const subtotal = updatedItems.reduce((total, item) => total + item.totalPrice, 0);
        const totalItems = updatedItems.reduce((total, item) => total + item.quantity, 0);
        
        const offlineCart = { items: updatedItems, subtotal, totalItems };
        
        // Save to local storage
        await CartService.saveOfflineCart(offlineCart);
        
        return offlineCart;
      } catch (localError) {
        return rejectWithValue(localError.message);
      }
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }, { rejectWithValue, getState }) => {
    try {
      // Try to update cart via API
      const data = await CartService.updateCartItem(productId, quantity);
      return data;
    } catch (error) {
      // If API fails, update local cart (offline mode)
      try {
        // Get current cart items from state
        const { items } = getState().cart;
        
        // Update quantity of existing item
        const updatedItems = items.map(item => {
          if (item.product.id === productId) {
            return {
              ...item,
              quantity,
              totalPrice: quantity * item.product.price
            };
          }
          return item;
        });
        
        // Calculate subtotal and totalItems
        const subtotal = updatedItems.reduce((total, item) => total + item.totalPrice, 0);
        const totalItems = updatedItems.reduce((total, item) => total + item.quantity, 0);
        
        const offlineCart = { items: updatedItems, subtotal, totalItems };
        
        // Save to local storage
        await CartService.saveOfflineCart(offlineCart);
        
        return offlineCart;
      } catch (localError) {
        return rejectWithValue(localError.message);
      }
    }
  }
);

export const removeFromCartThunk = createAsyncThunk(
  'cart/removeFromCartThunk',
  async ({ productId }, { rejectWithValue, getState }) => {
    try {
      // Try to remove from cart via API
      const data = await CartService.removeFromCart(productId);
      return data;
    } catch (error) {
      // If API fails, update local cart (offline mode)
      try {
        // Get current cart items from state
        const { items } = getState().cart;
        
        // Remove item from cart
        const updatedItems = items.filter(item => item.product.id !== productId);
        
        // Calculate subtotal and totalItems
        const subtotal = updatedItems.reduce((total, item) => total + item.totalPrice, 0);
        const totalItems = updatedItems.reduce((total, item) => total + item.quantity, 0);
        
        const offlineCart = { items: updatedItems, subtotal, totalItems };
        
        // Save to local storage
        await CartService.saveOfflineCart(offlineCart);
        
        return offlineCart;
      } catch (localError) {
        return rejectWithValue(localError.message);
      }
    }
  }
);

export const clearCartThunk = createAsyncThunk(
  'cart/clearCartThunk',
  async (_, { rejectWithValue }) => {
    try {
      // Try to clear cart via API
      const data = await CartService.clearCart();
      return data;
    } catch (error) {
      // If API fails, clear local cart (offline mode)
      try {
        // Clear from local storage
        await AsyncStorage.removeItem('offline_cart');
        
        return true;
      } catch (localError) {
        return rejectWithValue(localError.message);
      }
    }
  }
);

export const applyCouponThunk = createAsyncThunk(
  'cart/applyCoupon',
  async (code, { rejectWithValue }) => {
    try {
      const data = await CartService.applyCoupon(code);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeCouponThunk = createAsyncThunk(
  'cart/removeCoupon',
  async (_, { rejectWithValue }) => {
    try {
      const data = await CartService.removeCoupon();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const calculateShippingThunk = createAsyncThunk(
  'cart/calculateShipping',
  async (address, { rejectWithValue }) => {
    try {
      const data = await CartService.calculateShipping(address);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const syncOfflineCartThunk = createAsyncThunk(
  'cart/syncOfflineCart',
  async (_, { rejectWithValue }) => {
    try {
      const data = await CartService.syncOfflineCart();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    
    // Add item to cart
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      
      // If cart is empty, set the vendor
      if (state.items.length === 0 && !state.vendor) {
        state.vendor = {
          id: product.vendor._id || product.vendor,
          name: product.vendor.businessName || 'Vendor',
          image: product.vendor.logo || null,
        };
      }
      
      // Check if vendor matches
      if (state.vendor && (state.vendor.id !== (product.vendor._id || product.vendor))) {
        state.error = 'Items from different vendors cannot be added to the same cart. Please clear your cart first.';
        return;
      }
      
      // Check if product already exists in cart
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === product._id
      );
      
      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        state.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item if it doesn't exist
        state.items.push({
          id: product._id,
          name: product.name,
          image: product.images && product.images.length > 0 ? product.images[0].url : null,
          description: product.description,
          pricePerUnit: product.pricePerUnit,
          taxPercentage: product.taxPercentage || 0,
          quantity,
          unit: product.baseUnit,
          vendor: product.vendor._id || product.vendor,
          minOrderQuantity: product.minOrderQuantity || 1,
        });
      }
      
      // Persist cart to AsyncStorage
      AsyncStorage.setItem('cart', JSON.stringify({
        items: state.items,
        vendor: state.vendor
      }));
    },
    
    // Update item quantity
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      
      const itemIndex = state.items.findIndex(item => item.id === id);
      if (itemIndex !== -1) {
        // Don't allow quantity below minimum order quantity
        const minQty = state.items[itemIndex].minOrderQuantity || 1;
        state.items[itemIndex].quantity = Math.max(minQty, quantity);
        
        // Persist cart to AsyncStorage
        AsyncStorage.setItem('cart', JSON.stringify({
          items: state.items,
          vendor: state.vendor
        }));
      }
    },
    
    // Remove item from cart
    removeFromCart: (state, action) => {
      const id = action.payload;
      
      state.items = state.items.filter(item => item.id !== id);
      
      // If cart is empty, clear vendor
      if (state.items.length === 0) {
        state.vendor = null;
      }
      
      // Persist cart to AsyncStorage
      AsyncStorage.setItem('cart', JSON.stringify({
        items: state.items,
        vendor: state.vendor
      }));
    },
    
    // Clear entire cart
    clearCart: (state) => {
      state.items = [];
      state.vendor = null;
      
      // Clear cart in AsyncStorage
      AsyncStorage.removeItem('cart');
    },
    
    // Load cart from AsyncStorage
    setCart: (state, action) => {
      const { items, vendor } = action.payload;
      state.items = items || [];
      state.vendor = vendor || null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.subtotal = action.payload.subtotal;
        state.totalItems = action.payload.totalItems;
        state.tax = action.payload.tax || 0;
        state.shipping = action.payload.shipping || 0;
        state.discount = action.payload.discount || 0;
        state.couponApplied = action.payload.couponApplied || null;
        state.total = action.payload.total || action.payload.subtotal;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // addToCartThunk
      .addCase(addToCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.subtotal = action.payload.subtotal;
        state.totalItems = action.payload.totalItems;
        state.tax = action.payload.tax || 0;
        state.shipping = action.payload.shipping || 0;
        state.discount = action.payload.discount || 0;
        state.couponApplied = action.payload.couponApplied || null;
        state.total = action.payload.total || action.payload.subtotal;
      })
      .addCase(addToCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // updateCartItem
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.subtotal = action.payload.subtotal;
        state.totalItems = action.payload.totalItems;
        state.tax = action.payload.tax || 0;
        state.shipping = action.payload.shipping || 0;
        state.discount = action.payload.discount || 0;
        state.couponApplied = action.payload.couponApplied || null;
        state.total = action.payload.total || action.payload.subtotal;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // removeFromCartThunk
      .addCase(removeFromCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.subtotal = action.payload.subtotal;
        state.totalItems = action.payload.totalItems;
        state.tax = action.payload.tax || 0;
        state.shipping = action.payload.shipping || 0;
        state.discount = action.payload.discount || 0;
        state.couponApplied = action.payload.couponApplied || null;
        state.total = action.payload.total || action.payload.subtotal;
      })
      .addCase(removeFromCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // clearCartThunk
      .addCase(clearCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartThunk.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.subtotal = 0;
        state.totalItems = 0;
        state.tax = 0;
        state.shipping = 0;
        state.discount = 0;
        state.couponApplied = null;
        state.total = 0;
      })
      .addCase(clearCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // applyCouponThunk
      .addCase(applyCouponThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyCouponThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.subtotal = action.payload.subtotal;
        state.totalItems = action.payload.totalItems;
        state.tax = action.payload.tax || 0;
        state.shipping = action.payload.shipping || 0;
        state.discount = action.payload.discount || 0;
        state.couponApplied = action.payload.couponApplied || null;
        state.total = action.payload.total || action.payload.subtotal;
      })
      .addCase(applyCouponThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // removeCouponThunk
      .addCase(removeCouponThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCouponThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.subtotal = action.payload.subtotal;
        state.totalItems = action.payload.totalItems;
        state.tax = action.payload.tax || 0;
        state.shipping = action.payload.shipping || 0;
        state.discount = 0;
        state.couponApplied = null;
        state.total = action.payload.total || action.payload.subtotal;
      })
      .addCase(removeCouponThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // calculateShippingThunk
      .addCase(calculateShippingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateShippingThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.shipping = action.payload.shipping;
        state.total = state.subtotal + state.tax + state.shipping - state.discount;
      })
      .addCase(calculateShippingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // syncOfflineCartThunk
      .addCase(syncOfflineCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncOfflineCartThunk.fulfilled, (state, action) => {
        if (action.payload) {
          state.loading = false;
          state.items = action.payload.items;
          state.subtotal = action.payload.subtotal;
          state.totalItems = action.payload.totalItems;
          state.tax = action.payload.tax || 0;
          state.shipping = action.payload.shipping || 0;
          state.discount = action.payload.discount || 0;
          state.couponApplied = action.payload.couponApplied || null;
          state.total = action.payload.total || action.payload.subtotal;
        } else {
          state.loading = false;
        }
      })
      .addCase(syncOfflineCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Action creators
export const { 
  setLoading, 
  setError, 
  clearError, 
  addToCart, 
  updateQuantity, 
  removeFromCart, 
  clearCart, 
  setCart 
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartVendor = (state) => state.cart.vendor;
export const selectCartSubtotal = (state) => state.cart.subtotal;
export const selectCartTax = (state) => state.cart.tax;
export const selectCartShipping = (state) => state.cart.shipping;
export const selectCartDiscount = (state) => state.cart.discount;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartItemCount = (state) => state.cart.totalItems;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectCouponApplied = (state) => state.cart.couponApplied;

export default cartSlice.reducer; 