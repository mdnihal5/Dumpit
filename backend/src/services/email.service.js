const nodemailer = require('nodemailer')
const config = require('../config')

/**
 * Create a transporter for sending emails
 * @returns {Object} Nodemailer transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    service: config.email.service,
    auth: {
      user: config.email.username,
      pass: config.email.password,
    },
  })
}

/**
 * Send a password reset email
 * @param {string} email - Recipient email address
 * @param {string} resetUrl - Password reset URL
 * @returns {Promise<void>}
 */
const sendPasswordResetEmail = async (email, resetUrl) => {
  try {
    const transporter = createTransporter()

    await transporter.sendMail({
      from: `${config.email.fromName} <${config.email.from}>`,
      to: email,
      subject: 'Password Reset',
      html: `
        <h1>Reset Your Password</h1>
        <p>You are receiving this email because you (or someone else) has requested to reset your password.</p>
        <p>Please click on the link below to reset your password. This link is valid for 10 minutes.</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <p>Regards,<br>The Dumpit Team</p>
      `,
    })

    console.log(`Password reset email sent to: ${email}`)
  } catch (error) {
    console.error('Error sending password reset email:', error)
    throw new Error('Failed to send password reset email')
  }
}

/**
 * Send an order confirmation email
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email address
 * @param {Object} options.order - Order details
 * @param {Object} options.user - User details
 * @returns {Promise<void>}
 */
const sendOrderConfirmationEmail = async ({email, order, user}) => {
  try {
    const transporter = createTransporter()

    // Create list of ordered items
    const items = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.product.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">₹${item.price.toFixed(2)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">₹${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `
      )
      .join('')

    await transporter.sendMail({
      from: `${config.email.fromName} <${config.email.from}>`,
      to: email,
      subject: `Order Confirmation #${order._id}`,
      html: `
        <h1>Thank you for your order!</h1>
        <p>Hello ${user.name},</p>
        <p>We have received your order and it is being processed. Here are your order details:</p>
        
        <h2>Order Information</h2>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        <p><strong>Order Status:</strong> ${order.status}</p>
        
        <h2>Items Ordered</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: left;">Quantity</th>
              <th style="padding: 10px; text-align: left;">Price</th>
              <th style="padding: 10px; text-align: left;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${items}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
              <td style="padding: 10px;">₹${order.itemsPrice.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right;"><strong>Tax:</strong></td>
              <td style="padding: 10px;">₹${order.taxPrice.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right;"><strong>Shipping:</strong></td>
              <td style="padding: 10px;">₹${order.shippingPrice.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
              <td style="padding: 10px;"><strong>₹${order.totalPrice.toFixed(2)}</strong></td>
            </tr>
          </tfoot>
        </table>
        
        <h2>Shipping Information</h2>
        <p>
          ${order.shippingAddress.name}<br>
          ${order.shippingAddress.address}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br>
          ${order.shippingAddress.country}<br>
          Phone: ${order.shippingAddress.phone}
        </p>
        
        <p>Thank you for shopping with us!</p>
        <p>Regards,<br>The Dumpit Team</p>
      `,
    })

    console.log(`Order confirmation email sent to: ${email}`)
  } catch (error) {
    console.error('Error sending order confirmation email:', error)
    throw new Error('Failed to send order confirmation email')
  }
}

module.exports = {
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
}
