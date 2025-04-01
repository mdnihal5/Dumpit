const Shop = require('../models/shop.model')
const User = require('../models/user.model')
const Product = require('../models/product.model')
const {ErrorResponse} = require('../middlewares/error.middleware')
const {uploadImage, deleteImage} = require('../config/cloudinary')
const {UserRole} = require('../constants')

// @desc    Get all shops
// @route   GET /api/shops
// @access  Public
const getShops = async (req, res, next) => {
  try {
    console.log(`GET /api/shops`)

    // Copy req.query
    const reqQuery = {...req.query}

    // Fields to exclude from filtering
    const removeFields = ['select', 'sort', 'page', 'limit']
    removeFields.forEach((param) => delete reqQuery[param])

    // Create query string
    let queryStr = JSON.stringify(reqQuery)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)

    // Finding resource
    let query = Shop.find(JSON.parse(queryStr)).populate({
      path: 'owner',
      select: 'name email',
    })

    // Select fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ')
      query = query.select(fields)
    }

    // Sort
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
    const total = await Shop.countDocuments(JSON.parse(queryStr))

    query = query.skip(startIndex).limit(limit)

    // Execute query
    const shops = await query

    // Pagination result
    const pagination = {}

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      }
    }

    if (startIndex > 0) {
      pagination.prev = {page: page - 1, limit}
    }

    res.status(200).json({success: true, count: shops.length, pagination, data: shops})
  } catch (error) {
    next(error)
  }
}

// @desc    Get single shop
// @route   GET /api/shops/:id
// @access  Public
const getShop = async (req, res, next) => {
  try {
    console.log(`GET /api/shops/${req.params.id}`)

    const shop = await Shop.findById(req.params.id)
      .populate({
        path: 'owner',
        select: 'name email',
      })
      .populate({
        path: 'products',
        select: 'name price finalPrice images stock ratings numOfReviews',
      })

    if (!shop) {
      return next(new ErrorResponse(`Shop not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({success: true, data: shop})
  } catch (error) {
    next(error)
  }
}

// @desc    Create new shop
// @route   POST /api/shops
// @access  Private (Vendors and Admins)
const createShop = async (req, res, next) => {
  try {
    console.log(`POST /api/shops`)

    // Limit one shop per vendor, except for admins
    if (req.user?.role === UserRole.VENDOR) {
      const existingShop = await Shop.findOne({owner: req.user._id})

      if (existingShop) {
        return next(new ErrorResponse('Vendor already has a shop', 400))
      }
    }

    // Set owner to current user if not provided (for vendors)
    if (!req.body.owner && req.user?.role === UserRole.VENDOR) {
      req.body.owner = req.user._id
    }

    // Verify owner exists and is a vendor or admin
    if (req.body.owner) {
      const owner = await User.findById(req.body.owner)

      if (!owner) {
        return next(new ErrorResponse(`User not found with id of ${req.body.owner}`, 404))
      }

      if (owner.role !== UserRole.VENDOR && owner.role !== UserRole.ADMIN) {
        return next(new ErrorResponse('User must be a vendor or admin to own a shop', 403))
      }
    }

    const shop = await Shop.create(req.body)

    res.status(201).json({success: true, data: shop})
  } catch (error) {
    next(error)
  }
}

// @desc    Update shop
// @route   PUT /api/shops/:id
// @access  Private (Shop Owner and Admins)
const updateShop = async (req, res, next) => {
  try {
    console.log(`PUT /api/shops/${req.params.id}`)

    let shop = await Shop.findById(req.params.id)

    if (!shop) {
      return next(new ErrorResponse(`Shop not found with id of ${req.params.id}`, 404))
    }

    // Check if user is admin or shop owner
    if (req.user?.role !== UserRole.ADMIN && shop.owner.toString() !== req.user?._id.toString()) {
      return next(new ErrorResponse('User is not authorized to update this shop', 403))
    }

    // Prevent changing owner if not admin
    if (req.body.owner && req.user?.role !== UserRole.ADMIN) {
      return next(new ErrorResponse('Only admins can change shop ownership', 403))
    }

    shop = await Shop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({success: true, data: shop})
  } catch (error) {
    next(error)
  }
}

// @desc    Delete shop
// @route   DELETE /api/shops/:id
// @access  Private (Shop Owner and Admins)
const deleteShop = async (req, res, next) => {
  try {
    console.log(`DELETE /api/shops/${req.params.id}`)

    const shop = await Shop.findById(req.params.id)

    if (!shop) {
      return next(new ErrorResponse(`Shop not found with id of ${req.params.id}`, 404))
    }

    // Check if user is admin or shop owner
    if (req.user?.role !== UserRole.ADMIN && shop.owner.toString() !== req.user?._id.toString()) {
      return next(new ErrorResponse('User is not authorized to delete this shop', 403))
    }

    // Check if shop has products
    const products = await Product.countDocuments({shop: shop._id})

    if (products > 0) {
      return next(new ErrorResponse('Cannot delete shop with associated products', 400))
    }

    // Delete shop images from cloudinary
    for (const image of shop.images) {
      await deleteImage(image.public_id)
    }

    await shop.deleteOne()

    res.status(200).json({success: true, data: {}})
  } catch (error) {
    next(error)
  }
}

// @desc    Upload shop images
// @route   PUT /api/shops/:id/images
// @access  Private (Shop Owner and Admins)
const uploadShopImages = async (req, res, next) => {
  try {
    console.log(`PUT /api/shops/${req.params.id}/images`)

    const shop = await Shop.findById(req.params.id)

    if (!shop) {
      return next(new ErrorResponse(`Shop not found with id of ${req.params.id}`, 404))
    }

    // Check if user is admin or shop owner
    if (req.user?.role !== UserRole.ADMIN && shop.owner.toString() !== req.user?._id.toString()) {
      return next(new ErrorResponse('User is not authorized to update this shop', 403))
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

    // Add images to shop
    shop.images.push(...uploadedImages)
    await shop.save()

    res.status(200).json({success: true, data: shop})
  } catch (error) {
    next(error)
  }
}

// @desc    Add shop review
// @route   POST /api/shops/:id/reviews
// @access  Private (Customers)
const addShopReview = async (req, res, next) => {
  try {
    console.log(`POST /api/shops/${req.params.id}/reviews`)

    const {rating, comment} = req.body

    if (!rating || rating < 1 || rating > 5) {
      return next(new ErrorResponse('Please provide a rating between 1 and 5', 400))
    }

    const shop = await Shop.findById(req.params.id)

    if (!shop) {
      return next(new ErrorResponse(`Shop not found with id of ${req.params.id}`, 404))
    }

    // Check if user already reviewed this shop
    const alreadyReviewed = shop.reviews.find((review) => review.user.toString() === req.user?._id.toString())

    if (alreadyReviewed) {
      return next(new ErrorResponse('Shop already reviewed', 400))
    }

    const review = {
      user: req.user?._id,
      name: req.user?.name,
      rating: Number(rating),
      comment,
      createdAt: new Date(),
    }

    // Add review to shop
    shop.reviews.push(review)

    // Calculate shop ratings
    shop.calculateAverageRating()

    await shop.save()

    res.status(201).json({success: true, data: shop})
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getShops,
  getShop,
  createShop,
  updateShop,
  deleteShop,
  uploadShopImages,
  addShopReview,
}
