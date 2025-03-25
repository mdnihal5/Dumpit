const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    paymentIntentId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "inr",
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "processing", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["card", "upi", "netbanking", "wallet", "cod"],
    },
    paidAt: {
      type: Date,
    },
    isRefunded: {
      type: Boolean,
      default: false,
    },
    refundedAt: {
      type: Date,
    },
    refundReason: {
      type: String,
    },
    refundId: {
      type: String,
    },
    metadata: {
      type: Object,
    },
    failureReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ order: 1 });
paymentSchema.index({ paymentIntentId: 1 }, { unique: true });
paymentSchema.index({ status: 1 });

module.exports = mongoose.model("Payment", paymentSchema);
