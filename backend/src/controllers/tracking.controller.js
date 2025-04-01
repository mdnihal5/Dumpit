const Order = require('../models/order.model')
const asyncHandler = require('express-async-handler')
const { TrackingEventType, OrderStatus } = require('../constants')

/**
 * @desc    Update order location
 * @route   PUT /api/tracking/:orderId/location
 * @access  Private/Admin/Vendor
 */
const updateOrderLocation = asyncHandler(async (req, res) => {
  const { orderId } = req.params
  const { 
    longitude, 
    latitude, 
    status, 
    description, 
    estimatedDeliveryTime 
  } = req.body

  // Find order
  const order = await Order.findById(orderId)
  if (!order) {
    res.status(404)
    throw new Error('Order not found')
  }

  // Create location point
  const locationPoint = {
    type: 'Point',
    coordinates: [longitude, latitude]
  }

  // Update current location
  order.currentLocation = locationPoint

  // Add to location history
  order.locationHistory.push({
    location: locationPoint,
    timestamp: Date.now(),
    status: status || order.orderStatus,
    description
  })

  // Update estimated delivery time if provided
  if (estimatedDeliveryTime) {
    order.estimatedDeliveryTime = new Date(estimatedDeliveryTime)
  }

  // Update order status if provided
  if (status && Object.values(OrderStatus).includes(status)) {
    order.orderStatus = status
    
    // Set delivered date if status is delivered
    if (status === OrderStatus.DELIVERED) {
      order.deliveredAt = Date.now()
    }
  }

  // Save order
  await order.save()

  res.status(200).json({
    success: true,
    data: order
  })
})

/**
 * @desc    Get order tracking information
 * @route   GET /api/tracking/:orderId
 * @access  Private
 */
const getOrderTracking = asyncHandler(async (req, res) => {
  const { orderId } = req.params

  // Find order with tracking info
  const order = await Order.findById(orderId)
    .select('orderStatus currentLocation locationHistory estimatedDeliveryTime deliveredAt')
  
  if (!order) {
    res.status(404)
    throw new Error('Order not found')
  }

  // Check if user is authorized to view this order
  if (req.user.role !== 'admin' && req.user.id.toString() !== order.user.toString()) {
    res.status(403)
    throw new Error('Not authorized to access this order')
  }

  res.status(200).json({
    success: true,
    data: {
      orderId: order._id,
      orderStatus: order.orderStatus,
      currentLocation: order.currentLocation,
      locationHistory: order.locationHistory,
      estimatedDeliveryTime: order.estimatedDeliveryTime,
      deliveredAt: order.deliveredAt
    }
  })
})

/**
 * @desc    Get nearby orders for delivery partners
 * @route   GET /api/tracking/nearby
 * @access  Private/Admin/Vendor
 */
const getNearbyOrders = asyncHandler(async (req, res) => {
  const { longitude, latitude, maxDistance = 10000 } = req.query // maxDistance in meters, default 10km

  // Find orders with location within the specified radius
  const orders = await Order.find({
    'currentLocation': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)]
        },
        $maxDistance: parseInt(maxDistance)
      }
    },
    'orderStatus': {
      $in: [OrderStatus.PROCESSING, OrderStatus.PACKED, OrderStatus.SHIPPED, OrderStatus.OUT_FOR_DELIVERY]
    }
  })
  .select('_id orderItems.name shippingAddress currentLocation orderStatus estimatedDeliveryTime createdAt')
  .populate('user', 'name email phoneNumber')

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  })
})

module.exports = {
  updateOrderLocation,
  getOrderTracking,
  getNearbyOrders
} 