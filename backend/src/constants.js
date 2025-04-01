// User roles
const UserRole = {
  CUSTOMER: 'customer',
  VENDOR: 'vendor',
  ADMIN: 'admin'
};

// Order status
const OrderStatus = {
  PROCESSING: 'Processing',
  PACKED: 'Packed',
  SHIPPED: 'Shipped',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
};

// Payment status
const PaymentStatus = {
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  REFUNDED: 'Refunded'
};

// Order tracking event types
const TrackingEventType = {
  ORDER_PLACED: 'Order Placed',
  ORDER_PROCESSED: 'Order Processed',
  ORDER_PACKED: 'Order Packed',
  ORDER_SHIPPED: 'Order Shipped',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERY_ATTEMPTED: 'Delivery Attempted',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  RETURNED: 'Returned',
  DELAYED: 'Delayed'
};

module.exports = {
  UserRole,
  OrderStatus,
  PaymentStatus,
  TrackingEventType
}; 