const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be at least 8 characters long"],
      select: false, // Don't include by default in queries
    },
    role: {
      type: String,
      enum: ["user", "vendor", "admin", "delivery"],
      default: "user",
    },
    avatar: {
      type: String,
      default: "",
    },
    addresses: [
      {
        type: {
          type: String,
          enum: ["home", "office", "other"],
          default: "home",
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
        isDefault: {
          type: Boolean,
          default: false,
        },
        coordinates: {
          latitude: Number,
          longitude: Number,
        },
      },
    ],
    fcmToken: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpire: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    vendorInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },
    deliveryInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryPartner",
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Virtual for default address
userSchema.virtual("defaultAddress").get(function () {
  return this.addresses.find(addr => addr.isDefault) || this.addresses[0];
});

// Virtual for email verification status
userSchema.virtual("isEmailVerified").get(function () {
  return this.email && this.status === "active";
});

// Virtual for phone verification status
userSchema.virtual("isPhoneVerified").get(function () {
  return this.phone && this.status === "active";
});

// Method to update last login
userSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  await this.save();
};

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
