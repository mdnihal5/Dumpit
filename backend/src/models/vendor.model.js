const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    businessName: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
    },
    businessDescription: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    contactEmail: {
      type: String,
      required: [true, "Contact email is required"],
      trim: true,
      lowercase: true,
    },
    contactPhone: {
      type: String,
      required: [true, "Contact phone is required"],
      trim: true,
    },
    businessAddress: {
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
    businessRegistrationNumber: {
      type: String,
      required: [true, "Business registration number is required"],
      unique: true,
    },
    gstNumber: {
      type: String,
      required: [true, "GST number is required"],
      unique: true,
    },
    panNumber: {
      type: String,
      required: [true, "PAN number is required"],
      unique: true,
    },
    bankDetails: {
      accountHolderName: {
        type: String,
        required: [true, "Account holder name is required"],
      },
      accountNumber: {
        type: String,
        required: [true, "Account number is required"],
      },
      bankName: {
        type: String,
        required: [true, "Bank name is required"],
      },
      ifscCode: {
        type: String,
        required: [true, "IFSC code is required"],
      },
      branchName: {
        type: String,
        required: [true, "Branch name is required"],
      },
    },
    operatingHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String },
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    categories: [
      {
        type: String,
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
    ],
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
    totalOrders: {
      type: Number,
      default: 0,
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    verificationDocuments: [
      {
        name: String,
        url: String,
        type: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    commissionRate: {
      type: Number,
      default: 10, // in percentage
    },
    deliveryRadius: {
      type: Number,
      default: 10, // in kilometers
    },
    minOrderAmount: {
      type: Number,
      default: 500, // in rupees
    },
    activeProductsCount: {
      type: Number,
      default: 0,
    },
    isPromoted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "inactive",
    },
  },
  {
    timestamps: true,
  }
);

// Index for geospatial queries
vendorSchema.index({ "businessAddress.coordinates": "2dsphere" });

// Virtual for the complete vendor profile
vendorSchema.virtual("completeProfile").get(function () {
  return !!(
    this.businessName &&
    this.businessDescription &&
    this.logo &&
    this.contactEmail &&
    this.contactPhone &&
    this.businessAddress &&
    this.businessRegistrationNumber &&
    this.gstNumber &&
    this.panNumber &&
    this.bankDetails &&
    this.operatingHours
  );
});

// Method to check if vendor is open at given time
vendorSchema.methods.isOpenNow = function () {
  if (!this.isOpen) return false;

  const now = new Date();
  const day = now.toLocaleDateString("en-US", { weekday: "lowercase" });

  if (
    !this.operatingHours[day] ||
    !this.operatingHours[day].open ||
    !this.operatingHours[day].close
  ) {
    return false;
  }

  const currentTime = now.getHours() * 100 + now.getMinutes();
  const openTime = parseInt(this.operatingHours[day].open.replace(":", ""));
  const closeTime = parseInt(this.operatingHours[day].close.replace(":", ""));

  return currentTime >= openTime && currentTime <= closeTime;
};

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
