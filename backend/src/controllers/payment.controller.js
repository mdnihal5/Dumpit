const Payment = require("../models/payment.model");
const Order = require("../models/order.model");
// Uncomment when integrating with a real payment gateway
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * @desc    Create payment intent for order
 * @route   POST /api/payments/create-payment-intent
 * @access  Private
 */
exports.createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Please provide an order ID",
      });
    }

    // Find order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if order belongs to current user
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to make payment for this order",
      });
    }

    // Check if order is already paid
    if (order.isPaid) {
      return res.status(400).json({
        success: false,
        message: "Order is already paid",
      });
    }

    // For development, return mock payment intent data
    // In production, create a real payment intent with Stripe

    /* Uncomment for production with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.grandTotal * 100), // Convert to cents
      currency: 'inr',
      metadata: {
        orderId: order._id.toString(),
        userId: req.user.id
      }
    });
    */

    // Mock payment intent for development
    const mockPaymentIntent = {
      id: `pi_${Date.now()}`,
      client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substring(2, 10)}`,
      amount: Math.round(order.grandTotal * 100),
      currency: "inr",
      status: "requires_payment_method",
    };

    // Create payment record
    const payment = await Payment.create({
      order: order._id,
      user: req.user.id,
      paymentIntentId: mockPaymentIntent.id,
      amount: order.grandTotal,
      currency: "inr",
      status: "pending",
      paymentMethod: "card",
      metadata: {
        orderId: order._id.toString(),
      },
    });

    res.status(200).json({
      success: true,
      message: "Payment intent created successfully",
      data: {
        clientSecret: mockPaymentIntent.client_secret,
        paymentIntentId: mockPaymentIntent.id,
        amount: mockPaymentIntent.amount,
        currency: mockPaymentIntent.currency,
        paymentId: payment._id,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create payment intent",
      error: error.message,
    });
  }
};

/**
 * @desc    Confirm payment
 * @route   POST /api/payments/confirm-payment
 * @access  Private
 */
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    if (!paymentIntentId || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Please provide payment intent ID and order ID",
      });
    }

    // Find order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if order belongs to current user
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to confirm payment for this order",
      });
    }

    // Check if order is already paid
    if (order.isPaid) {
      return res.status(400).json({
        success: false,
        message: "Order is already paid",
      });
    }

    // Find payment
    const payment = await Payment.findOne({
      paymentIntentId,
      order: orderId,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // In production, verify payment with Stripe
    /* Uncomment for production with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }
    */

    // For development, mock successful payment

    // Update payment status
    payment.status = "completed";
    payment.paidAt = Date.now();
    await payment.save();

    // Update order status
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: paymentIntentId,
      status: "completed",
      update_time: Date.now(),
      payment_method: "card",
    };

    // If order was pending, update to processing
    if (order.status === "pending") {
      order.status = "processing";
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment confirmed successfully",
      data: {
        payment,
        order,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to confirm payment",
      error: error.message,
    });
  }
};

/**
 * @desc    Get user's payments
 * @route   GET /api/payments/my-payments
 * @access  Private
 */
exports.getMyPayments = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Find payments
    const payments = await Payment.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate("order", "orderNumber status");

    // Get total count
    const total = await Payment.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      message: "Payments retrieved successfully",
      data: {
        payments,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve payments",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all payments (admin)
 * @route   GET /api/payments
 * @access  Private/Admin
 */
exports.getAllPayments = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Filtering
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.paymentMethod) {
      filter.paymentMethod = req.query.paymentMethod;
    }

    if (req.query.fromDate && req.query.toDate) {
      filter.createdAt = {
        $gte: new Date(req.query.fromDate),
        $lte: new Date(req.query.toDate),
      };
    }

    // Find payments
    const payments = await Payment.find(filter)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate("user", "name email")
      .populate("order", "orderNumber status");

    // Get total count
    const total = await Payment.countDocuments(filter);

    // Calculate summary statistics
    const stats = await Payment.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          totalPayments: { $sum: 1 },
          avgAmount: { $avg: "$amount" },
        },
      },
    ]);

    const summary =
      stats.length > 0
        ? {
            totalAmount: stats[0].totalAmount,
            totalPayments: stats[0].totalPayments,
            avgAmount: parseFloat(stats[0].avgAmount.toFixed(2)),
          }
        : {
            totalAmount: 0,
            totalPayments: 0,
            avgAmount: 0,
          };

    res.status(200).json({
      success: true,
      message: "Payments retrieved successfully",
      data: {
        payments,
        summary,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve payments",
      error: error.message,
    });
  }
};

/**
 * @desc    Get payment by ID
 * @route   GET /api/payments/:id
 * @access  Private/Admin
 */
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("user", "name email")
      .populate("order");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment retrieved successfully",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve payment",
      error: error.message,
    });
  }
};

/**
 * @desc    Refund payment
 * @route   PUT /api/payments/:id/refund
 * @access  Private/Admin
 */
exports.refundPayment = async (req, res) => {
  try {
    const { reason } = req.body;

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Check if payment is already refunded
    if (payment.isRefunded) {
      return res.status(400).json({
        success: false,
        message: "Payment is already refunded",
      });
    }

    // Check if payment is completed
    if (payment.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Only completed payments can be refunded",
      });
    }

    // In production, process refund with Stripe
    /* Uncomment for production with Stripe
    const refund = await stripe.refunds.create({
      payment_intent: payment.paymentIntentId,
      reason: 'requested_by_customer'
    });
    */

    // For development, mock refund
    const mockRefund = {
      id: `re_${Date.now()}`,
      amount: payment.amount,
      status: "succeeded",
    };

    // Update payment
    payment.isRefunded = true;
    payment.refundedAt = Date.now();
    payment.refundReason = reason || "Requested by admin";
    payment.refundId = mockRefund.id;
    await payment.save();

    // Update order
    const order = await Order.findById(payment.order);
    if (order) {
      order.status = "refunded";
      await order.save();
    }

    res.status(200).json({
      success: true,
      message: "Payment refunded successfully",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to refund payment",
      error: error.message,
    });
  }
};
