const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const config = require('../config')
const {UserRole} = require('../constants')

const addressSchema = new mongoose.Schema(
  {
    street: {
      type: String,
      required: [true, 'Street is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {_id: true}
)

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
        required: false,
      },
      url: {
        type: String,
        required: false,
      },
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
    },
    deliveryAddresses: [addressSchema],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    phoneNumber: {
      type: String,
      match: [/^[0-9]{10}$/, 'Please provide a valid phone number'],
    },
    addresses: [
      {
        name: String,
        address: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        phone: String,
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {timestamps: true}
)

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Generate JWT token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({id: this._id}, config.jwt.secret, {
    expiresIn: config.jwt.expire,
  })
}

// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex')

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

  // Set token expire time
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000 // 10 minutes

  return resetToken
}

// Get default address
userSchema.methods.getDefaultAddress = function () {
  if (!this.addresses || this.addresses.length === 0) {
    return null
  }

  const defaultAddress = this.addresses.find((addr) => addr.isDefault)
  return defaultAddress || this.addresses[0]
}

module.exports = mongoose.model('User', userSchema)
