const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
        unit: {
          type: String,
          required: true,
        },
        pricePerUnit: {
          type: Number,
          required: true,
        },
        totalPrice: {
          type: Number,
          required: true,
        },
        taxPercentage: {
          type: Number,
          required: true,
        },
        taxAmount: {
          type: Number,
          required: true,
        },
      },
    ],
    delivery: {
      address: {
        type: {
          type: String,
          enum: ["home", "office", "other"],
        },
        street: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        zipCode: {
          type: String,
          required: true,
        },
        coordinates: {
          latitude: Number,
          longitude: Number,
        },
      },
      contactPhone: {
        type: String,
        required: true,
      },
      instructions: {
        type: String,
        default: "",
      },
      type: {
        type: String,
        enum: ["delivery", "pickup"],
        default: "delivery",
      },
      charge: {
        type: Number,
        default: 0,
      },
      expectedDate: {
        type: Date,
      },
      actualDate: {
        type: Date,
      },
      partner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryPartner",
      },
      trackingId: {
        type: String,
      },
    },
    billing: {
      subtotal: {
        type: Number,
        required: true,
      },
      taxTotal: {
        type: Number,
        required: true,
      },
      deliveryCharge: {
        type: Number,
        required: true,
        default: 0,
      },
      discount: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },
    payment: {
      method: {
        type: String,
        enum: ["card", "upi", "netbanking", "wallet", "cod", "other"],
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded", "partially_refunded"],
        default: "pending",
      },
      transactionId: {
        type: String,
      },
      gatewayResponse: mongoose.Schema.Types.Mixed,
      paidAt: {
        type: Date,
      },
      refundedAt: {
        type: Date,
      },
      invoiceUrl: {
        type: String,
      },
    },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "confirmed",
        "ready_for_pickup",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "returned",
        "refunded",
      ],
      default: "pending",
    },
    cancellation: {
      isCancelled: {
        type: Boolean,
        default: false,
      },
      reason: {
        type: String,
      },
      cancelledBy: {
        type: String,
        enum: ["user", "vendor", "admin", "system"],
      },
      cancelledAt: {
        type: Date,
      },
    },
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        comment: String,
      },
    ],
    notes: [
      {
        text: {
          type: String,
          required: true,
        },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        isPrivate: {
          type: Boolean,
          default: false,
        },
      },
    ],
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
      },
      createdAt: {
        type: Date,
      },
    },
    isGift: {
      type: Boolean,
      default: false,
    },
    giftMessage: {
      type: String,
    },
    source: {
      type: String,
      enum: ["app", "web", "phone", "other"],
      default: "app",
    },
  },
  {
    timestamps: true,
  }
);

// Generate order number before saving
orderSchema.pre("save", async function (next) {
  // Only generate order number for new orders
  if (!this.isNew) {
    return next();
  }

  try {
    // Get current date in YYYYMMDD format
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const datePrefix = `${year}${month}${day}`;

    // Get the count of orders created today
    const Order = this.constructor;
    const regex = new RegExp(`^DMP${datePrefix}`);
    const todayOrders = await Order.countDocuments({
      orderNumber: { $regex: regex },
    });

    // Generate order number: DMP + YYYYMMDD + 4-digit sequential number
    const sequentialNumber = String(todayOrders + 1).padStart(4, "0");
    this.orderNumber = `DMP${datePrefix}${sequentialNumber}`;

    // Add initial status to history
    if (this.statusHistory.length === 0) {
      this.statusHistory.push({
        status: this.status,
        timestamp: new Date(),
        updatedBy: this.user,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Update status history when status changes
orderSchema.pre("save", function (next) {
  // Check if status is modified and it's not a new document
  if (this.isModified("status") && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      updatedBy: this.updatedBy || this.user, // Assuming updatedBy is set before saving
    });
  }

  next();
});

// Virtual for checking if order is active
orderSchema.virtual("isActive").get(function () {
  const activeStatuses = [
    "pending",
    "processing",
    "confirmed",
    "ready_for_pickup",
    "out_for_delivery",
  ];
  return activeStatuses.includes(this.status);
});

// Index for faster queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ vendor: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ "payment.status": 1 });

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
