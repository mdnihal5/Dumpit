const Joi = require('joi')
const { OrderStatus } = require('../constants')

// Schema for getting all orders
const getOrdersSchema = {
  query: Joi.object({
    limit: Joi.number().integer().min(1),
    page: Joi.number().integer().min(1),
    status: Joi.string().valid(...Object.values(OrderStatus)),
    sortBy: Joi.string(),
    sortOrder: Joi.string().valid('asc', 'desc'),
  }),
}

// Schema for getting a single order
const getOrderSchema = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
}

// Schema for getting user orders
const getUserOrdersSchema = {
  query: Joi.object({
    limit: Joi.number().integer().min(1),
    page: Joi.number().integer().min(1),
    status: Joi.string().valid(...Object.values(OrderStatus)),
    sortBy: Joi.string(),
    sortOrder: Joi.string().valid('asc', 'desc'),
  }),
}

// Schema for creating a new order
const createOrderSchema = {
  body: Joi.object({
    orderItems: Joi.array()
      .items(
        Joi.object({
          product: Joi.string().required(),
          name: Joi.string().required(),
          price: Joi.number().required(),
          quantity: Joi.number().integer().required(),
          image: Joi.string(),
        })
      )
      .required(),
    shippingAddress: Joi.object({
      address: Joi.string().required(),
      city: Joi.string().required(),
      postalCode: Joi.string().required(),
      country: Joi.string().required(),
      phone: Joi.string().required(),
    }).required(),
    paymentInfo: Joi.object({
      id: Joi.string(),
      status: Joi.string(),
      method: Joi.string().required(),
    }).required(),
    taxAmount: Joi.number().default(0),
    shippingAmount: Joi.number().default(0),
    totalAmount: Joi.number().required(),
  }),
}

// Schema for creating an order from cart
const createOrderFromCartSchema = {
  body: Joi.object({
    shippingAddress: Joi.object({
      name: Joi.string().required(),
      address: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      postalCode: Joi.string().required(),
      country: Joi.string().required(),
      phone: Joi.string().required(),
    }).required(),
    paymentInfo: Joi.object({
      id: Joi.string(),
      status: Joi.string(),
      method: Joi.string().required(),
    }).required(),
    taxAmount: Joi.number().default(0),
    shippingAmount: Joi.number().default(0),
  }),
}

// Schema for updating order status
const updateOrderStatusSchema = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
  body: Joi.object({
    orderStatus: Joi.string()
      .valid(...Object.values(OrderStatus))
      .required(),
  }),
}

// Schema for cancelling an order
const cancelOrderSchema = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
}

module.exports = {
  getOrdersSchema,
  getOrderSchema,
  createOrderSchema,
  updateOrderStatusSchema,
  cancelOrderSchema,
  getUserOrdersSchema,
  createOrderFromCartSchema,
}