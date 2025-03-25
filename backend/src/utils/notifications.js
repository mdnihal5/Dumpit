const admin = require("firebase-admin");
const User = require("../models/user.model");

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

/**
 * Send push notification to a specific user
 * @param {String} userId - User ID to send notification to
 * @param {Object} notification - Notification content
 * @param {String} notification.title - Notification title
 * @param {String} notification.body - Notification body
 * @param {Object} data - Additional data to send with notification
 * @returns {Promise<Object>} - FCM response
 */
exports.sendNotificationToUser = async (userId, notification, data = {}) => {
  try {
    // Get user's FCM token
    const user = await User.findById(userId);

    if (!user || !user.fcmToken) {
      console.log(`No FCM token found for user ${userId}`);
      return null;
    }

    // Prepare message
    const message = {
      token: user.fcmToken,
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: data,
      android: {
        notification: {
          sound: "default",
          click_action: "FLUTTER_NOTIFICATION_CLICK",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
          },
        },
      },
    };

    // Send message
    const response = await admin.messaging().send(message);
    console.log(`Notification sent to user ${userId}:`, response);

    return response;
  } catch (error) {
    console.error("Error sending notification:", error);
    return null;
  }
};

/**
 * Send push notification to multiple users
 * @param {Array} userIds - Array of user IDs to send notification to
 * @param {Object} notification - Notification content
 * @param {String} notification.title - Notification title
 * @param {String} notification.body - Notification body
 * @param {Object} data - Additional data to send with notification
 * @returns {Promise<Object>} - FCM response
 */
exports.sendNotificationToMultipleUsers = async (
  userIds,
  notification,
  data = {}
) => {
  try {
    // Get users' FCM tokens
    const users = await User.find({ _id: { $in: userIds } });

    // Filter valid FCM tokens
    const tokens = users
      .filter((user) => user.fcmToken)
      .map((user) => user.fcmToken);

    if (tokens.length === 0) {
      console.log("No valid FCM tokens found");
      return null;
    }

    // Prepare message
    const message = {
      tokens: tokens,
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: data,
      android: {
        notification: {
          sound: "default",
          click_action: "FLUTTER_NOTIFICATION_CLICK",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
          },
        },
      },
    };

    // Send message
    const response = await admin.messaging().sendMulticast(message);
    console.log(`Notification sent to ${response.successCount} users`);

    return response;
  } catch (error) {
    console.error("Error sending notification to multiple users:", error);
    return null;
  }
};

/**
 * Send notification for new order
 * @param {String} userId - User ID
 * @param {String} orderNumber - Order number
 * @returns {Promise<Object>} - FCM response
 */
exports.sendNewOrderNotification = async (userId, orderNumber) => {
  return this.sendNotificationToUser(
    userId,
    {
      title: "New Order Placed",
      body: `Your order #${orderNumber} has been placed successfully!`,
    },
    {
      type: "ORDER_PLACED",
      orderNumber: orderNumber,
    }
  );
};

/**
 * Send notification for order status update
 * @param {String} userId - User ID
 * @param {String} orderNumber - Order number
 * @param {String} status - New order status
 * @returns {Promise<Object>} - FCM response
 */
exports.sendOrderStatusNotification = async (userId, orderNumber, status) => {
  let title, body;

  switch (status) {
    case "confirmed":
      title = "Order Confirmed";
      body = `Your order #${orderNumber} has been confirmed!`;
      break;
    case "processing":
      title = "Order Processing";
      body = `Your order #${orderNumber} is being processed!`;
      break;
    case "ready_for_pickup":
      title = "Order Ready for Pickup";
      body = `Your order #${orderNumber} is ready for pickup!`;
      break;
    case "out_for_delivery":
      title = "Order Out for Delivery";
      body = `Your order #${orderNumber} is out for delivery!`;
      break;
    case "delivered":
      title = "Order Delivered";
      body = `Your order #${orderNumber} has been delivered!`;
      break;
    case "cancelled":
      title = "Order Cancelled";
      body = `Your order #${orderNumber} has been cancelled.`;
      break;
    default:
      title = "Order Update";
      body = `Your order #${orderNumber} status has been updated!`;
  }

  return this.sendNotificationToUser(
    userId,
    { title, body },
    {
      type: "ORDER_STATUS_UPDATED",
      orderNumber: orderNumber,
      status: status,
    }
  );
};

/**
 * Send notification to vendor for new order
 * @param {String} vendorUserId - Vendor user ID
 * @param {String} orderNumber - Order number
 * @returns {Promise<Object>} - FCM response
 */
exports.sendNewOrderToVendorNotification = async (
  vendorUserId,
  orderNumber
) => {
  return this.sendNotificationToUser(
    vendorUserId,
    {
      title: "New Order Received",
      body: `You've received a new order #${orderNumber}!`,
    },
    {
      type: "NEW_ORDER_RECEIVED",
      orderNumber: orderNumber,
    }
  );
};
