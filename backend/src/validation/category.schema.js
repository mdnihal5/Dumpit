const Joi = require('joi')
const { objectId, imageSchema } = require('./common.schema')

// Category base schema
const categoryBaseSchema = {
  name: Joi.string().min(1).max(50).required(),
  description: Joi.string().min(1).max(500).required(),
  image: imageSchema
}

// Create category schema
const createCategorySchema = {
  body: Joi.object(categoryBaseSchema)
}

// Update category schema
const updateCategorySchema = {
  body: Joi.object({
    name: Joi.string().min(1).max(50),
    description: Joi.string().min(1).max(500),
    image: imageSchema
  }),
  params: Joi.object({
    id: Joi.string().custom(objectId).required()
  })
}

// Delete category schema
const deleteCategorySchema = {
  params: Joi.object({
    id: Joi.string().custom(objectId).required()
  })
}

// Get category schema
const getCategorySchema = {
  params: Joi.object({
    id: Joi.string().custom(objectId).required()
  })
}

// Get categories schema
const getCategoriesSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    sort: Joi.string(),
    name: Joi.string()
  })
}

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
  getCategorySchema,
  getCategoriesSchema
}
