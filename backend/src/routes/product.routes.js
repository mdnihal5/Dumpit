const express = require('express')
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  updateProductStock,
  addProductReview,
} = require('../controllers/product.controller')
const {protect, authorize} = require('../middlewares/auth.middleware')
const {UserRole} = require('../constants')
const {validate} = require('../middlewares/validate.middleware')
const {
  getProductsSchema,
  getProductSchema,
  createProductSchema,
  updateProductSchema,
  deleteProductSchema,
  addProductReviewSchema,
  updateProductStockSchema,
  uploadProductImagesSchema,
} = require('../validation/product.schema')

const router = express.Router()

// Public routes
router.get('/', validate(getProductsSchema), getProducts)
router.get('/:id', validate(getProductSchema), getProduct)
router.post('/:id/reviews', validate(addProductReviewSchema), protect, authorize(UserRole.CUSTOMER), addProductReview)

// Protected routes - only vendors and admins
router.use(protect)
router.use(authorize(UserRole.VENDOR, UserRole.ADMIN))

// Product management routes
router.post('/', validate(createProductSchema), createProduct)
router.put('/:id', validate(updateProductSchema), updateProduct)
router.delete('/:id', validate(deleteProductSchema), deleteProduct)
router.put('/:id/images', validate(uploadProductImagesSchema), uploadProductImages)
router.put('/:id/stock', validate(updateProductStockSchema), updateProductStock)

module.exports = router
