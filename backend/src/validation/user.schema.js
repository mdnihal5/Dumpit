const Joi = require('joi')
const { addressSchema, objectId } = require('./common.schema')
const { UserRole } = require('../constants')

// User base schema components
const userBaseSchema = {
  name: Joi.string().min(1).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(64).required(),
  role: Joi.string().valid(...Object.values(UserRole)).default(UserRole.CUSTOMER),
  avatar: Joi.object({
    public_id: Joi.string().required(),
    url: Joi.string().uri().required()
  }).optional()
}

// Registration schema
const registerUserSchema = {
  body: Joi.object({
    name: userBaseSchema.name,
    email: userBaseSchema.email,
    password: userBaseSchema.password,
    avatar: userBaseSchema.avatar
  })
}

// Login schema
const loginUserSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
}

// Update profile schema
const updateUserSchema = {
  body: Joi.object({
    name: Joi.string().min(1).max(50),
    email: Joi.string().email(),
    avatar: userBaseSchema.avatar
  }),
  params: Joi.object({
    id: Joi.string().custom(objectId).required()
  })
}

// Change password schema
const changePasswordSchema = {
  body: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).max(64).required()
  })
}

// Forgot password schema
const forgotPasswordSchema = {
  body: Joi.object({
    email: Joi.string().email().required()
  })
}

// Reset password schema
const resetPasswordSchema = {
  body: Joi.object({
    password: Joi.string().min(6).max(64).required()
  }),
  params: Joi.object({
    resetToken: Joi.string().required()
  })
}

// Add address schema
const addAddressSchema = {
  body: addressSchema
}

// Update address schema
const updateAddressSchema = {
  body: Joi.object(Object.fromEntries(
    Object.entries(addressSchema.describe().keys).map(([key]) => [key, addressSchema.extract(key).optional()])
  )),
  params: Joi.object({
    addressId: Joi.string().custom(objectId).required()
  })
}

// Get all users schema (for admin)
const getUsersSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10)
  })
}

// Get single user schema (for admin)
const getUserSchema = {
  params: Joi.object({
    id: Joi.string().custom(objectId).required()
  })
}

module.exports = {
  registerUserSchema,
  loginUserSchema,
  updateUserSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  addAddressSchema,
  updateAddressSchema,
  getUsersSchema,
  getUserSchema
}
