import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  addresses: [],
  defaultAddress: null,
  loading: false,
  error: null,
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setAddresses: (state, action) => {
      state.addresses = action.payload;
      state.defaultAddress = action.payload.find(addr => addr.isDefault) || null;
    },
    addAddress: (state, action) => {
      state.addresses.push(action.payload);
      if (action.payload.isDefault) {
        state.addresses.forEach(addr => {
          if (addr.id !== action.payload.id) {
            addr.isDefault = false;
          }
        });
        state.defaultAddress = action.payload;
      }
    },
    updateAddress: (state, action) => {
      const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
      if (index !== -1) {
        state.addresses[index] = action.payload;
        if (action.payload.isDefault) {
          state.addresses.forEach(addr => {
            if (addr.id !== action.payload.id) {
              addr.isDefault = false;
            }
          });
          state.defaultAddress = action.payload;
        }
      }
    },
    deleteAddress: (state, action) => {
      state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
      if (state.defaultAddress?.id === action.payload) {
        state.defaultAddress = state.addresses.find(addr => addr.isDefault) || null;
      }
    },
    setDefaultAddress: (state, action) => {
      state.addresses.forEach(addr => {
        addr.isDefault = addr.id === action.payload;
      });
      state.defaultAddress = state.addresses.find(addr => addr.id === action.payload) || null;
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
    clearAddresses: (state) => {
      state.addresses = [];
      state.defaultAddress = null;
    },
  },
});

export const {
  setAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  setLoading,
  setError,
  clearError,
  clearAddresses,
} = addressSlice.actions;

export default addressSlice.reducer; 