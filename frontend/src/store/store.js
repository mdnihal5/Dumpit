import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import thunk from 'redux-thunk';

// Import slices
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import vendorReducer from './slices/vendorSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';

// Configure redux-persist
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  // Whitelist (save specific reducers)
  whitelist: ['auth', 'cart'],
  // Blacklist (don't save specific reducers)
  blacklist: [],
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  products: productReducer,
  vendors: vendorReducer,
  orders: orderReducer,
  user: userReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(thunk),
});

// Create persistor
export const persistor = persistStore(store); 