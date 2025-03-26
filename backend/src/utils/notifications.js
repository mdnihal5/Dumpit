const nodemailer = require("nodemailer");
const User = require("../models/user.model");

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send email notification to a specific user
 * @param {String} userId - User ID to send notification to
 * @param {Object} notification - Notification content
 * @param {String} notification.title - Notification title
 * @param {String} notification.body - Notification body
 * @param {Object} data - Additional data to send with notification
 * @returns {Promise<Object>} - Email response
 */
exports.sendNotificationToUser = async (userId, notification, data = {}) => {
  try {
    // Get user's email
    const user = await User.findById(userId);

    if (!user || !user.email) {
      console.log(`No email found for user ${userId}`);
      return null;
    }

    // Store notification in database
    await user.updateOne({
      $push: {
        notifications: {
          title: notification.title,
          body: notification.body,
          data: data,
          isRead: false,
          createdAt: new Date(),
        },
      },
    });

    // Format HTML email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4a90e2;">${notification.title}</h2>
        <p style="font-size: 16px; line-height: 1.5;">${notification.body}</p>
        ${data.actionUrl ? `<a href="${data.actionUrl}" style="display: inline-block; background-color: #4a90e2; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin-top: 15px;">View Details</a>` : ''}
        <p style="margin-top: 30px; font-size: 14px; color: #777;">Thank you for using DumpIt</p>
      </div>
    `;

    // Prepare mail options
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: notification.title,
      html: htmlContent,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to user ${userId}:`, info.messageId);

    return info;
  } catch (error) {
    console.error("Error sending email notification:", error);
    return null;
  }
};

/**
 * Send email notification to multiple users
 * @param {Array} userIds - Array of user IDs to send notification to
 * @param {Object} notification - Notification content
 * @param {String} notification.title - Notification title
 * @param {String} notification.body - Notification body
 * @param {Object} data - Additional data to send with notification
 * @returns {Promise<Array>} - Array of email responses
 */
exports.sendNotificationToMultipleUsers = async (
  userIds,
  notification,
  data = {}
) => {
  try {
    // Get users' emails
    const users = await User.find({ _id: { $in: userIds } });

    // Filter valid emails
    const validUsers = users.filter((user) => user.email);

    if (validUsers.length === 0) {
      console.log("No valid emails found");
      return null;
    }

    // Format HTML email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4a90e2;">${notification.title}</h2>
        <p style="font-size: 16px; line-height: 1.5;">${notification.body}</p>
        ${data.actionUrl ? `<a href="${data.actionUrl}" style="display: inline-block; background-color: #4a90e2; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin-top: 15px;">View Details</a>` : ''}
        <p style="margin-top: 30px; font-size: 14px; color: #777;">Thank you for using DumpIt</p>
      </div>
    `;

    // Store notifications in database for each user
    await User.updateMany(
      { _id: { $in: userIds } },
      {
        $push: {
          notifications: {
            title: notification.title,
            body: notification.body,
            data: data,
            isRead: false,
            createdAt: new Date(),
          },
        },
      }
    );

    // Send emails to each user
    const emailPromises = validUsers.map((user) => {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: notification.title,
        html: htmlContent,
      };

      return transporter.sendMail(mailOptions);
    });

    const results = await Promise.all(emailPromises);
    console.log(`Email notifications sent to ${results.length} users`);

    return results;
  } catch (error) {
    console.error("Error sending notification to multiple users:", error);
    return null;
  }
};

/**
 * Send notification for new order
 * @param {String} userId - User ID
 * @param {String} orderNumber - Order number
 * @returns {Promise<Object>} - Email response
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
      actionUrl: `${process.env.FRONTEND_URL || 'https://dumpit.com'}/orders/${orderNumber}`,
    }
  );
};

/**
 * Send notification for order status update
 * @param {String} userId - User ID
 * @param {String} orderNumber - Order number
 * @param {String} status - New order status
 * @returns {Promise<Object>} - Email response
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
      actionUrl: `${process.env.FRONTEND_URL || 'https://dumpit.com'}/orders/${orderNumber}`,
    }
  );
};

/**
 * Send notification to vendor for new order
 * @param {String} vendorUserId - Vendor user ID
 * @param {String} orderNumber - Order number
 * @returns {Promise<Object>} - Email response
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
      actionUrl: `${process.env.FRONTEND_URL || 'https://dumpit.com'}/vendor/orders/${orderNumber}`,
    }
  );
};
