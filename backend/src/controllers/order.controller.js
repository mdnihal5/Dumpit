const Order = require("../models/order.model");
const Product = require("../models/product.model");

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private
 */
exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      deliveryType = "delivery",
      vendorId,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please add at least one item to your order",
      });
    }

    if (deliveryType === "delivery" && !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required for delivery orders",
      });
    }

    // Calculate order totals
    let itemsPrice = 0;
    let taxAmount = 0;
    const processedItems = [];

    // Verify products and calculate prices
    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }

      if (product.status === "outOfStock") {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock`,
        });
      }

      // Calculate price (with discount if applicable)
      let price = product.pricePerUnit;
      if (
        product.discount &&
        new Date(product.discount.validUntil) > new Date()
      ) {
        price = price - (price * product.discount.percentage) / 100;
      }

      const itemTotal = price * item.quantity;
      itemsPrice += itemTotal;

      // Calculate tax
      const itemTax = itemTotal * (product.taxPercentage / 100);
      taxAmount += itemTax;

      // Add to processed items
      processedItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        pricePerUnit: price,
        taxPercentage: product.taxPercentage,
        taxAmount: itemTax,
        totalPrice: itemTotal,
        vendor: product.vendor,
      });
    }

    // Set delivery fee
    let deliveryFee = deliveryType === "delivery" ? 50 : 0; // Default delivery fee

    // Calculate grand total
    const grandTotal = itemsPrice + taxAmount + deliveryFee;

    // Create order
    const order = await Order.create({
      user: req.user.id,
      vendor: vendorId,
      orderNumber: "ORD" + Date.now(),
      items: processedItems,
      shippingAddress,
      paymentMethod,
      deliveryType,
      itemsPrice,
      taxAmount,
      deliveryFee,
      grandTotal,
      status: paymentMethod === "COD" ? "processing" : "pending",
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

/**
 * @desc    Get user's orders
 * @route   GET /api/orders/my-orders
 * @access  Private
 */
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("vendor", "businessName logo");

    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve orders",
      error: error.message,
    });
  }
};

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("vendor", "businessName logo phone email address")
      .populate("user", "name email phone");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if order belongs to current user or vendor
    if (
      order.user._id.toString() !== req.user.id &&
      req.user.role !== "admin" &&
      order.vendor._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this order",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order retrieved successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve order",
      error: error.message,
    });
  }
};

/**
 * @desc    Cancel order
 * @route   PUT /api/orders/:id/cancel
 * @access  Private
 */
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

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
        message: "You are not authorized to cancel this order",
      });
    }

    // Check if order can be cancelled
    if (!["pending", "processing"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled when in ${order.status} status`,
      });
    }

    // Update order status
    order.status = "cancelled";
    order.cancelledAt = Date.now();
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message,
    });
  }
};

/**
 * @desc    Get vendor orders
 * @route   GET /api/orders/vendor
 * @access  Private/Vendor
 */
exports.getVendorOrders = async (req, res) => {
  try {
    // Get vendor ID (vendor's user ID)
    const vendorId = req.user.id;

    // Filter by status if provided
    const filter = { vendor: vendorId };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Get orders
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate("user", "name email phone");

    // Get total count
    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Vendor orders retrieved successfully",
      data: {
        orders,
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
      message: "Failed to retrieve vendor orders",
      error: error.message,
    });
  }
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private/Vendor/Admin
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Please provide a status",
      });
    }

    // Valid status values
    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if vendor owns this order
    if (req.user.role === "vendor" && order.vendor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this order",
      });
    }

    // Update timestamps based on status
    if (status === "shipped" && !order.shippedAt) {
      order.shippedAt = Date.now();
    } else if (status === "delivered" && !order.deliveredAt) {
      order.deliveredAt = Date.now();
      order.isPaid = true;
      order.paidAt = Date.now();
    } else if (status === "cancelled" && !order.cancelledAt) {
      order.cancelledAt = Date.now();
    }

    // Update status
    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all orders (admin)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
exports.getAllOrders = async (req, res) => {
  try {
    // Filter by status if provided
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.vendor) {
      filter.vendor = req.query.vendor;
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Get orders
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate("user", "name email")
      .populate("vendor", "businessName");

    // Get total count
    const total = await Order.countDocuments(filter);

    // Calculate grand totals
    const grandTotals = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$grandTotal" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const stats =
      grandTotals.length > 0
        ? grandTotals[0]
        : { totalSales: 0, totalOrders: 0 };

    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: {
        orders,
        stats,
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
      message: "Failed to retrieve orders",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete order (admin only)
 * @route   DELETE /api/orders/:id
 * @access  Private/Admin
 */
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.remove();

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete order",
      error: error.message,
    });
  }
};
