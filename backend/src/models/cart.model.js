const mongoose = require('mongoose')
const {Schema} = mongoose

const cartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  finalPrice: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
  },
})

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    totalItems: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  {timestamps: true}
)

// Calculate totals before saving
cartSchema.pre('save', function (next) {
  // Calculate total items
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0)
  
  // Calculate total amount
  this.totalAmount = this.items.reduce((total, item) => {
    return total + (item.finalPrice * item.quantity)
  }, 0)
  
  next()
})

module.exports = mongoose.model('Cart', cartSchema) 