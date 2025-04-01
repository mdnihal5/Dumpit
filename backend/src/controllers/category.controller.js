const Category = require('../models/category.model')
const {ErrorResponse} = require('../middlewares/error.middleware')

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    console.log(`GET /api/categories`)

    const categories = await Category.find().sort('name')

    res.status(200).json({success: true, count: categories.length, data: categories})
  } catch (error) {
    next(error)
  }
}

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
const getCategory = async (req, res, next) => {
  try {
    console.log(`GET /api/categories/${req.params.id}`)

    const category = await Category.findById(req.params.id).populate({
      path: 'products',
      select: 'name price finalPrice images stock ratings',
    })

    if (!category) {
      return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({success: true, data: category})
  } catch (error) {
    next(error)
  }
}

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin)
const createCategory = async (req, res, next) => {
  try {
    console.log(`POST /api/categories`)

    // Check if category already exists
    const existingCategory = await Category.findOne({name: req.body.name})

    if (existingCategory) {
      return next(new ErrorResponse(`Category with name ${req.body.name} already exists`, 400))
    }

    const category = await Category.create(req.body)

    res.status(201).json({
      success: true,
      data: category,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
const updateCategory = async (req, res, next) => {
  try {
    console.log(`PUT /api/categories/${req.params.id}`)

    let category = await Category.findById(req.params.id)

    if (!category) {
      return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404))
    }

    // Check if new name conflicts with existing category
    if (req.body.name) {
      const existingCategory = await Category.findOne({
        name: req.body.name,
        _id: {$ne: req.params.id},
      })

      if (existingCategory) {
        return next(new ErrorResponse(`Category with name ${req.body.name} already exists`, 400))
      }
    }

    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: category,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
const deleteCategory = async (req, res, next) => {
  try {
    console.log(`DELETE /api/categories/${req.params.id}`)

    const category = await Category.findById(req.params.id)

    if (!category) {
      return next(new ErrorResponse(`Category not found with id of ${req.params.id}`, 404))
    }

    // Check if category has products
    if (category.products.length > 0) {
      return next(new ErrorResponse(`Cannot delete category with associated products`, 400))
    }

    await category.deleteOne()

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
}
