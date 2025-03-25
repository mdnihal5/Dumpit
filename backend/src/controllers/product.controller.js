const Product = require("../models/product.model");

/**
 * @desc    Get all products with pagination, filtering and sorting
 * @route   GET /api/products
 * @access  Public
 */
exports.getProducts = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Filtering
    let query = {};

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ];
    }

    if (req.query.minPrice || req.query.maxPrice) {
      query.pricePerUnit = {};
      if (req.query.minPrice)
        query.pricePerUnit.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice)
        query.pricePerUnit.$lte = parseFloat(req.query.maxPrice);
    }

    // Sorting
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const sort = {};
    sort[sortBy] = sortOrder;

    // Execute query
    const products = await Product.find(query)
      .sort(sort)
      .skip(startIndex)
      .limit(limit)
      .populate("vendor", "businessName logo");

    // Get total count
    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
      error: error.message,
    });
  }
};

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, status: "active" })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("vendor", "businessName logo");

    res.status(200).json({
      success: true,
      message: "Featured products retrieved successfully",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve featured products",
      error: error.message,
    });
  }
};

/**
 * @desc    Get products by category
 * @route   GET /api/products/category/:categoryId
 * @access  Public
 */
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve products by category",
      error: error.message,
    });
  }
};

/**
 * @desc    Get products by vendor
 * @route   GET /api/products/vendor/:vendorId
 * @access  Public
 */
exports.getProductsByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const products = await Product.find({ vendor: vendorId, status: "active" })
      .sort({ createdAt: -1 })
      .populate("vendor", "businessName logo");

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve products by vendor",
      error: error.message,
    });
  }
};

/**
 * @desc    Get product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "vendor",
      "businessName logo address location phone email averageRating totalReviews"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve product",
      error: error.message,
    });
  }
};

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private/Vendor/Admin
 */
exports.createProduct = async (req, res) => {
  try {
    // If vendor, set vendor ID to the current user's ID
    if (req.user.role === "vendor") {
      req.body.vendor = req.user.id;
    }

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Vendor/Admin
 */
exports.updateProduct = async (req, res) => {
  try {
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

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private/Vendor/Admin
 */
exports.deleteProduct = async (req, res) => {
  try {
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
        message: "You are not authorized to delete this product",
      });
    }

    await product.remove();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

/**
 * @desc    Set product as featured
 * @route   PUT /api/products/:id/featured
 * @access  Private/Admin
 */
exports.setProductFeatured = async (req, res) => {
  try {
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

    res.status(200).json({
      success: true,
      message: `Product ${isFeatured ? "set as featured" : "removed from featured"}`,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update product featured status",
      error: error.message,
    });
  }
};

/**
 * @desc    Set product discount
 * @route   PUT /api/products/:id/discount
 * @access  Private/Vendor/Admin
 */
exports.setProductDiscount = async (req, res) => {
  try {
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

    res.status(200).json({
      success: true,
      message: "Product discount updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update product discount",
      error: error.message,
    });
  }
};
