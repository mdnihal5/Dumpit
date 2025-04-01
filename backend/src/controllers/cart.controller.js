const Cart = require('../models/cart.model')
const Product = require('../models/product.model')
const asyncHandler = require('express-async-handler')

/**
 * @desc    Get cart for the logged in user
 * @route   GET /api/cart
 * @access  Private
 */
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id })
    .populate('items.product', 'name price discount finalPrice stock images')
    .populate('items.shop', 'name')

  if (!cart) {
    // Create a new cart if none exists
    cart = await Cart.create({
      user: req.user.id,
      items: [],
    })
  }

  res.status(200).json({
    success: true,
    data: cart,
  })
})

/**
 * @desc    Add item to cart
 * @route   POST /api/cart
 * @access  Private
 */
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body

  // Validate product exists
  const product = await Product.findById(productId)
  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  // Check if product is in stock
  if (product.stock < quantity) {
    res.status(400)
    throw new Error('Not enough stock available')
  }

  // Find or create user's cart
  let cart = await Cart.findOne({ user: req.user.id })
  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      items: [],
    })
  }

  // Check if item already exists in cart
  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  )

  if (existingItemIndex > -1) {
    // Update existing item quantity
    cart.items[existingItemIndex].quantity = quantity
  } else {
    // Add new item to cart
    cart.items.push({
      product: productId,
      quantity,
      name: product.name,
      price: product.price,
      finalPrice: product.finalPrice,
      image: product.images.length > 0 ? product.images[0].url : '',
      shop: product.shop,
    })
  }

  // Save cart
  await cart.save()

  // Return updated cart with populated fields
  cart = await Cart.findById(cart._id)
    .populate('items.product', 'name price discount finalPrice stock images')
    .populate('items.shop', 'name')

  res.status(200).json({
    success: true,
    data: cart,
  })
})

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/:itemId
 * @access  Private
 */
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body
  const { itemId } = req.params

  // Find user's cart
  let cart = await Cart.findOne({ user: req.user.id })
  if (!cart) {
    res.status(404)
    throw new Error('Cart not found')
  }

  // Find the item in the cart
  const itemIndex = cart.items.findIndex(
    (item) => item._id.toString() === itemId
  )

  if (itemIndex === -1) {
    res.status(404)
    throw new Error('Item not found in cart')
  }

  // Check product stock
  const product = await Product.findById(cart.items[itemIndex].product)
  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  if (product.stock < quantity) {
    res.status(400)
    throw new Error('Not enough stock available')
  }

  // Update item quantity
  cart.items[itemIndex].quantity = quantity

  // Remove item if quantity is 0
  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1)
  }

  // Save cart
  await cart.save()

  // Return updated cart with populated fields
  cart = await Cart.findById(cart._id)
    .populate('items.product', 'name price discount finalPrice stock images')
    .populate('items.shop', 'name')

  res.status(200).json({
    success: true,
    data: cart,
  })
})

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/:itemId
 * @access  Private
 */
const removeCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params

  // Find user's cart
  let cart = await Cart.findOne({ user: req.user.id })
  if (!cart) {
    res.status(404)
    throw new Error('Cart not found')
  }

  // Find the item in the cart
  const itemIndex = cart.items.findIndex(
    (item) => item._id.toString() === itemId
  )

  if (itemIndex === -1) {
    res.status(404)
    throw new Error('Item not found in cart')
  }

  // Remove item from cart
  cart.items.splice(itemIndex, 1)

  // Save cart
  await cart.save()

  // Return updated cart with populated fields
  cart = await Cart.findById(cart._id)
    .populate('items.product', 'name price discount finalPrice stock images')
    .populate('items.shop', 'name')

  res.status(200).json({
    success: true,
    data: cart,
  })
})

/**
 * @desc    Clear cart
 * @route   DELETE /api/cart
 * @access  Private
 */
const clearCart = asyncHandler(async (req, res) => {
  // Find user's cart
  const cart = await Cart.findOne({ user: req.user.id })
  if (!cart) {
    res.status(404)
    throw new Error('Cart not found')
  }

  // Clear cart items
  cart.items = []

  // Save cart
  await cart.save()

  res.status(200).json({
    success: true,
    data: cart,
  })
})

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} 