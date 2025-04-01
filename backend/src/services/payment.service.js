const Razorpay = require('razorpay')
const crypto = require('crypto')
const config = require('../config')
const setupRazorpay = require('../config/razorpay')

// Initialize Razorpay instance
const razorpay = setupRazorpay()

/**
 * Create a Razorpay order
 * @param {number} amount Amount in paise/cents
 * @param {string} currency Currency code (INR, USD, etc.)
 * @param {string} receipt Receipt ID
 * @param {Object} notes Additional notes
 * @returns {Promise<Object>} Razorpay order
 */
const createOrder = async (amount, currency = 'INR', receipt, notes = {}) => {
  try {
    const options = {
      amount: amount * 100, // convert to paise/cents
      currency,
      receipt,
      notes,
    }

    const order = await razorpay.orders.create(options)
    return order
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error)
    throw new Error('Failed to create payment order')
  }
}

/**
 * Verify payment signature
 * @param {string} orderId Razorpay order ID
 * @param {string} paymentId Razorpay payment ID
 * @param {string} signature Razorpay signature
 * @returns {boolean} Whether the signature is valid
 */
const verifyPayment = (orderId, paymentId, signature) => {
  const generatedSignature = crypto
    .createHmac('sha256', config.razorpay.keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')

  return generatedSignature === signature
}

/**
 * Get payment details
 * @param {string} paymentId Razorpay payment ID
 * @returns {Promise<Object>} Payment details
 */
const getPaymentById = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId)
    return payment
  } catch (error) {
    console.error('Razorpay Payment Fetch Error:', error)
    throw new Error('Failed to fetch payment details')
  }
}

/**
 * Refund a payment
 * @param {string} paymentId Razorpay payment ID
 * @param {number} amount Amount to refund (optional)
 * @param {Object} notes Additional notes (optional)
 * @returns {Promise<Object>} Refund details
 */
const refundPayment = async (paymentId, amount = null, notes = {}) => {
  try {
    const options = {notes}
    if (amount) {
      options.amount = amount * 100 // convert to paise/cents
    }

    const refund = await razorpay.payments.refund(paymentId, options)
    return refund
  } catch (error) {
    console.error('Razorpay Refund Error:', error)
    throw new Error('Failed to process refund')
  }
}

module.exports = {
  createOrder,
  verifyPayment,
  getPaymentById,
  refundPayment,
}
