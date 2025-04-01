const mongoose = require('mongoose')
const {Schema} = mongoose

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide category name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide category description'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {timestamps: true}
)

module.exports = mongoose.model('Category', categorySchema)
