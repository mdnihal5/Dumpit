const Joi = require('joi')
const { objectId } = require('./common.schema')

// Get notifications schema
const getNotificationsSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    isRead: Joi.boolean()
  })
}

// Mark notification as read schema
const markAsReadSchema = {
  params: Joi.object({
    id: Joi.string().custom(objectId).required()
  })
}

// Clear all notifications schema (no parameters needed, user is derived from token)
const clearAllSchema = {}

// Create notification schema (for internal use)
const createNotificationSchema = {
  body: Joi.object({
    user: Joi.string().custom(objectId).required(),
    title: Joi.string().required(),
    message: Joi.string().required(),
    type: Joi.string().required()
  })
}

module.exports = {
  getNotificationsSchema,
  markAsReadSchema,
  clearAllSchema,
  createNotificationSchema
}
