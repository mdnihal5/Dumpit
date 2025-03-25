const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a category name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    slug: {
      type: String,
      unique: true,
    },
    image: {
      type: String,
      default: "no-image.jpg",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create slug from name before saving
categorySchema.pre("save", function (next) {
  if (!this.isModified("name")) {
    next();
  }
  this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-");
  next();
});

module.exports = mongoose.model("Category", categorySchema); 