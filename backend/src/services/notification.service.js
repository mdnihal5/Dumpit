const { Notification, NotificationSettings } = require('../models/notification.model')

const createNotification = async (userId, title, message, type, relatedId, refModel) => {
  const notification = await Notification.create({
    user: userId,
    title,
    message,
    type,
    relatedId,
    refModel,
    read: false,
  })

  return notification
}

const getNotifications = async (userId) => {
  const notifications = await Notification.find({user: userId}).sort({createdAt: -1}).limit(50)

  return notifications
}

const markNotificationAsRead = async (notificationId) => {
  const notification = await Notification.findByIdAndUpdate(notificationId, {read: true}, {new: true})

  return notification
}

const markAllNotificationsAsRead = async (userId) => {
  await Notification.updateMany({user: userId, read: false}, {read: true})
}

const deleteNotification = async (notificationId) => {
  await Notification.findByIdAndDelete(notificationId)
}

const createOrderNotification = async (userId, orderId, status) => {
  return await createNotification(
    userId,
    `Order ${status}`,
    `Your order has been ${status.toLowerCase()}.`,
    'order',
    orderId,
    'Order'
  )
}

const createLowStockNotification = async (userId, productId, productName, stock) => {
  return await createNotification(
    userId,
    'Low Stock Alert',
    `Product "${productName}" is running low on stock (${stock} remaining).`,
    'stock',
    productId,
    'Product'
  )
}

const createPasswordResetNotification = async (userId) => {
  return await createNotification(
    userId,
    'Password Reset',
    'Your password has been reset successfully.',
    'password',
    null,
    'User'
  )
}

const getNotificationSettings = async (userId) => {
  let settings = await NotificationSettings.findOne({ user: userId });
  
  // If settings don't exist, create default settings
  if (!settings) {
    settings = await NotificationSettings.create({
      user: userId,
      orderUpdates: true,
      stockAlerts: true,
      passwordChanges: true,
      marketing: true,
      emailNotifications: true,
      pushNotifications: true
    });
  }
  
  return settings;
}

const updateNotificationSettings = async (userId, updatedSettings) => {
  // Find settings or create if they don't exist
  let settings = await NotificationSettings.findOne({ user: userId });
  
  if (!settings) {
    settings = await NotificationSettings.create({
      user: userId,
      ...updatedSettings
    });
    return settings;
  }
  
  // Update existing settings
  settings = await NotificationSettings.findOneAndUpdate(
    { user: userId },
    updatedSettings,
    { new: true }
  );
  
  return settings;
}

const clearAllNotifications = async (userId) => {
  await Notification.deleteMany({ user: userId });
}

module.exports = {
  createNotification,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  createOrderNotification,
  createLowStockNotification,
  createPasswordResetNotification,
  getNotificationSettings,
  updateNotificationSettings,
  clearAllNotifications
}
