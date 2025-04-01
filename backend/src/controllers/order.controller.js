const Order = require('../models/order.model')
const Product = require('../models/product.model')
const User = require('../models/user.model')
const Cart = require('../models/cart.model')
const {ErrorResponse} = require('../middlewares/error.middleware')
const {createOrderNotification} = require('../services/notification.service')
const {sendOrderConfirmationEmail} = require('../services/email.service')
const {createOrder: createRazorpayOrder, verifyPayment} = require('../services/payment.service')
const {OrderStatus, UserRole} = require('../constants')

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin)
const getOrders = async (req, res, next) => {
  try {
    console.log(`GET /api/orders`)

    const orders = await Order.find().populate({path: 'user', select: 'name email'}).sort('-createdAt')

    res.status(200).json({success: true, count: orders.length, data: orders})
  } catch (error) {
    next(error)
  }
}

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    console.log(`GET /api/orders/myorders`)

    const orders = await Order.find({user: req.user?._id}).sort('-createdAt')

    res.status(200).json({success: true, count: orders.length, data: orders})
  } catch (error) {
    next(error)
  }
}

// @desc    Get vendor orders
// @route   GET /api/orders/shop/:shopId
// @access  Private (Vendor and Admin)
const getShopOrders = async (req, res, next) => {
  try {
    console.log(`GET /api/orders/shop/${req.params.shopId}`)

    const orders = await Order.find({
      'orderItems.product': {$in: await Product.find({shop: req.params.shopId}).select('_id')},
    })
      .populate({path: 'user', select: 'name email'})
      .sort('-createdAt')

    res.status(200).json({success: true, count: orders.length, data: orders})
  } catch (error) {
    next(error)
  }
}

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res, next) => {
  try {
    console.log(`GET /api/orders/${req.params.id}`)

    const order = await Order.findById(req.params.id).populate({
      path: 'user',
      select: 'name email',
    })

    if (!order) {
      return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404))
    }

    // Check if the order belongs to the logged in user or if user is admin
    if (req.user?.role !== UserRole.ADMIN && order.user.toString() !== req.user?._id.toString()) {
      return next(new ErrorResponse('Not authorized to access this order', 403))
    }

    res.status(200).json({success: true, data: order})
  } catch (error) {
    next(error)
  }
}

// @desc    Create new order from cart
// @route   POST /api/orders/from-cart
// @access  Private
const createOrderFromCart = async (req, res, next) => {
  try {
    console.log(`POST /api/orders/from-cart`)

    const { shippingAddress, paymentInfo, taxAmount, shippingAmount } = req.body

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user?._id })
    
    if (!cart || cart.items.length === 0) {
      return next(new ErrorResponse('Cart is empty', 400))
    }

    // Verify all products exist and have sufficient stock
    const orderItems = []
    for (const item of cart.items) {
      const product = await Product.findById(item.product)

      if (!product) {
        return next(new ErrorResponse(`Product not found with id of ${item.product}`, 404))
      }

      if (product.stock < item.quantity) {
        return next(new ErrorResponse(`Product ${product.name} is out of stock`, 400))
      }

      // Update product stock
      product.stock -= item.quantity
      await product.save()

      // Add to order items
      orderItems.push({
        product: item.product,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })
    }

    // Calculate total amount if not provided
    const totalAmount = cart.totalAmount + (taxAmount || 0) + (shippingAmount || 0)

    // Create order
    const order = await Order.create({
      orderItems,
      shippingAddress,
      paymentInfo,
      taxAmount: taxAmount || 0,
      shippingAmount: shippingAmount || 0,
      totalAmount,
      user: req.user?._id,
    })

    // Clear cart after successful order
    cart.items = []
    await cart.save()

    // Create notification
    await createOrderNotification(req.user?._id.toString(), order._id.toString(), OrderStatus.PROCESSING)

    // Send email
    const user = await User.findById(req.user?._id)
    if (user) {
      await sendOrderConfirmationEmail(user.email, order)
    }

    res.status(201).json({success: true, data: order})
  } catch (error) {
    next(error)
  }
}

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private (Admin)
const updateOrderStatus = async (req, res, next) => {
  try {
    console.log(`PUT /api/orders/${req.params.id}`)

    const {orderStatus} = req.body

    const order = await Order.findById(req.params.id)

    if (!order) {
      return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404))
    }

    // Prevent status change if already delivered or cancelled
    if (order.orderStatus === OrderStatus.DELIVERED) {
      return next(new ErrorResponse('Order has already been delivered', 400))
    }

    if (order.orderStatus === OrderStatus.CANCELLED) {
      return next(new ErrorResponse('Order has already been cancelled', 400))
    }

    // Update order status
    order.orderStatus = orderStatus

    // If order is delivered, add delivered date
    if (orderStatus === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date()
    }

    await order.save()

    // Create notification for status change
    await createOrderNotification(order.user.toString(), order._id.toString(), orderStatus)

    res.status(200).json({success: true, data: order})
  } catch (error) {
    next(error)
  }
}

// @desc    Create Razorpay order
// @route   POST /api/orders/razorpay
// @access  Private
const createRazorpayOrderController = async (req, res, next) => {
  try {
    console.log(`POST /api/orders/razorpay`)

    const {amount} = req.body

    if (!amount) {
      return next(new ErrorResponse('Please provide an amount', 400))
    }

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder({
      amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    })

    res.status(200).json({success: true, data: razorpayOrder})
  } catch (error) {
    next(error)
  }
}

// @desc    Verify Razorpay payment
// @route   POST /api/orders/razorpay/verify
// @access  Private
const verifyRazorpayPayment = async (req, res, next) => {
  try {
    console.log(`POST /api/orders/razorpay/verify`)

    const {orderId, paymentId, signature} = req.body

    if (!orderId || !paymentId || !signature) {
      return next(new ErrorResponse('Please provide all required fields', 400))
    }

    // Verify payment
    const isValid = verifyPayment(orderId, paymentId, signature)

    if (!isValid) {
      return next(new ErrorResponse('Payment verification failed', 400))
    }

    res.status(200).json({success: true, message: 'Payment verified successfully'})
  } catch (error) {
    next(error)
  }
}

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res, next) => {
  try {
    console.log(`PUT /api/orders/${req.params.id}/cancel`)

    const order = await Order.findById(req.params.id)

    if (!order) {
      return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404))
    }

    // Check if the order belongs to the logged in user or if user is admin
    if (req.user?.role !== UserRole.ADMIN && order.user.toString() !== req.user?._id.toString()) {
      return next(new ErrorResponse('Not authorized to cancel this order', 403))
    }

    // Prevent cancellation if already delivered
    if (order.orderStatus === OrderStatus.DELIVERED) {
      return next(new ErrorResponse('Cannot cancel delivered order', 400))
    }

    // Prevent multiple cancellations
    if (order.orderStatus === OrderStatus.CANCELLED) {
      return next(new ErrorResponse('Order has already been cancelled', 400))
    }

    // Update order status
    order.orderStatus = OrderStatus.CANCELLED

    // Restore product quantities
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product)

      if (product) {
        product.stock += item.quantity
        await product.save()
      }
    }

    await order.save()

    // Create notification for cancellation
    await createOrderNotification(order.user.toString(), order._id.toString(), OrderStatus.CANCELLED)

    res.status(200).json({success: true, data: order})
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getOrders,
  getOrder,
  getMyOrders,
  getShopOrders,
  createOrderFromCart,
  updateOrderStatus,
  cancelOrder,
  createRazorpayOrderController,
  verifyRazorpayPayment,
}
