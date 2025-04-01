const mongoose = require('mongoose')
const {Schema} = mongoose
const {OrderStatus, PaymentStatus} = require('../constants')

// Create a GeoJSON point schema for location tracking
const pointSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point',
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true,
  }
})

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        image: {
          type: String,
          required: true,
        },
      },
    ],
    shippingAddress: {
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
      postalCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      location: pointSchema
    },
    paymentInfo: {
      id: {
        type: String,
        required: true,
      },
      method: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.PENDING,
      },
      amountPaid: {
        type: Number,
        required: true,
      },
      paidAt: {
        type: Date,
        default: Date.now,
      },
    },
    taxAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PROCESSING,
    },
    deliveredAt: Date,
    // Location tracking information
    currentLocation: pointSchema,
    locationHistory: [
      {
        location: pointSchema,
        timestamp: {
          type: Date,
          default: Date.now
        },
        status: {
          type: String,
          enum: Object.values(OrderStatus),
        },
        description: String
      }
    ],
    estimatedDeliveryTime: Date,
  },
  {timestamps: true}
)

// Create a 2dsphere index for location-based queries
orderSchema.index({ "currentLocation": "2dsphere" });
orderSchema.index({ "shippingAddress.location": "2dsphere" });

module.exports = mongoose.model('Order', orderSchema)
