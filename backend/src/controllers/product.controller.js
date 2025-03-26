const Product = require("../models/product.model");
const Category = require("../models/category.model");
const Vendor = require("../models/vendor.model");
const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const logger = require("../utils/logger");
const { uploadToCloudinary } = require("../utils/cloudinaryUpload");

/**
 * @desc    Get all products with pagination, filtering and sorting
 * @route   GET /api/products
 * @access  Public
 */
exports.getProducts = asyncHandler(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  // Filtering
  const filter = { isActive: true };

  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.vendor) {
    filter.vendor = req.query.vendor;
  }

  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
  }

  // Sorting
  let sortBy = {};
  if (req.query.sortField) {
    sortBy[req.query.sortField] = req.query.sortOrder === "desc" ? -1 : 1;
  } else {
    sortBy = { createdAt: -1 };
  }

  // Find products
  const products = await Product.find(filter)
    .populate("category", "name")
    .populate("vendor", "name")
    .sort(sortBy)
    .skip(startIndex)
    .limit(limit);

  // Get total count
  const total = await Product.countDocuments(filter);

  res.status(200).json({
    success: true,
    data: {
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
exports.getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true, status: "active" })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("vendor", "businessName logo");

  res.status(200).json({
    success: true,
    message: "Featured products retrieved successfully",
    data: products,
  });
});

/**
 * @desc    Get products by category
 * @route   GET /api/products/category/:categoryId
 * @access  Public
 */
exports.getProductsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  // Check if category exists
  const categoryExists = await Category.findById(categoryId);
  if (!categoryExists) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  const products = await Product.find({
    category: categoryId,
    status: "active",
  })
    .sort({ createdAt: -1 })
    .populate("vendor", "businessName logo");

  res.status(200).json({
    success: true,
    message: "Products retrieved successfully",
    data: products,
  });
});

/**
 * @desc    Get products by vendor
 * @route   GET /api/products/vendor/:vendorId
 * @access  Public
 */
exports.getProductsByVendor = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;

  // Check if vendor exists
  const vendorExists = await Vendor.findById(vendorId);
  if (!vendorExists) {
    return res.status(404).json({
      success: false,
      message: "Vendor not found",
    });
  }

  const products = await Product.find({ vendor: vendorId, status: "active" })
    .sort({ createdAt: -1 })
    .populate("vendor", "businessName logo");

  res.status(200).json({
    success: true,
    message: "Products retrieved successfully",
    data: products,
  });
});

/**
 * @desc    Get product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("category", "name")
    .populate("vendor")
    .populate({
      path: "reviews",
      populate: {
        path: "user",
        select: "name avatar",
      },
    });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private/Vendor/Admin
 */
exports.createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    stock,
    unit,
    images,
    specifications,
  } = req.body;

  // If user is a vendor, use their vendor ID
  let vendorId;
  if (req.user.role === "vendor") {
    const vendor = await Vendor.findOne({ user: req.user.id });
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }
    vendorId = vendor._id;
  } else if (req.user.role === "admin" && req.body.vendor) {
    // If admin is creating product for a vendor
    vendorId = req.body.vendor;
  } else {
    return res.status(400).json({
      success: false,
      message: "Vendor ID is required",
    });
  }

  // Check if category exists
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  // Upload images if provided
  let uploadedImages = [];
  if (req.files && req.files.length > 0) {
    try {
      // Upload images to Cloudinary
      uploadedImages = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file, "products"))
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error uploading images",
        error: error.message,
      });
    }
  } else if (images && images.length > 0) {
    // Use images URLs if provided in the request body
    uploadedImages = images;
  }

  // Create product
  const product = await Product.create({
    name,
    description,
    price,
    category,
    vendor: vendorId,
    stock,
    unit,
    images: uploadedImages,
    specifications: specifications || [],
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Vendor/Admin
 */
exports.updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // Check ownership if user is a vendor
  if (req.user.role === "vendor") {
    const vendor = await Vendor.findOne({ user: req.user.id });
    if (!vendor || !product.vendor.equals(vendor._id)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this product",
      });
    }
  }

  // Upload new images if provided
  if (req.files && req.files.length > 0) {
    try {
      const newImages = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file, "products"))
      );
      // Combine with existing images or replace based on request
      if (req.body.replaceImages === "true") {
        req.body.images = newImages;
      } else {
        req.body.images = [...(product.images || []), ...newImages];
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error uploading images",
        error: error.message,
      });
    }
  }

  // Check if category exists if being updated
  if (req.body.category) {
    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
  }

  // Update product
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
});

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private/Vendor/Admin
 */
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // Check ownership if user is a vendor
  if (req.user.role === "vendor") {
    const vendor = await Vendor.findOne({ user: req.user.id });
    if (!vendor || !product.vendor.equals(vendor._id)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this product",
      });
    }
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

/**
 * @desc    Set product as featured
 * @route   PUT /api/products/:id/featured
 * @access  Private/Admin
 */
exports.setProductFeatured = asyncHandler(async (req, res) => {
  const { isFeatured } = req.body;

  if (typeof isFeatured !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "isFeatured must be a boolean value",
    });
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isFeatured },
    { new: true }
  );

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  logger.info(`Product ${product._id} featured status updated: ${isFeatured}`);

  res.status(200).json({
    success: true,
    message: `Product ${isFeatured ? "set as featured" : "removed from featured"}`,
    data: product,
  });
});

/**
 * @desc    Set product discount
 * @route   PUT /api/products/:id/discount
 * @access  Private/Vendor/Admin
 */
exports.setProductDiscount = asyncHandler(async (req, res) => {
  const { discount } = req.body;

  if (
    !discount ||
    typeof discount.percentage !== "number" ||
    !discount.validUntil
  ) {
    return res.status(400).json({
      success: false,
      message: "Discount must include percentage and validUntil date",
    });
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // Check if user is vendor and owns the product
  if (
    req.user.role === "vendor" &&
    product.vendor.toString() !== req.user.id
  ) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to update this product",
    });
  }

  product.discount = discount;
  await product.save();

  logger.info(`Discount set for product ${product._id}: ${discount.percentage}%`);

  res.status(200).json({
    success: true,
    message: "Product discount updated successfully",
    data: product,
  });
});

/**
 * @desc    Search products
 * @route   GET /api/products/search
 * @access  Public
 */
exports.searchProducts = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Search query is required",
    });
  }

  // Create search query
  const searchQuery = {
    $or: [
      { name: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ],
    isActive: true,
  };

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  // Find products
  const products = await Product.find(searchQuery)
    .populate("category", "name")
    .populate("vendor", "name")
    .skip(startIndex)
    .limit(limit);

  // Get total count
  const total = await Product.countDocuments(searchQuery);

  res.status(200).json({
    success: true,
    data: {
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    },
  });
});
