import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../../api/config';

// Mock data
const mockVendors = [
  {
    id: '1',
    name: 'Cement Depot',
    logo: 'https://via.placeholder.com/100',
    rating: 4.5,
    totalReviews: 120,
    minOrderValue: 1000,
    deliveryFee: 150,
    freeDeliveryOver: 5000,
    address: {
      street: '123 Industrial Area',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India'
    },
    contact: {
      phone: '+919876543210',
      email: 'orders@cementdepot.com',
    },
    categories: ['Cement', 'Concrete', 'Construction Materials'],
    isVerified: true,
    deliveryTime: '1-3 days'
  },
  {
    id: '2',
    name: 'Brick Factory',
    logo: 'https://via.placeholder.com/100',
    rating: 4.2,
    totalReviews: 85,
    minOrderValue: 500,
    deliveryFee: 100,
    freeDeliveryOver: 3000,
    address: {
      street: '456 Brick Lane',
      city: 'Pune',
      state: 'Maharashtra',
      zipCode: '411001',
      country: 'India'
    },
    contact: {
      phone: '+919876543211',
      email: 'orders@brickfactory.com',
    },
    categories: ['Bricks', 'Clay Products', 'Construction Materials'],
    isVerified: true,
    deliveryTime: '2-4 days'
  },
  {
    id: '3',
    name: 'Steel Works',
    logo: 'https://via.placeholder.com/100',
    rating: 4.7,
    totalReviews: 210,
    minOrderValue: 2000,
    deliveryFee: 200,
    freeDeliveryOver: 10000,
    address: {
      street: '789 Steel Complex',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001',
      country: 'India'
    },
    contact: {
      phone: '+919876543212',
      email: 'orders@steelworks.com',
    },
    categories: ['Steel', 'Metal Products', 'Construction Materials', 'Rebars'],
    isVerified: true,
    deliveryTime: '3-5 days'
  },
  {
    id: '4',
    name: 'Local Supplier',
    logo: 'https://via.placeholder.com/100',
    rating: 3.9,
    totalReviews: 45,
    minOrderValue: 300,
    deliveryFee: 50,
    freeDeliveryOver: 1500,
    address: {
      street: '101 Market Road',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560001',
      country: 'India'
    },
    contact: {
      phone: '+919876543213',
      email: 'orders@localsupplier.com',
    },
    categories: ['Sand', 'Gravel', 'Construction Materials'],
    isVerified: false,
    deliveryTime: '1-2 days'
  },
  {
    id: '5',
    name: 'Tile Experts',
    logo: 'https://via.placeholder.com/100',
    rating: 4.6,
    totalReviews: 150,
    minOrderValue: 800,
    deliveryFee: 100,
    freeDeliveryOver: 4000,
    address: {
      street: '234 Design Street',
      city: 'Hyderabad',
      state: 'Telangana',
      zipCode: '500001',
      country: 'India'
    },
    contact: {
      phone: '+919876543214',
      email: 'orders@tileexperts.com',
    },
    categories: ['Tiles', 'Ceramic Products', 'Construction Materials', 'Flooring'],
    isVerified: true,
    deliveryTime: '2-3 days'
  }
];

// Async thunks
export const fetchVendors = createAsyncThunk(
  'vendors/fetchVendors',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`${API_URL}/vendors`);
      // if (!response.ok) throw new Error('Failed to fetch vendors');
      // const data = await response.json();
      // return data;
      
      return mockVendors;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchVendorDetails = createAsyncThunk(
  'vendors/fetchVendorDetails',
  async (vendorId, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`${API_URL}/vendors/${vendorId}`);
      // if (!response.ok) throw new Error('Failed to fetch vendor details');
      // const data = await response.json();
      // return data;
      
      const vendor = mockVendors.find(vendor => vendor.id === vendorId);
      if (!vendor) {
        throw new Error('Vendor not found');
      }
      return vendor;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchVendorProducts = createAsyncThunk(
  'vendors/fetchVendorProducts',
  async (vendorId, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`${API_URL}/vendors/${vendorId}/products`);
      // if (!response.ok) throw new Error('Failed to fetch vendor products');
      // const data = await response.json();
      // return data;
      
      // Mock return some products associated with this vendor
      return [
        {
          id: `v${vendorId}_p1`,
          name: 'Premium Product',
          price: 650,
          image: 'https://via.placeholder.com/300',
          description: 'High quality premium product',
          stock: 45,
          rating: 4.7,
          vendorId: vendorId
        },
        {
          id: `v${vendorId}_p2`,
          name: 'Standard Product',
          price: 350,
          image: 'https://via.placeholder.com/300',
          description: 'Reliable standard product',
          stock: 120,
          rating: 4.3,
          vendorId: vendorId
        },
        {
          id: `v${vendorId}_p3`,
          name: 'Economy Product',
          price: 200,
          image: 'https://via.placeholder.com/300',
          description: 'Budget-friendly economy product',
          stock: 85,
          rating: 3.9,
          vendorId: vendorId
        }
      ];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const vendorSlice = createSlice({
  name: 'vendors',
  initialState: {
    vendors: [],
    selectedVendor: null,
    vendorProducts: [],
    loading: false,
    error: null
  },
  reducers: {
    clearVendorError: (state) => {
      state.error = null;
    },
    resetSelectedVendor: (state) => {
      state.selectedVendor = null;
      state.vendorProducts = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchVendors
      .addCase(fetchVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = action.payload;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // fetchVendorDetails
      .addCase(fetchVendorDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVendor = action.payload;
      })
      .addCase(fetchVendorDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // fetchVendorProducts
      .addCase(fetchVendorProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.vendorProducts = action.payload;
      })
      .addCase(fetchVendorProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearVendorError, resetSelectedVendor } = vendorSlice.actions;

// Selectors
export const selectAllVendors = (state) => state.vendors.vendors;
export const selectVendorById = (state, vendorId) => 
  state.vendors.vendors.find(vendor => vendor.id === vendorId);
export const selectSelectedVendor = (state) => state.vendors.selectedVendor;
export const selectVendorProducts = (state) => state.vendors.vendorProducts;
export const selectVendorsByCategory = (state, category) => 
  category ? state.vendors.vendors.filter(vendor => 
    vendor.categories.includes(category)
  ) : state.vendors.vendors;
export const selectVendorsLoading = (state) => state.vendors.loading;
export const selectVendorsError = (state) => state.vendors.error;

export default vendorSlice.reducer; 