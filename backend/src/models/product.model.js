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
    brand: {
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

// Virtual for total inventory
productSchema.virtual("inventory.total").get(function () {
  return this.inventory.available + this.inventory.reserved;
});

// Virtual for price with tax
productSchema.virtual("priceWithTax").get(function () {
  return this.pricePerUnit * (1 + this.taxPercentage / 100);
});

// Virtual for price per unit after discount
productSchema.virtual("pricePerUnitAfterDiscount").get(function () {
  const now = new Date();
  const isDiscountActive = this.discount.startDate <= now && this.discount.endDate >= now;
  if (isDiscountActive) {
    return this.pricePerUnit * (1 - this.discount.percentage / 100);
  }
  return this.pricePerUnit;
});

// Pre-save middleware to update low stock status
productSchema.pre("save", function (next) {
  // Update low stock status
  this.inventory.isLowStock = this.inventory.available <= this.inventory.lowStockThreshold;
  next();
});

// Index for better search performance
productSchema.index({ name: "text", description: "text" });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
