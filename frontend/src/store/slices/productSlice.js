import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  featuredProducts: [],
  categories: [],
  selectedProduct: null,
  loading: false,
  error: null,
  filters: {
    category: null,
    priceRange: null,
    rating: null,
    sortBy: 'popular',
  },
  searchQuery: '',
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setFeaturedProducts: (state, action) => {
      state.featuredProducts = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
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
    updateProductStock: (state, action) => {
      const { productId, stock } = action.payload;
      const product = state.products.find(p => p.id === productId);
      if (product) {
        product.stock = stock;
      }
      if (state.selectedProduct?.id === productId) {
        state.selectedProduct.stock = stock;
      }
    },
    addProductReview: (state, action) => {
      const { productId, review } = action.payload;
      const product = state.products.find(p => p.id === productId);
      if (product) {
        product.reviews.push(review);
        product.rating = product.reviews.reduce((acc, rev) => acc + rev.rating, 0) / product.reviews.length;
      }
      if (state.selectedProduct?.id === productId) {
        state.selectedProduct.reviews.push(review);
        state.selectedProduct.rating = state.selectedProduct.reviews.reduce((acc, rev) => acc + rev.rating, 0) / state.selectedProduct.reviews.length;
      }
    },
  },
});

export const {
  setProducts,
  setFeaturedProducts,
  setCategories,
  setSelectedProduct,
  setFilters,
  clearFilters,
  setSearchQuery,
  setLoading,
  setError,
  clearError,
  updateProductStock,
  addProductReview,
} = productSlice.actions;

export default productSlice.reducer; 