import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../../api/config';

// Mock data for addresses - in a real app these would come from the API
const mockAddresses = [
  {
    id: '1',
    name: 'John Doe',
    type: 'home',
    street: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    phone: '+91 9876543210'
  },
  {
    id: '2',
    name: 'John Doe',
    type: 'work',
    street: '456 Office Park',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400002',
    phone: '+91 9876543210'
  }
];

// Async thunks
export const fetchAddresses = createAsyncThunk(
  'user/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`${API_URL}/user/addresses`);
      // if (!response.ok) throw new Error('Failed to fetch addresses');
      // const data = await response.json();
      // return data;
      
      // Using mock data for now
      return mockAddresses;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  'user/setDefaultAddress',
  async ({ addressId }, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`${API_URL}/user/addresses/default`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ addressId })
      // });
      // if (!response.ok) throw new Error('Failed to set default address');
      // const data = await response.json();
      // return data;
      
      // Using mock response for now
      return { addressId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'user/deleteAddress',
  async ({ addressId }, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`${API_URL}/user/addresses/${addressId}`, {
      //   method: 'DELETE'
      // });
      // if (!response.ok) throw new Error('Failed to delete address');
      // return addressId;
      
      // Using mock response for now
      return { addressId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    addresses: [],
    defaultAddressId: '1', // Default to first address
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchAddresses
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // setDefaultAddress
      .addCase(setDefaultAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.defaultAddressId = action.payload.addressId;
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // deleteAddress
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.filter(
          address => address.id !== action.payload.addressId
        );
        // If deleted address was the default, set a new default if any addresses remain
        if (state.defaultAddressId === action.payload.addressId && state.addresses.length > 0) {
          state.defaultAddressId = state.addresses[0].id;
        }
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default userSlice.reducer; 