const Product = require("../models/product.model");
const Vendor = require("../models/vendor.model");
const Review = require("../models/review.model");
const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Create product review
// @route   POST /api/reviews/products/:productId
// @access  Private
exports.createProductReview = asyncHandler(async (req, res, next) => {
  req.body.product = req.params.productId;
  req.body.user = req.user.id;

  const product = await Product.findById(req.params.productId);
  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.productId}`, 404));
  }

  // Check if user already reviewed this product
  const existingReview = await Review.findOne({
    product: req.params.productId,
    user: req.user.id,
  });

  if (existingReview) {
    return next(new ErrorResponse("User has already reviewed this product", 400));
  }

  const review = await Review.create(req.body);

  // Update product rating
  const reviews = await Review.find({ product: req.params.productId });
  const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
  await Product.findByIdAndUpdate(req.params.productId, { rating: avgRating });

  res.status(201).json({
    success: true,
    data: review,
  });
});

// @desc    Get product reviews
// @route   GET /api/reviews/products/:productId
// @access  Public
exports.getProductReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate("user", "name avatar")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

// @desc    Update product review
// @route   PUT /api/reviews/products/:productId/:reviewId
// @access  Private
exports.updateProductReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.reviewId);
  if (!review) {
    return next(new ErrorResponse(`Review not found with id of ${req.params.reviewId}`, 404));
  }

  // Make sure user owns review
  if (review.user.toString() !== req.user.id) {
    return next(new ErrorResponse("User not authorized to update this review", 401));
  }

  review = await Review.findByIdAndUpdate(req.params.reviewId, req.body, {
    new: true,
    runValidators: true,
  });

  // Update product rating
  const reviews = await Review.find({ product: req.params.productId });
  const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
  await Product.findByIdAndUpdate(req.params.productId, { rating: avgRating });

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc    Delete product review
// @route   DELETE /api/reviews/products/:productId/:reviewId
// @access  Private
exports.deleteProductReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review) {
    return next(new ErrorResponse(`Review not found with id of ${req.params.reviewId}`, 404));
  }

  // Make sure user owns review
  if (review.user.toString() !== req.user.id) {
    return next(new ErrorResponse("User not authorized to delete this review", 401));
  }

  await review.remove();

  // Update product rating
  const reviews = await Review.find({ product: req.params.productId });
  const avgRating = reviews.length > 0
    ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
    : 0;
  await Product.findByIdAndUpdate(req.params.productId, { rating: avgRating });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Create vendor review
// @route   POST /api/reviews/vendors/:vendorId
// @access  Private
exports.createVendorReview = asyncHandler(async (req, res, next) => {
  req.body.vendor = req.params.vendorId;
  req.body.user = req.user.id;

  const vendor = await Vendor.findById(req.params.vendorId);
  if (!vendor) {
    return next(new ErrorResponse(`Vendor not found with id of ${req.params.vendorId}`, 404));
  }

  // Check if user already reviewed this vendor
  const existingReview = await Review.findOne({
    vendor: req.params.vendorId,
    user: req.user.id,
  });

  if (existingReview) {
    return next(new ErrorResponse("User has already reviewed this vendor", 400));
  }

  const review = await Review.create(req.body);

  // Update vendor rating
  const reviews = await Review.find({ vendor: req.params.vendorId });
  const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
  await Vendor.findByIdAndUpdate(req.params.vendorId, { rating: avgRating });

  res.status(201).json({
    success: true,
    data: review,
  });
});

// @desc    Get vendor reviews
// @route   GET /api/reviews/vendors/:vendorId
// @access  Public
exports.getVendorReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({ vendor: req.params.vendorId })
    .populate("user", "name avatar")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

// @desc    Update vendor review
// @route   PUT /api/reviews/vendors/:vendorId/:reviewId
// @access  Private
exports.updateVendorReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.reviewId);
  if (!review) {
    return next(new ErrorResponse(`Review not found with id of ${req.params.reviewId}`, 404));
  }

  // Make sure user owns review
  if (review.user.toString() !== req.user.id) {
    return next(new ErrorResponse("User not authorized to update this review", 401));
  }

  review = await Review.findByIdAndUpdate(req.params.reviewId, req.body, {
    new: true,
    runValidators: true,
  });

  // Update vendor rating
  const reviews = await Review.find({ vendor: req.params.vendorId });
  const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
  await Vendor.findByIdAndUpdate(req.params.vendorId, { rating: avgRating });

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc    Delete vendor review
// @route   DELETE /api/reviews/vendors/:vendorId/:reviewId
// @access  Private
exports.deleteVendorReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review) {
    return next(new ErrorResponse(`Review not found with id of ${req.params.reviewId}`, 404));
  }

  // Make sure user owns review
  if (review.user.toString() !== req.user.id) {
    return next(new ErrorResponse("User not authorized to delete this review", 401));
  }

  await review.remove();

  // Update vendor rating
  const reviews = await Review.find({ vendor: req.params.vendorId });
  const avgRating = reviews.length > 0
    ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
    : 0;
  await Vendor.findByIdAndUpdate(req.params.vendorId, { rating: avgRating });

  res.status(200).json({
    success: true,
    data: {},
  });
}); 