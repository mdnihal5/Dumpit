const Product = require('../models/product.model')
const Shop = require('../models/shop.model')
const Category = require('../models/category.model')
const {ErrorResponse} = require('../middlewares/error.middleware')
const {uploadImage, deleteImage} = require('../config/cloudinary')
const {createLowStockNotification} = require('../services/notification.service')

// @desc    Get all products with filtering, sorting, pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    console.log(`GET /api/products`)

    const reqQuery = {...req.query}

    const removeFields = ['select', 'sort', 'page', 'limit']
    removeFields.forEach((param) => delete reqQuery[param])

    // Create query string and add $ to operators
    let queryStr = JSON.stringify(reqQuery)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)

    let query = Product.find(JSON.parse(queryStr))
      .populate({path: 'category', select: 'name'})
      .populate({path: 'shop', select: 'name'})

    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ')
      query = query.select(fields)
    }

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt')
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await Product.countDocuments(JSON.parse(queryStr))

    query = query.skip(startIndex).limit(limit)

    const products = await query

    const pagination = {}

    if (endIndex < total) {
      pagination.next = {page: page + 1, limit}
    }

    if (startIndex > 0) {
      pagination.prev = {page: page - 1, limit}
    }

    res.status(200).json({
      success: true,
      count: products.length,
      pagination,
      data: products,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res, next) => {
  try {
    console.log(`GET /api/products/${req.params.id}`)

    const product = await Product.findById(req.params.id).populate({path: 'category', select: 'name'}).populate({
      path: 'shop',
      select: 'name address ratings reviews',
    })

    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({success: true, data: product})
  } catch (error) {
    next(error)
  }
}

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Vendors and Admins)
const createProduct = async (req, res, next) => {
  try {
    console.log(`POST /api/products`)

    // Check if shop exists and belongs to user
    const shop = await Shop.findById(req.body.shop)

    if (!shop) {
      return next(new ErrorResponse(`Shop not found with id of ${req.body.shop}`, 404))
    }

    // Check if user is admin or shop owner
    const {UserRole} = require('../constants')
    if (req.user?.role !== UserRole.ADMIN && shop.owner.toString() !== req.user?._id.toString()) {
      return next(new ErrorResponse(`User is not authorized to add a product to this shop`, 403))
    }

    // Verify category exists
    const category = await Category.findById(req.body.category)
    if (!category) {
      return next(new ErrorResponse(`Category not found with id of ${req.body.category}`, 404))
    }

    // Create product
    const product = await Product.create(req.body)

    // Add product to shop's products
    await Shop.findByIdAndUpdate(req.body.shop, {
      $push: {products: product._id},
    })

    // Add product to category's products
    await Category.findByIdAndUpdate(req.body.category, {
      $push: {products: product._id},
    })

    res.status(201).json({success: true, data: product})
  } catch (error) {
    next(error)
  }
}

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Vendors and Admins)
const updateProduct = async (req, res, next) => {
  try {
    console.log(`PUT /api/products/${req.params.id}`)

    let product = await Product.findById(req.params.id)

    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404))
    }

    // Check if user is admin or product belongs to user's shop
    const {UserRole} = require('../constants')
    if (req.user?.role !== UserRole.ADMIN) {
      const shop = await Shop.findById(product.shop)

      if (!shop || shop.owner.toString() !== req.user?._id.toString()) {
        return next(new ErrorResponse(`User is not authorized to update this product`, 403))
      }
    }

    // Update product
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({success: true, data: product})
  } catch (error) {
    next(error)
  }
}

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Vendors and Admins)
const deleteProduct = async (req, res, next) => {
  try {
    console.log(`DELETE /api/products/${req.params.id}`)

    const product = await Product.findById(req.params.id)

    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404))
    }

    // Check if user is admin or product belongs to user's shop
    const {UserRole} = require('../constants')
    if (req.user?.role !== UserRole.ADMIN) {
      const shop = await Shop.findById(product.shop)

      if (!shop || shop.owner.toString() !== req.user?._id.toString()) {
        return next(new ErrorResponse(`User is not authorized to delete this product`, 403))
      }
    }

    // Delete product images from cloudinary
    for (const image of product.images) {
      await deleteImage(image.public_id)
    }

    // Remove product from shop and category
    await Shop.findByIdAndUpdate(product.shop, {
      $pull: {products: product._id},
    })

    await Category.findByIdAndUpdate(product.category, {
      $pull: {products: product._id},
    })

    // Delete product
    await product.deleteOne()

    res.status(200).json({success: true, data: {}})
  } catch (error) {
    next(error)
  }
}

