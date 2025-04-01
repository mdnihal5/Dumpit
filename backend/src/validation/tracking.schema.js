const Joi = require('joi')
const { objectId } = require('./common.schema')
const { TrackingEventType } = require('../constants')

// Create tracking schema
const createTrackingSchema = {
  body: Joi.object({
    order: Joi.string().custom(objectId).required(),
    status: Joi.string().valid(...Object.values(TrackingEventType)).required(),
    location: Joi.string().required(),
    description: Joi.string().required()
  })
}

// Update tracking schema
const updateTrackingSchema = {
  body: Joi.object({
    status: Joi.string().valid(...Object.values(TrackingEventType)),
    location: Joi.string(),
    description: Joi.string()
  }),
  params: Joi.object({
    id: Joi.string().custom(objectId).required()
  })
}

// Get tracking schema
const getTrackingSchema = {
  params: Joi.object({
    id: Joi.string().custom(objectId).required()
  })
}

// Get tracking by order schema
const getTrackingByOrderSchema = {
  params: Joi.object({
    orderId: Joi.string().custom(objectId).required()
  })
}

module.exports = {
  createTrackingSchema,
  updateTrackingSchema,
  getTrackingSchema,
  getTrackingByOrderSchema
} 