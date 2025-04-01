const Razorpay = require('razorpay')
const config = require('../config')

/**
 * Initialize Razorpay instance with API keys
 * @returns {Razorpay|Object} Razorpay instance or mock object
 */
const setupRazorpay = () => {
  // Ensure environment variables are available
  if (!config.razorpay.keyId || !config.razorpay.keySecret) {
    console.warn('WARNING: Razorpay credentials not found in environment variables. Payment features will not work.')
    // Return a mock object for non-payment environments
    return {
      orders: {
        create: () => Promise.resolve({id: 'TEST_ORDER_ID'}),
        fetch: () => Promise.resolve({id: 'TEST_ORDER_ID', amount: 0}),
      },
      payments: {
        fetch: () => Promise.resolve({id: 'TEST_PAYMENT_ID', status: 'created'}),
        refund: () => Promise.resolve({id: 'TEST_REFUND_ID'}),
      },
    }
  }

  return new Razorpay({
    key_id: config.razorpay.keyId,
    key_secret: config.razorpay.keySecret,
  })
}

module.exports = setupRazorpay
