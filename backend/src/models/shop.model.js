const mongoose = require('mongoose')
const {Schema} = mongoose

const shopSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide shop name'],
      trim: true,
      maxlength: [100, 'Shop name cannot exceed 100 characters'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide shop description'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    address: {
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
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    reviews: [
      {
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
      },
    ],
    ratings: {
      type: Number,
      default: 0,
    },
  },
  {timestamps: true}
)

// Method to calculate average ratings
shopSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) {
    this.ratings = 0
    return
  }

  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0)
  this.ratings = totalRating / this.reviews.length
}

module.exports = mongoose.model('Shop', shopSchema)
