const express = require('express')
const {
  getOrders,
  getOrder,
  getMyOrders,
  getShopOrders,
  createOrderFromCart,
  updateOrderStatus,
  cancelOrder,
  createRazorpayOrderController,
  verifyRazorpayPayment,
} = require('../controllers/order.controller')
const {protect, authorize} = require('../middlewares/auth.middleware')
const {UserRole} = require('../constants')
const {validate} = require('../middlewares/validate.middleware')
const {
  getOrdersSchema,
  getOrderSchema,
  createOrderSchema,
  updateOrderStatusSchema,
  cancelOrderSchema,
  getUserOrdersSchema,
  createOrderFromCartSchema,
} = require('../validation/order.schema')
const {createOrderPaymentSchema, verifyPaymentSchema} = require('../validation/payment.schema')

const router = express.Router()

// Protect all routes
router.use(protect)

// Routes for all authenticated users
router.get('/myorders', validate(getUserOrdersSchema), getMyOrders)
router.get('/:id', validate(getOrderSchema), getOrder)
router.post('/from-cart', validate(createOrderFromCartSchema), createOrderFromCart)
router.put('/:id/cancel', validate(cancelOrderSchema), cancelOrder)
router.post('/razorpay', validate(createOrderPaymentSchema), createRazorpayOrderController)
router.post('/razorpay/verify', validate(verifyPaymentSchema), verifyRazorpayPayment)
router.get('/shop/:shopId', authorize(UserRole.VENDOR, UserRole.ADMIN), getShopOrders)
router.get('/', authorize(UserRole.ADMIN), validate(getOrdersSchema), getOrders)
router.put('/:id', validate(updateOrderStatusSchema), authorize(UserRole.ADMIN), updateOrderStatus)

module.exports = router
