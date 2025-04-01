const express = require('express')
const {
  updateOrderLocation,
  getOrderTracking,
  getNearbyOrders,
} = require('../controllers/tracking.controller')
const { protect, authorize } = require('../middlewares/auth.middleware')
const { validate } = require('../middlewares/validate.middleware')
const {
  updateOrderLocationSchema,
  getOrderTrackingSchema,
  getNearbyOrdersSchema,
} = require('../validation/tracking.schema')
const { UserRole } = require('../constants')

const router = express.Router()

// Protect all routes
router.use(protect)

// Order tracking routes
router.get('/nearby', validate(getNearbyOrdersSchema), authorize(UserRole.VENDOR, UserRole.ADMIN), getNearbyOrders)
router.get('/:orderId', validate(getOrderTrackingSchema), getOrderTracking)
router.put('/:orderId/location', validate(updateOrderLocationSchema), authorize(UserRole.VENDOR, UserRole.ADMIN), updateOrderLocation)

module.exports = router 