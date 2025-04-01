const mongoose = require('mongoose')
const {Schema} = mongoose

const reviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: [0, 'Price cannot be negative'],
    },
    discount: {
      type: Number,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
      default: 0,
    },
    finalPrice: {
      type: Number,
      min: [0, 'Final price cannot be negative'],
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please provide product category'],
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: [true, 'Please provide shop'],
    },
    stock: {
      type: Number,
      required: [true, 'Please provide product stock'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    reviews: [reviewSchema],
    ratings: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
  },
  {timestamps: true}
)

// Calculate finalPrice before saving
productSchema.pre('save', function (next) {
  if (this.discount && this.price) {
    this.finalPrice = this.price - (this.price * this.discount) / 100
  } else {
    this.finalPrice = this.price
  }
  next()
})

// Calculate average ratings
productSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) {
    this.ratings = 0
    this.numOfReviews = 0
    return
  }

  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0)
  this.ratings = totalRating / this.reviews.length
  this.numOfReviews = this.reviews.length
}

module.exports = mongoose.model('Product', productSchema)
