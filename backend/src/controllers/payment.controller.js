const Payment = require("../models/payment.model");
const Order = require("../models/order.model");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const asyncHandler = require("../utils/asyncHandler");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

/**
 * @desc    Create payment intent for order
 * @route   POST /api/payments/create-payment-intent
 * @access  Private
 */
exports.createPaymentIntent = asyncHandler(async (req, res) => {
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

  // Create Razorpay order
  const amountInPaise = Math.round(order.grandTotal * 100); // Convert to paise
  const razorpayOrder = await razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: order._id.toString(),
    notes: {
      orderId: order._id.toString(),
      userId: req.user.id,
    },
  });

  // Create payment record
  const payment = await Payment.create({
    order: order._id,
    user: req.user.id,
    paymentIntentId: razorpayOrder.id,
    amount: order.grandTotal,
    currency: "INR",
    status: "pending",
    paymentMethod: "razorpay",
    metadata: {
      orderId: order._id.toString(),
      razorpayOrderId: razorpayOrder.id,
    },
  });

  res.status(200).json({
    success: true,
    message: "Payment order created successfully",
    data: {
      razorpayOrderId: razorpayOrder.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      amount: amountInPaise,
      currency: razorpayOrder.currency,
      paymentId: payment._id,
      orderId: order._id,
      notes: razorpayOrder.notes,
    },
  });
});

/**
 * @desc    Verify Razorpay payment
 * @route   POST /api/payments/verify-payment
 * @access  Private
 */
exports.verifyPayment = asyncHandler(async (req, res) => {
  const { 
    razorpayOrderId, 
    razorpayPaymentId, 
    razorpaySignature,
    orderId 
  } = req.body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !orderId) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required payment verification details",
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
      message: "You are not authorized to verify payment for this order",
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
    paymentIntentId: razorpayOrderId,
    order: orderId,
  });

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: "Payment not found",
    });
  }

  // Verify Razorpay signature
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (generatedSignature !== razorpaySignature) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment signature",
    });
  }

  // Update payment status
  payment.status = "completed";
  payment.paidAt = Date.now();
  payment.transactionId = razorpayPaymentId;
  await payment.save();

  // Update order status
  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: razorpayPaymentId,
    status: "completed",
    update_time: Date.now(),
    payment_method: "razorpay",
  };

  // If order was pending, update to processing
  if (order.status === "pending") {
    order.status = "processing";
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: "Payment verified successfully",
    data: {
      payment,
      order,
    },
  });
});

/**
 * @desc    Get user's payments
 * @route   GET /api/payments/my-payments
 * @access  Private
 */
exports.getMyPayments = asyncHandler(async (req, res) => {
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
});

/**
 * @desc    Get all payments (admin)
 * @route   GET /api/payments
 * @access  Private/Admin
 */
exports.getAllPayments = asyncHandler(async (req, res) => {
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
});

/**
 * @desc    Get payment by ID
 * @route   GET /api/payments/:id
 * @access  Private/Admin
 */
exports.getPaymentById = asyncHandler(async (req, res) => {
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
});

/**
 * @desc    Refund payment
 * @route   PUT /api/payments/:id/refund
 * @access  Private/Admin
 */
exports.refundPayment = asyncHandler(async (req, res) => {
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

  // Process refund with Razorpay
  const refund = await razorpay.payments.refund(payment.transactionId, {
    amount: Math.round(payment.amount * 100), // Convert to paise
    notes: {
      reason: reason || "Requested by admin",
      paymentId: payment._id.toString(),
      orderId: payment.order.toString(),
    },
  });

  // Update payment
  payment.isRefunded = true;
  payment.refundedAt = Date.now();
  payment.refundReason = reason || "Requested by admin";
  payment.refundId = refund.id;
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
});
