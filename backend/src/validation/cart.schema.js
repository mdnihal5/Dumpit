const Joi = require('joi')
const { objectId } = require('./custom.validation')

// Schema for add to cart
const addToCartSchema = {
  body: Joi.object().keys({
    productId: Joi.string().required().custom(objectId),
    quantity: Joi.number().required().min(1).integer(),
  }),
}

// Schema for update cart item
const updateCartItemSchema = {
  params: Joi.object().keys({
    itemId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    quantity: Joi.number().required().min(0).integer(),
  }),
}

// Schema for remove cart item
const removeCartItemSchema = {
  params: Joi.object().keys({
    itemId: Joi.string().required().custom(objectId),
  }),
}

module.exports = {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
} 