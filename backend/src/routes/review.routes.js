const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const { protect } = require("../middlewares/auth.middleware");

// All review routes require authentication
router.use(protect);

// Product reviews
router.post("/products/:productId", reviewController.createProductReview);
router.get("/products/:productId", reviewController.getProductReviews);
router.put("/products/:productId/:reviewId", reviewController.updateProductReview);
router.delete("/products/:productId/:reviewId", reviewController.deleteProductReview);

// Vendor reviews
router.post("/vendors/:vendorId", reviewController.createVendorReview);
router.get("/vendors/:vendorId", reviewController.getVendorReviews);
router.put("/vendors/:vendorId/:reviewId", reviewController.updateVendorReview);
router.delete("/vendors/:vendorId/:reviewId", reviewController.deleteVendorReview);

module.exports = router; 