// @desc    Upload product images
// @route   PUT /api/products/:id/images
// @access  Private (Vendors and Admins)
const uploadProductImages = async (req, res, next) => {
  try {
    console.log(`PUT /api/products/${req.params.id}/images`)

    const product = await Product.findById(req.params.id)

    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404))
    }

    // Check if user is admin or product belongs to user's shop
    const {UserRole} = require('../constants')
    if (req.user?.role !== UserRole.ADMIN) {
      const shop = await Shop.findById(product.shop)

      if (!shop || shop.owner.toString() !== req.user?._id.toString()) {
        return next(new ErrorResponse(`User is not authorized to update this product`, 403))
      }
    }

    // Check if file is uploaded
    if (!req.files || req.files.length === 0) {
      return next(new ErrorResponse('Please upload at least one image', 400))
    }

    const files = req.files
    const uploadedImages = []

    // Upload images to cloudinary
    for (const file of files) {
      const image = await uploadImage(file)
      uploadedImages.push(image)
    }

    // Add images to product
    product.images.push(...uploadedImages)
    await product.save()

    res.status(200).json({
      success: true,
      data: product,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update product stock
// @route   PUT /api/products/:id/stock
// @access  Private (Vendors and Admins)
const updateProductStock = async (req, res, next) => {
  try {
    console.log(`PUT /api/products/${req.params.id}/stock`)

    const {stock} = req.body

    if (stock === undefined || stock < 0) {
      return next(new ErrorResponse('Please provide a valid stock value', 400))
    }

    const product = await Product.findById(req.params.id)

    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404))
    }

    // Check if user is admin or product belongs to user's shop
    const {UserRole} = require('../constants')
    if (req.user?.role !== UserRole.ADMIN) {
      const shop = await Shop.findById(product.shop)

      if (!shop || shop.owner.toString() !== req.user?._id.toString()) {
        return next(new ErrorResponse(`User is not authorized to update this product`, 403))
      }
    }

    // Update stock
    product.stock = stock
    await product.save()

    // If stock is low, create notification for shop owner
    if (stock <= 5) {
      const shop = await Shop.findById(product.shop)

      if (shop) {
        await createLowStockNotification(shop.owner.toString(), product._id.toString(), product.name, stock)
      }
    }

    res.status(200).json({success: true, data: product})
  } catch (error) {
    next(error)
  }
}

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private (Customers)
const addProductReview = async (req, res, next) => {
  try {
    console.log(`POST /api/products/${req.params.id}/reviews`)

    const {rating, comment} = req.body

    if (!rating || rating < 1 || rating > 5) {
      return next(new ErrorResponse('Please provide a rating between 1 and 5', 400))
    }

    const product = await Product.findById(req.params.id)

    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404))
    }

    // Check if user already reviewed this product
    const alreadyReviewed = product.reviews.find((review) => review.user.toString() === req.user?._id.toString())

    if (alreadyReviewed) {
      return next(new ErrorResponse('Product already reviewed', 400))
    }

    const review = {
      user: req.user?._id,
      name: req.user?.name,
      rating: Number(rating),
      comment,
      createdAt: new Date(),
    }

    // Add review to product
    product.reviews.push(review)

    // Calculate product ratings
    product.calculateAverageRating()

    await product.save()

    res.status(201).json({success: true, data: product})
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  updateProductStock,
  addProductReview,
}
