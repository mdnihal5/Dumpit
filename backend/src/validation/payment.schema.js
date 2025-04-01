const Joi = require('joi')

// Create order payment schema
const createOrderPaymentSchema = {
  body: Joi.object({
    amount: Joi.number().min(1).required(),
    currency: Joi.string().default('INR'),
    receipt: Joi.string(),
    notes: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
  }),
}

// Verify payment schema
const verifyPaymentSchema = {
  body: Joi.object({
    orderId: Joi.string().required(),
    paymentId: Joi.string().required(),
    signature: Joi.string().required(),
  }),
}

// Get payment by ID schema
const getPaymentByIdSchema = {
  params: Joi.object({
    paymentId: Joi.string().required(),
  }),
}

// Refund payment schema
const refundPaymentSchema = {
  body: Joi.object({
    paymentId: Joi.string().required(),
    amount: Joi.number().optional(),
    notes: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
  }),
}

module.exports = {
  createOrderPaymentSchema,
  verifyPaymentSchema,
  getPaymentByIdSchema,
  refundPaymentSchema,
}
