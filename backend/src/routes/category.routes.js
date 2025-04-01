const express = require('express')
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controller')
const {protect, authorize} = require('../middlewares/auth.middleware')
const {UserRole} = require('../constants')
const {validate} = require('../middlewares/validate.middleware')
const {
  getCategoriesSchema,
  getCategorySchema,
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
} = require('../validation/category.schema')

const router = express.Router()

// Public routes
router.get('/', validate(getCategoriesSchema), getCategories)
router.get('/:id', validate(getCategorySchema), getCategory)

// Protected routes - only admins
router.use(protect)
router.use(authorize(UserRole.ADMIN))

router.post('/', validate(createCategorySchema), createCategory)
router.put('/:id', validate(updateCategorySchema), updateCategory)
router.delete('/:id', validate(deleteCategorySchema), deleteCategory)

module.exports = router
