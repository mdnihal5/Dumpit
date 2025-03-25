const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: [
        "cement",
        "steel",
        "bricks",
        "sand",
        "aggregate",
        "paint",
        "plumbing",
        "electrical",
        "tiles",
        "wood",
        "glass",
        "hardware",
        "tools",
        "other",
      ],
    },
    subCategory: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    manufacturerName: {
      type: String,
      trim: true,
    },
    baseUnit: {
      type: String,
      required: [true, "Base unit is required"],
      enum: [
        "kg",
        "gram",
        "piece",
        "liter",
        "milliliter",
        "meter",
        "centimeter",
        "square_meter",
        "cubic_meter",
        "sheet",
        "roll",
        "box",
        "pack",
      ],
    },
    pricePerUnit: {
      type: Number,
      required: [true, "Price per unit is required"],
      min: [0, "Price cannot be negative"],
    },
    minOrderQuantity: {
      type: Number,
      required: [true, "Minimum order quantity is required"],
      min: [1, "Minimum order quantity must be at least 1"],
    },
    bulkPricing: [
      {
        minQuantity: {
          type: Number,
          required: true,
        },
        pricePerUnit: {
          type: Number,
          required: true,
          min: [0, "Price cannot be negative"],
        },
      },
    ],
    inventory: {
      available: {
        type: Number,
        required: [true, "Available inventory is required"],
        min: [0, "Available inventory cannot be negative"],
        default: 0,
      },
      reserved: {
        type: Number,
        default: 0,
        min: [0, "Reserved inventory cannot be negative"],
      },
      total: {
        type: Number,
        min: [0, "Total inventory cannot be negative"],
      },
      lowStockThreshold: {
        type: Number,
        default: 10,
      },
      isLowStock: {
        type: Boolean,
        default: false,
      },
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    specifications: mongoose.Schema.Types.Mixed,
    hsn: {
      type: String, // Harmonized System Nomenclature code
      trim: true,
    },
    taxPercentage: {
      type: Number,
      required: [true, "Tax percentage is required"],
      min: [0, "Tax percentage cannot be negative"],
      default: 18, // Default GST for most construction materials
    },
    discount: {
      percentage: {
        type: Number,
        min: [0, "Discount percentage cannot be negative"],
        max: [100, "Discount percentage cannot exceed 100%"],
        default: 0,
      },
      startDate: Date,
      endDate: Date,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    deliveryOptions: {
      selfPickup: {
        type: Boolean,
        default: true,
      },
      delivery: {
        type: Boolean,
        default: true,
      },
      deliveryCharge: {
        type: Number,
        default: 0,
      },
      freeDeliveryMinOrder: {
        type: Number,
        default: 5000, // Free delivery for orders above 5000
      },
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isPromoted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "outOfStock", "discontinued"],
      default: "inactive",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to calculate total inventory
productSchema.pre("save", function (next) {
  this.inventory.total = this.inventory.available + this.inventory.reserved;

  // Update low stock status
  this.inventory.isLowStock =
    this.inventory.available <= this.inventory.lowStockThreshold;

  // Set product status to outOfStock if total inventory is 0
  if (this.inventory.total <= 0) {
    this.status = "outOfStock";
  } else if (this.status === "outOfStock" && this.inventory.total > 0) {
    this.status = "active";
  }

  next();
});

// Method to get current price after discount
productSchema.methods.getCurrentPrice = function () {
  if (!this.discount || !this.discount.percentage) {
    return this.pricePerUnit;
  }

  const now = new Date();
  const startDate = this.discount.startDate
    ? new Date(this.discount.startDate)
    : null;
  const endDate = this.discount.endDate
    ? new Date(this.discount.endDate)
    : null;

  // Check if discount is currently applicable
  if ((startDate && now < startDate) || (endDate && now > endDate)) {
    return this.pricePerUnit;
  }

  // Calculate discounted price
  const discountAmount = (this.pricePerUnit * this.discount.percentage) / 100;
  return this.pricePerUnit - discountAmount;
};

// Virtual for the price with tax
productSchema.virtual("priceWithTax").get(function () {
  const basePrice = this.getCurrentPrice();
  const taxAmount = (basePrice * this.taxPercentage) / 100;
  return basePrice + taxAmount;
});

// Index for better search performance
productSchema.index({ name: "text", description: "text" });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
