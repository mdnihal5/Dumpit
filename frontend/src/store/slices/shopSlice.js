import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  shops: [],
  featuredShops: [],
  selectedShop: null,
  loading: false,
  error: null,
  filters: {
    category: null,
    rating: null,
    sortBy: 'popular',
  },
  searchQuery: '',
};

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    setShops: (state, action) => {
      state.shops = action.payload;
    },
    setFeaturedShops: (state, action) => {
      state.featuredShops = action.payload;
    },
    setSelectedShop: (state, action) => {
      state.selectedShop = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateShopRating: (state, action) => {
      const { shopId, rating } = action.payload;
      const shop = state.shops.find(s => s.id === shopId);
      if (shop) {
        shop.rating = rating;
      }
      if (state.selectedShop?.id === shopId) {
        state.selectedShop.rating = rating;
      }
    },
    addShopReview: (state, action) => {
      const { shopId, review } = action.payload;
      const shop = state.shops.find(s => s.id === shopId);
      if (shop) {
        shop.reviews.push(review);
        shop.rating = shop.reviews.reduce((acc, rev) => acc + rev.rating, 0) / shop.reviews.length;
      }
      if (state.selectedShop?.id === shopId) {
        state.selectedShop.reviews.push(review);
        state.selectedShop.rating = state.selectedShop.reviews.reduce((acc, rev) => acc + rev.rating, 0) / state.selectedShop.reviews.length;
      }
    },
    updateShopStatus: (state, action) => {
      const { shopId, status } = action.payload;
      const shop = state.shops.find(s => s.id === shopId);
      if (shop) {
        shop.status = status;
      }
      if (state.selectedShop?.id === shopId) {
        state.selectedShop.status = status;
      }
    },
  },
});

export const {
  setShops,
  setFeaturedShops,
  setSelectedShop,
  setFilters,
  clearFilters,
  setSearchQuery,
  setLoading,
  setError,
  clearError,
  updateShopRating,
  addShopReview,
  updateShopStatus,
} = shopSlice.actions;

export default shopSlice.reducer; 