/**
 * Mock data for development and testing
 */

// Sample order data
export const mockOrders = [
  {
    _id: 'ord1',
    orderNumber: 'DMP-1001',
    items: [
      {
        _id: 'item1',
        productId: 'prod1',
        name: 'Recycled Concrete Blocks',
        price: 19.99,
        quantity: 50,
        imageUrl: '/uploads/products/concrete-blocks.jpg'
      }
    ],
    totalAmount: 999.50,
    status: 'delivered',
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    address: {
      street: '123 Green St',
      city: 'Eco City',
      state: 'Nature',
      zipCode: '54321'
    }
  },
  {
    _id: 'ord2',
    orderNumber: 'DMP-1002',
    items: [
      {
        _id: 'item2',
        productId: 'prod2',
        name: 'Bamboo Flooring Planks',
        price: 45.75,
        quantity: 10,
        imageUrl: '/uploads/products/bamboo-flooring.jpg'
      },
      {
        _id: 'item3',
        productId: 'prod3',
        name: 'Solar Roof Tiles',
        price: 125.00,
        quantity: 20,
        imageUrl: '/uploads/products/solar-tiles.jpg'
      }
    ],
    totalAmount: 2500.00,
    status: 'processing',
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    address: {
      street: '456 Eco Ave',
      city: 'Green Valley',
      state: 'Sustainable',
      zipCode: '98765'
    }
  },
  {
    _id: 'ord3',
    orderNumber: 'DMP-1003',
    items: [
      {
        _id: 'item4',
        productId: 'prod4',
        name: 'Reclaimed Wood Beams',
        price: 79.99,
        quantity: 8,
        imageUrl: '/uploads/products/wood-beams.jpg'
      }
    ],
    totalAmount: 639.92,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    address: {
      street: '789 Sustainable Rd',
      city: 'Eco Town',
      state: 'Green',
      zipCode: '12345'
    }
  }
];

// Sample notification data
export const mockNotifications = [
  {
    id: 'notif1',
    title: 'Order Delivered',
    message: 'Your order #DMP-1001 has been delivered successfully.',
    type: 'order',
    read: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'notif2',
    title: 'Payment Confirmed',
    message: 'Your payment for order #DMP-1002 has been confirmed.',
    type: 'payment',
    read: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'notif3',
    title: 'Special Offer',
    message: 'Get 20% off on all sustainable building materials this week!',
    type: 'promo',
    read: false,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Sample user addresses
export const mockAddresses = [
  {
    _id: 'addr1',
    type: 'home',
    street: '123 Green St',
    city: 'Eco City',
    state: 'Nature',
    zipCode: '54321',
    isDefault: true
  },
  {
    _id: 'addr2',
    type: 'office',
    street: '456 Eco Ave',
    city: 'Green Valley',
    state: 'Sustainable',
    zipCode: '98765',
    isDefault: false
  }
]; 