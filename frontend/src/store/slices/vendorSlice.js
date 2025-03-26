import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { vendorService } from '../../services';

// Initial state
const initialState = {
  vendors: [],
  featuredVendors: [],
  vendor: null,
  reviews: [],
  isLoading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
  hasMore: true,
};

// Async thunks for vendor operations
export const getVendors = createAsyncThunk(
  'vendors/getVendors',
  async (params = {}, { rejectWithValue }) => {
    try {
      const result = await vendorService.getVendors(params);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getFeaturedVendors = createAsyncThunk(
  'vendors/getFeaturedVendors',
  async (limit = 10, { rejectWithValue }) => {
    try {
      const result = await vendorService.getFeaturedVendors(limit);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getVendorById = createAsyncThunk(
  'vendors/getVendorById',
  async (vendorId, { rejectWithValue }) => {
    try {
      const result = await vendorService.getVendorById(vendorId);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getVendorsByCategory = createAsyncThunk(
  'vendors/getVendorsByCategory',
  async ({ categoryId, params = {} }, { rejectWithValue }) => {
    try {
      const result = await vendorService.getVendorsByCategory(categoryId, params);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getVendorReviews = createAsyncThunk(
  'vendors/getVendorReviews',
  async ({ vendorId, params = {} }, { rejectWithValue }) => {
    try {
      const result = await vendorService.getVendorReviews(vendorId, params);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const searchVendors = createAsyncThunk(
  'vendors/searchVendors',
  async ({ query, params = {} }, { rejectWithValue }) => {
    try {
      const result = await vendorService.searchVendors(query, params);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Vendor slice
const vendorSlice = createSlice({
  name: 'vendors',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearVendor: (state) => {
      state.vendor = null;
    },
    clearVendors: (state) => {
      state.vendors = [];
      state.totalPages = 0;
      state.currentPage = 1;
      state.hasMore = true;
    },
    clearReviews: (state) => {
      state.reviews = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get vendors cases
      .addCase(getVendors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getVendors.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Handle pagination
        if (action.meta.arg.page > 1) {
          // Append vendors for pagination
          state.vendors = [...state.vendors, ...action.payload.vendors];
        } else {
          // Replace vendors for new search/filter
          state.vendors = action.payload.vendors;
        }
        
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.hasMore = action.payload.currentPage < action.payload.totalPages;
      })
      .addCase(getVendors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get vendors';
      })
      
      // Get featured vendors cases
      .addCase(getFeaturedVendors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeaturedVendors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featuredVendors = action.payload.vendors;
      })
      .addCase(getFeaturedVendors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get featured vendors';
      })
      
      // Get vendor by ID cases
      .addCase(getVendorById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getVendorById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendor = action.payload.vendor;
      })
      .addCase(getVendorById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get vendor details';
      })
      
      // Get vendors by category cases
      .addCase(getVendorsByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getVendorsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Handle pagination
        if (action.meta.arg.params?.page > 1) {
          // Append vendors for pagination
          state.vendors = [...state.vendors, ...action.payload.vendors];
        } else {
          // Replace vendors for new category
          state.vendors = action.payload.vendors;
        }
        
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.hasMore = action.payload.currentPage < action.payload.totalPages;
      })
      .addCase(getVendorsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get vendors by category';
      })
      
      // Get vendor reviews cases
      .addCase(getVendorReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getVendorReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.reviews;
      })
      .addCase(getVendorReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get vendor reviews';
      })
      
      // Search vendors cases
      .addCase(searchVendors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchVendors.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Handle pagination
        if (action.meta.arg.params?.page > 1) {
          // Append vendors for pagination
          state.vendors = [...state.vendors, ...action.payload.vendors];
        } else {
          // Replace vendors for new search
          state.vendors = action.payload.vendors;
        }
        
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.hasMore = action.payload.currentPage < action.payload.totalPages;
      })
      .addCase(searchVendors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to search vendors';
      });
  },
});

// Export actions and reducer
export const { clearError, clearVendor, clearVendors, clearReviews } = vendorSlice.actions;
export default vendorSlice.reducer; 