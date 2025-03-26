import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../../services';

// Initial state
const initialState = {
  products: [],
  featuredProducts: [],
  product: null,
  isLoading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
  hasMore: true,
};

// Async thunks for product operations
export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const result = await productService.getProducts(params);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getFeaturedProducts = createAsyncThunk(
  'products/getFeaturedProducts',
  async (limit = 10, { rejectWithValue }) => {
    try {
      const result = await productService.getFeaturedProducts(limit);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getProductById = createAsyncThunk(
  'products/getProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const result = await productService.getProductById(productId);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getProductsByCategory = createAsyncThunk(
  'products/getProductsByCategory',
  async ({ categoryId, params = {} }, { rejectWithValue }) => {
    try {
      const result = await productService.getProductsByCategory(categoryId, params);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getProductsByVendor = createAsyncThunk(
  'products/getProductsByVendor',
  async ({ vendorId, params = {} }, { rejectWithValue }) => {
    try {
      const result = await productService.getProductsByVendor(vendorId, params);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async ({ query, params = {} }, { rejectWithValue }) => {
    try {
      const result = await productService.searchProducts(query, params);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Product slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearProduct: (state) => {
      state.product = null;
    },
    clearProducts: (state) => {
      state.products = [];
      state.totalPages = 0;
      state.currentPage = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get products cases
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Handle pagination
        if (action.meta.arg.page > 1) {
          // Append products for pagination
          state.products = [...state.products, ...action.payload.products];
        } else {
          // Replace products for new search/filter
          state.products = action.payload.products;
        }
        
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.hasMore = action.payload.currentPage < action.payload.totalPages;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get products';
      })
      
      // Get featured products cases
      .addCase(getFeaturedProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeaturedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featuredProducts = action.payload.products;
      })
      .addCase(getFeaturedProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get featured products';
      })
      
      // Get product by ID cases
      .addCase(getProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload.product;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get product details';
      })
      
      // Get products by category cases
      .addCase(getProductsByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Handle pagination
        if (action.meta.arg.params?.page > 1) {
          // Append products for pagination
          state.products = [...state.products, ...action.payload.products];
        } else {
          // Replace products for new category
          state.products = action.payload.products;
        }
        
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.hasMore = action.payload.currentPage < action.payload.totalPages;
      })
      .addCase(getProductsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get products by category';
      })
      
      // Get products by vendor cases
      .addCase(getProductsByVendor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductsByVendor.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Handle pagination
        if (action.meta.arg.params?.page > 1) {
          // Append products for pagination
          state.products = [...state.products, ...action.payload.products];
        } else {
          // Replace products for new vendor
          state.products = action.payload.products;
        }
        
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.hasMore = action.payload.currentPage < action.payload.totalPages;
      })
      .addCase(getProductsByVendor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get products by vendor';
      })
      
      // Search products cases
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Handle pagination
        if (action.meta.arg.params?.page > 1) {
          // Append products for pagination
          state.products = [...state.products, ...action.payload.products];
        } else {
          // Replace products for new search
          state.products = action.payload.products;
        }
        
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.hasMore = action.payload.currentPage < action.payload.totalPages;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to search products';
      });
  },
});

// Export actions and reducer
export const { clearError, clearProduct, clearProducts } = productSlice.actions;
export default productSlice.reducer; 