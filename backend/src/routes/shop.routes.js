const express = require('express')
const {
  getShops,
  getShop,
  createShop,
  updateShop,
  deleteShop,
  uploadShopImages,
  addShopReview,
} = require('../controllers/shop.controller')
const {protect, authorize} = require('../middlewares/auth.middleware')
const {UserRole} = require('../constants')
const {validate} = require('../middlewares/validate.middleware')
const {
  getShopsSchema,
  getShopSchema,
  createShopSchema,
  updateShopSchema,
  deleteShopSchema,
  addShopReviewSchema,
  uploadShopImagesSchema,
} = require('../validation/shop.schema')

const router = express.Router()

// Public routes
router.get('/', validate(getShopsSchema), getShops)
router.get('/:id', validate(getShopSchema), getShop)
router.post('/:id/reviews', validate(addShopReviewSchema), protect, authorize(UserRole.CUSTOMER), addShopReview)

// Protected routes - vendors can only manage their own shops
router.use(protect)
router.use(authorize(UserRole.VENDOR, UserRole.ADMIN))

router.post('/', validate(createShopSchema), createShop)
router.put('/:id', validate(updateShopSchema), updateShop)
router.delete('/:id', validate(deleteShopSchema), deleteShop)
router.put('/:id/images', validate(uploadShopImagesSchema), uploadShopImages)

module.exports = router
