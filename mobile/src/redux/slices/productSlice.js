import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ProductService } from '../../api';
import { API_URL } from '../../api/config';

// Mock data
const mockProducts = [
  {
    id: '1',
    name: 'Portland Cement',
    description: 'High quality Portland cement for all your construction needs.',
    price: 350,
    category: { id: '1', name: 'Cement' },
    image: 'https://via.placeholder.com/300',
    gallery: [
      'https://via.placeholder.com/800',
      'https://via.placeholder.com/800',
      'https://via.placeholder.com/800'
    ],
    featured: true,
    stock: 500,
    unit: 'bag',
    ratings: {
      averageRating: 4.5,
      totalReviews: 120
    },
    specifications: {
      brand: 'UltraCem',
      weight: '50kg',
      type: 'Portland Cement',
      grade: '53'
    },
    vendor: {
      id: '1',
      name: 'Cement Depot',
      logo: 'https://via.placeholder.com/100',
      rating: 4.8
    },
    createdAt: '2023-05-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Red Clay Bricks',
    description: 'Premium quality red clay bricks for building walls.',
    price: 8,
    category: { id: '2', name: 'Bricks' },
    image: 'https://via.placeholder.com/300',
    gallery: [
      'https://via.placeholder.com/800',
      'https://via.placeholder.com/800',
      'https://via.placeholder.com/800'
    ],
    featured: true,
    stock: 10000,
    unit: 'piece',
    ratings: {
      averageRating: 4.2,
      totalReviews: 85
    },
    specifications: {
      brand: 'BrickMaster',
      dimension: '230x110x70mm',
      material: 'Clay',
      color: 'Red'
    },
    vendor: {
      id: '2',
      name: 'Brick Factory',
      logo: 'https://via.placeholder.com/100',
      rating: 4.5
    },
    createdAt: '2023-05-10T09:15:00Z'
  },
  {
    id: '3',
    name: 'River Sand',
    description: 'Clean river sand, ideal for concrete mixing and masonry work.',
    price: 2000,
    category: { id: '3', name: 'Sand' },
    image: 'https://via.placeholder.com/300',
    gallery: [
      'https://via.placeholder.com/800',
      'https://via.placeholder.com/800',
      'https://via.placeholder.com/800'
    ],
    featured: false,
    stock: 1000,
    unit: 'ton',
    ratings: {
      averageRating: 4.0,
      totalReviews: 65
    },
    specifications: {
      type: 'River Sand',
      grainSize: 'Medium',
      use: 'Construction',
      quality: 'Premium'
    },
    vendor: {
      id: '3',
      name: 'Sand Suppliers',
      logo: 'https://via.placeholder.com/100',
      rating: 4.3
    },
    createdAt: '2023-05-05T14:20:00Z'
  }
];

const mockCategories = [
  {
    id: '1',
    name: 'Cement',
    iconUrl: 'https://via.placeholder.com/50'
  },
  {
    id: '2',
    name: 'Bricks',
    iconUrl: 'https://via.placeholder.com/50'
  },
  {
    id: '3',
    name: 'Sand',
    iconUrl: 'https://via.placeholder.com/50'
  },
  {
    id: '4',
    name: 'Steel',
    iconUrl: 'https://via.placeholder.com/50'
  },
  {
    id: '5',
    name: 'Pipes',
    iconUrl: 'https://via.placeholder.com/50'
  },
  {
    id: '6',
    name: 'Paint',
    iconUrl: 'https://via.placeholder.com/50'
  }
];

const mockPromotions = [
  {
    id: '1',
    title: '20% Off on Cement',
    subtitle: 'Limited time offer on all cement brands',
    imageUrl: 'https://via.placeholder.com/800x300'
  },
  {
    id: '2',
    title: 'Free Delivery',
    subtitle: 'On orders over ₹5000',
    imageUrl: 'https://via.placeholder.com/800x300'
  }
];

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call with params
      // const queryParams = new URLSearchParams(params).toString();
      // const response = await fetch(`${API_URL}/products?${queryParams}`);
      // if (!response.ok) throw new Error('Failed to fetch products');
      // const data = await response.json();
      // return data;
      
      // Filter mock data based on params
      let filteredProducts = [...mockProducts];
      
      if (params.category) {
        filteredProducts = filteredProducts.filter(
          product => product.category.id === params.category
        );
      }
      
      if (params.featured) {
        filteredProducts = filteredProducts.filter(product => product.featured);
      }
      
      return filteredProducts;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`${API_URL}/categories`);
      // if (!response.ok) throw new Error('Failed to fetch categories');
      // const data = await response.json();
      // return data;
      
      return mockCategories;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPromotions = createAsyncThunk(
  'products/fetchPromotions',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`${API_URL}/promotions`);
      // if (!response.ok) throw new Error('Failed to fetch promotions');
      // const data = await response.json();
      // return data;
      
      return mockPromotions;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async ({ query }, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}`);
      // if (!response.ok) throw new Error('Failed to search products');
      // const data = await response.json();
      // return data;
      
      // Filter mock data based on search query
      const searchResults = mockProducts.filter(
        product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.category.name.toLowerCase().includes(query.toLowerCase())
      );
      
      return searchResults;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  products: [],
  categories: [],
  promotions: [],
  featuredProducts: [],
  loading: false,
  error: null
};

// Product slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.featuredProducts = action.payload.filter(product => product.featured);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // fetchCategories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // fetchPromotions
      .addCase(fetchPromotions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPromotions.fulfilled, (state, action) => {
        state.loading = false;
        state.promotions = action.payload;
      })
      .addCase(fetchPromotions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // searchProducts
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default productSlice.reducer; 