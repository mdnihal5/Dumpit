const express = require('express')
const {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
  getNotificationSettings,
  updateNotificationSettings
} = require('../controllers/notification.controller')
const {protect} = require('../middlewares/auth.middleware')

const router = express.Router()

// All notification routes are protected
router.use(protect)

// Notification settings routes - needs to come before the general routes
router.get('/settings', getNotificationSettings)
router.put('/settings', updateNotificationSettings)

// Notification routes
router.get('/', getNotifications)
router.put('/:id', markNotificationAsRead)
router.put('/', markAllNotificationsAsRead)
router.delete('/:id', deleteNotification)
router.delete('/', clearAllNotifications)

module.exports = router
