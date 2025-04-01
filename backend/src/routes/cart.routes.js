const express = require('express')
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require('../controllers/cart.controller')
const { protect } = require('../middlewares/auth.middleware')
const { validate } = require('../middlewares/validate.middleware')
const {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
} = require('../validation/cart.schema')

const router = express.Router()

// Protect all routes
router.use(protect)

// Cart routes
router.get('/', getCart)
router.post('/', validate(addToCartSchema), addToCart)
router.put('/:itemId', validate(updateCartItemSchema), updateCartItem)
router.delete('/:itemId', validate(removeCartItemSchema), removeCartItem)
router.delete('/', clearCart)

module.exports = router 