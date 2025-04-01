const { Notification } = require('../models/notification.model')
const {
  getNotifications: getNotificationsService,
  markNotificationAsRead: markNotificationAsReadService,
  markAllNotificationsAsRead: markAllNotificationsAsReadService,
  deleteNotification: deleteNotificationService,
  getNotificationSettings: getNotificationSettingsService,
  updateNotificationSettings: updateNotificationSettingsService,
  clearAllNotifications: clearAllNotificationsService
} = require('../services/notification.service')
const {ErrorResponse} = require('../middlewares/error.middleware')

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    console.log(`GET /api/notifications`)

    const notifications = await getNotificationsService(req.user._id)

    res.status(200).json({success: true, count: notifications.length, data: notifications})
  } catch (error) {
    next(error)
  }
}

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id
// @access  Private
const markNotificationAsRead = async (req, res, next) => {
  try {
    console.log(`PUT /api/notifications/${req.params.id}`)

    const notification = await markNotificationAsReadService(req.params.id)

    if (!notification) {
      return next(new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404))
    }

    // Check if user owns this notification
    if (notification.user.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('Not authorized to access this notification', 403))
    }

    res.status(200).json({success: true, data: notification})
  } catch (error) {
    next(error)
  }
}

// @desc    Mark all notifications as read
// @route   PUT /api/notifications
// @access  Private
const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    console.log(`PUT /api/notifications`)

    await markAllNotificationsAsReadService(req.user._id)

    res.status(200).json({success: true, message: 'All notifications marked as read'})
  } catch (error) {
    next(error)
  }
}

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res, next) => {
  try {
    console.log(`DELETE /api/notifications/${req.params.id}`)

    const notification = await Notification.findById(req.params.id)

    if (!notification) {
      return next(new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404))
    }

    // Check if user owns this notification
    if (notification.user.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('Not authorized to access this notification', 403))
    }

    await deleteNotificationService(req.params.id)

    res.status(200).json({success: true, data: {}})
  } catch (error) {
    next(error)
  }
}

// @desc    Clear all notifications for a user
// @route   DELETE /api/notifications
// @access  Private
const clearAllNotifications = async (req, res, next) => {
  try {
    console.log(`DELETE /api/notifications (clear all)`)

    await clearAllNotificationsService(req.user._id)

    res.status(200).json({success: true, message: 'All notifications cleared'})
  } catch (error) {
    next(error)
  }
}

// @desc    Get notification settings
// @route   GET /api/notifications/settings
// @access  Private
const getNotificationSettings = async (req, res, next) => {
  try {
    console.log(`GET /api/notifications/settings`)

    const settings = await getNotificationSettingsService(req.user._id)

    res.status(200).json({success: true, data: settings})
  } catch (error) {
    next(error)
  }
}

// @desc    Update notification settings
// @route   PUT /api/notifications/settings
// @access  Private
const updateNotificationSettings = async (req, res, next) => {
  try {
    console.log(`PUT /api/notifications/settings`)

    const settings = await updateNotificationSettingsService(req.user._id, req.body)

    res.status(200).json({success: true, data: settings})
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
  getNotificationSettings,
  updateNotificationSettings
}
