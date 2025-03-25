const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Please add a rating"],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: [true, "Please add a title"],
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    comment: {
      type: String,
      required: [true, "Please add a comment"],
      maxlength: [500, "Comment cannot be more than 500 characters"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: function () {
        return !this.vendor;
      },
    },
    vendor: {
      type: mongoose.Schema.ObjectId,
      ref: "Vendor",
      required: function () {
        return !this.product;
      },
    },
    images: [{
      type: String,
    }],
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from submitting more than one review per product/vendor
reviewSchema.index({ product: 1, user: 1 }, { unique: true, sparse: true });
reviewSchema.index({ vendor: 1, user: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Review", reviewSchema); 