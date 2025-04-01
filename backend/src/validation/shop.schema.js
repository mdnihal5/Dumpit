const Joi = require('joi')
const { imageSchema, objectId } = require('./common.schema')

// Shop base schema
const shopBaseSchema = {
  name: Joi.string().min(1).max(100).required(),
  description: Joi.string().min(1).max(2000).required(),
  address: Joi.string().min(1).required(),
  contactEmail: Joi.string().email().required(),
  contactPhone: Joi.string().required(),
  owner: Joi.string().custom(objectId).required(),
  logo: imageSchema
}

// Create shop schema
const createShopSchema = {
  body: Joi.object(shopBaseSchema)
}

// Update shop schema
const updateShopSchema = {
  body: Joi.object({
    name: Joi.string().min(1).max(100),
    description: Joi.string().min(1).max(2000),
    address: Joi.string().min(1),
    contactEmail: Joi.string().email(),
    contactPhone: Joi.string(),
    logo: imageSchema
  }),
  params: Joi.object({
    id: Joi.string().custom(objectId).required()
  })
}

// Delete shop schema
const deleteShopSchema = {
  params: Joi.object({
    id: Joi.string().custom(objectId).required()
  })
}

// Get shop schema
const getShopSchema = {
  params: Joi.object({
    id: Joi.string().custom(objectId).required()
  })
}

// Get shops schema with pagination
const getShopsSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    sort: Joi.string(),
    name: Joi.string(),
    owner: Joi.string().custom(objectId)
  })
}

module.exports = {
  createShopSchema,
  updateShopSchema,
  deleteShopSchema,
  getShopSchema,
  getShopsSchema
}
