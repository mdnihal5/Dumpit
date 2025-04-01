const Joi = require('joi')
const { imageSchema, reviewSchema, objectId } = require('./common.schema')

// Product base schema components
const productBaseSchema = {
  name: Joi.string().min(1).max(100).required(),
  description: Joi.string().min(1).max(2000).required(),
  price: Joi.number().min(0).required(),
  discount: Joi.number().min(0).max(100).default(0),
  stock: Joi.number().min(0).required(),
  category: Joi.string().custom(objectId).required(),
  shop: Joi.string().custom(objectId).required(),
}

// Create product schema
const createProductSchema = {
  body: Joi.object(productBaseSchema)
}

// Update product schema
const updateProductSchema = {
  body: Joi.object({
    name: Joi.string().min(1).max(100),
    description: Joi.string().min(1).max(2000),
    price: Joi.number().min(0),
    discount: Joi.number().min(0).max(100),
    stock: Joi.number().min(0),
    category: Joi.string().custom(objectId),
    shop: Joi.string().custom(objectId),
  }),
  params: Joi.object({
    id: Joi.string().custom(objectId).required()
  })
}

// Delete product schema
const deleteProductSchema = {
  params: Joi.object({
    id: Joi.string().custom(objectId).required()
  })
}

// Get product schema
const getProductSchema = {
  params: Joi.object({
    id: Joi.string().custom(objectId).required()
  })
}

// Get products schema with filtering and pagination
const getProductsSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    sort: Joi.string(),
    select: Joi.string(),
    name: Joi.string(),
    category: Joi.string().custom(objectId),
    shop: Joi.string().custom(objectId),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),
    minRating: Joi.number().min(0).max(5)
  })
}

// Add product review schema
const addProductReviewSchema = {
  body: reviewSchema,
  params: Joi.object({
    id: Joi.string().custom(objectId).required()
  })
}

// Update product stock schema
const updateProductStockSchema = {
  body: Joi.object({
    stock: Joi.number().min(0).required()
  }),
  params: Joi.object({
    id: Joi.string().custom(objectId).required()
  })
}

// Upload product images schema
const uploadProductImagesSchema = {
  params: Joi.object({
    id: Joi.string().custom(objectId).required()
  })
}

module.exports = {
  createProductSchema,
  updateProductSchema,
  deleteProductSchema,
  getProductSchema,
  getProductsSchema,
  addProductReviewSchema,
  updateProductStockSchema,
  uploadProductImagesSchema
}
