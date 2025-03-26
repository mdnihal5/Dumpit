import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../../api/config';

// Mock data
const mockOrders = [
  {
    id: 'ORD123456',
    date: '2023-06-15T10:30:00Z',
    status: 'DELIVERED',
    items: [
      {
        product: {
          id: '1',
          name: 'Portland Cement',
          price: 350,
          image: 'https://via.placeholder.com/300',
          vendor: { name: 'Cement Depot' },
          unit: 'bag'
        },
        quantity: 5,
        totalPrice: 1750
      }
    ],
    totalAmount: 1750,
    shippingAddress: {
      id: '1',
      name: 'John Doe',
      street: '123 Main St',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India',
      phone: '+919876543210',
      isDefault: true
    },
    paymentMethod: 'CASH_ON_DELIVERY',
    deliveryDate: '2023-06-20T14:00:00Z'
  },
  {
    id: 'ORD789012',
    date: '2023-07-05T14:45:00Z',
    status: 'PROCESSING',
    items: [
      {
        product: {
          id: '2',
          name: 'Red Clay Bricks',
          price: 8,
          image: 'https://via.placeholder.com/300',
          vendor: { name: 'Brick Factory' },
          unit: 'piece'
        },
        quantity: 100,
        totalPrice: 800
      },
      {
        product: {
          id: '3',
          name: 'Steel Rebars 10mm',
          price: 65,
          image: 'https://via.placeholder.com/300',
          vendor: { name: 'Steel Works' },
          unit: 'rod'
        },
        quantity: 20,
        totalPrice: 1300
      }
    ],
    totalAmount: 2100,
    shippingAddress: {
      id: '2',
      name: 'John Doe',
      street: '456 Work Site',
      city: 'Pune',
      state: 'Maharashtra',
      zipCode: '411001',
      country: 'India',
      phone: '+919876543210',
      isDefault: false
    },
    paymentMethod: 'ONLINE',
    deliveryDate: null
  },
  {
    id: 'ORD345678',
    date: '2023-08-20T09:15:00Z',
    status: 'SHIPPED',
    items: [
      {
        product: {
          id: '4',
          name: 'Sand (Fine)',
          price: 75,
          image: 'https://via.placeholder.com/300',
          vendor: { name: 'Local Supplier' },
          unit: 'kg'
        },
        quantity: 50,
        totalPrice: 3750
      }
    ],
    totalAmount: 3750,
    shippingAddress: {
      id: '1',
      name: 'John Doe',
      street: '123 Main St',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India',
      phone: '+919876543210',
      isDefault: true
    },
    paymentMethod: 'ONLINE',
    deliveryDate: '2023-08-25T00:00:00Z'
  },
  {
    id: 'ORD901234',
    date: '2023-09-10T16:30:00Z',
    status: 'PENDING',
    items: [
      {
        product: {
          id: '5',
          name: 'Ceramic Tiles',
          price: 45,
          image: 'https://via.placeholder.com/300',
          vendor: { name: 'Tile Experts' },
          unit: 'piece'
        },
        quantity: 30,
        totalPrice: 1350
      }
    ],
    totalAmount: 1350,
    shippingAddress: {
      id: '2',
      name: 'John Doe',
      street: '456 Work Site',
      city: 'Pune',
      state: 'Maharashtra',
      zipCode: '411001',
      country: 'India',
      phone: '+919876543210',
      isDefault: false
    },
    paymentMethod: 'CASH_ON_DELIVERY',
    deliveryDate: null
  },
  {
    id: 'ORD567890',
    date: '2023-05-25T11:00:00Z',
    status: 'CANCELLED',
    items: [
      {
        product: {
          id: '6',
          name: 'Concrete Mixer',
          price: 12000,
          image: 'https://via.placeholder.com/300',
          vendor: { name: 'Equipment Rentals' },
          unit: 'piece'
        },
        quantity: 1,
        totalPrice: 12000
      }
    ],
    totalAmount: 12000,
    shippingAddress: {
      id: '1',
      name: 'John Doe',
      street: '123 Main St',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India',
      phone: '+919876543210',
      isDefault: true
    },
    paymentMethod: 'ONLINE',
    deliveryDate: null,
    cancellationReason: 'Changed project requirements'
  }
];

// Async thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`${API_URL}/orders`);
      // if (!response.ok) throw new Error('Failed to fetch orders');
      // const data = await response.json();
      // return data;
      
      return mockOrders;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  'orders/fetchOrderDetails',
  async (orderId, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`${API_URL}/orders/${orderId}`);
      // if (!response.ok) throw new Error('Failed to fetch order details');
      // const data = await response.json();
      // return data;
      
      const order = mockOrders.find(order => order.id === orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async ({ orderId, reason }, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ reason })
      // });
      // if (!response.ok) throw new Error('Failed to cancel order');
      // const data = await response.json();
      // return data;
      
      const order = mockOrders.find(order => order.id === orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      
      if (['DELIVERED', 'SHIPPED'].includes(order.status)) {
        throw new Error('Cannot cancel an order that has been shipped or delivered');
      }
      
      return {
        orderId,
        status: 'CANCELLED',
        cancellationReason: reason
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`${API_URL}/orders`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderData)
      // });
      // if (!response.ok) throw new Error('Failed to place order');
      // const data = await response.json();
      // return data;
      
      // Mock a new order with a generated ID
      const newOrder = {
        id: `ORD${Math.floor(Math.random() * 1000000)}`,
        date: new Date().toISOString(),
        status: 'PENDING',
        ...orderData,
        deliveryDate: null
      };
      
      return newOrder;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    selectedOrder: null,
    loading: false,
    error: null
  },
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    resetSelectedOrder: (state) => {
      state.selectedOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchOrders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // fetchOrderDetails
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // cancelOrder
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        const { orderId, status, cancellationReason } = action.payload;
        
        // Update the order in the list
        state.orders = state.orders.map(order => {
          if (order.id === orderId) {
            return {
              ...order,
              status,
              cancellationReason
            };
          }
          return order;
        });
        
        // Update selected order if it's the same one
        if (state.selectedOrder && state.selectedOrder.id === orderId) {
          state.selectedOrder = {
            ...state.selectedOrder,
            status,
            cancellationReason
          };
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // placeOrder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = [action.payload, ...state.orders];
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearOrderError, resetSelectedOrder } = ordersSlice.actions;

// Selectors
export const selectAllOrders = (state) => state.orders.orders;
export const selectOrderById = (state, orderId) => 
  state.orders.orders.find(order => order.id === orderId);
export const selectSelectedOrder = (state) => state.orders.selectedOrder;
export const selectOrdersByStatus = (state, status) => 
  status ? state.orders.orders.filter(order => order.status === status) : state.orders.orders;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;

export default ordersSlice.reducer; 