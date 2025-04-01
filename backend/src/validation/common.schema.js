const Joi = require('joi')
const { Types } = require('mongoose')

// Custom Joi validation for ObjectId
const objectId = (value, helpers) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.message('Invalid ObjectId format')
  }
  return value
}

// Common schema objects for reuse
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),
  sort: Joi.string(),
  select: Joi.string(),
})

const imageSchema = Joi.object({
  public_id: Joi.string().required(),
  url: Joi.string().uri().required().messages({
    'string.uri': 'Invalid URL format',
  }),
})

const addressSchema = Joi.object({
  street: Joi.string().required().messages({
    'any.required': 'Street is required',
    'string.empty': 'Street is required',
  }),
  city: Joi.string().required().messages({
    'any.required': 'City is required',
    'string.empty': 'City is required',
  }),
  state: Joi.string().required().messages({
    'any.required': 'State is required',
    'string.empty': 'State is required',
  }),
  postalCode: Joi.string().required().messages({
    'any.required': 'Postal code is required',
    'string.empty': 'Postal code is required',
  }),
  country: Joi.string().required().messages({
    'any.required': 'Country is required',
    'string.empty': 'Country is required',
  }),
  isDefault: Joi.boolean().default(false),
})

const reviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().min(1).max(500).required(),
})

module.exports = {
  objectId,
  paginationSchema,
  imageSchema,
  addressSchema,
  reviewSchema,
}
