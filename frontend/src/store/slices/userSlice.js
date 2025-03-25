import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  addresses: [],
  selectedAddress: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.error = null;
    },
    setAddresses: (state, action) => {
      state.addresses = action.payload;
      state.error = null;
    },
    addAddress: (state, action) => {
      state.addresses.push(action.payload);
      state.error = null;
    },
    updateAddress: (state, action) => {
      const index = state.addresses.findIndex(
        (address) => address.id === action.payload.id
      );
      if (index !== -1) {
        state.addresses[index] = action.payload;
      }
      state.error = null;
    },
    deleteAddress: (state, action) => {
      state.addresses = state.addresses.filter(
        (address) => address.id !== action.payload
      );
      if (state.selectedAddress?.id === action.payload) {
        state.selectedAddress = null;
      }
      state.error = null;
    },
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
      state.error = null;
    },
    setDefaultAddress: (state, action) => {
      const addressId = action.payload;
      state.addresses = state.addresses.map((address) => ({
        ...address,
        isDefault: address.id === addressId,
      }));
      state.error = null;
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
    logout: (state) => {
      state.user = null;
      state.addresses = [];
      state.selectedAddress = null;
      state.error = null;
    },
  },
});

export const {
  setUser,
  setAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setSelectedAddress,
  setDefaultAddress,
  setLoading,
  setError,
  clearError,
  logout,
} = userSlice.actions;

export default userSlice.reducer; 