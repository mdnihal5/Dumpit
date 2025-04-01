const mongoose = require('mongoose')
const {Schema} = mongoose

const notificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ['order', 'stock', 'password', 'other'],
      default: 'other',
    },
    relatedId: {
      type: Schema.Types.ObjectId,
    },
    refModel: {
      type: String,
      enum: ['Order', 'Product', 'User'],
      default: 'User',
    },
  },
  {timestamps: true}
)

// Create a separate schema for notification settings
const notificationSettingsSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    orderUpdates: {
      type: Boolean,
      default: true,
    },
    stockAlerts: {
      type: Boolean,
      default: true,
    },
    passwordChanges: {
      type: Boolean,
      default: true,
    },
    marketing: {
      type: Boolean,
      default: true,
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    pushNotifications: {
      type: Boolean,
      default: true,
    }
  },
  {timestamps: true}
)

const Notification = mongoose.model('Notification', notificationSchema)
const NotificationSettings = mongoose.model('NotificationSettings', notificationSettingsSchema)

module.exports = {
  Notification,
  NotificationSettings
}
