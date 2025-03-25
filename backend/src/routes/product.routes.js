const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

// Public routes
router.get("/", productController.getProducts);
router.get("/featured", productController.getFeaturedProducts);
router.get("/category/:categoryId", productController.getProductsByCategory);
router.get("/vendor/:vendorId", productController.getProductsByVendor);
router.get("/:id", productController.getProductById);

// Protected routes (require authentication)
router.use(protect);

// Vendor/Admin only routes
router.post(
  "/",
  authorize(["vendor", "admin"]),
  productController.createProduct
);
router.put(
  "/:id",
  authorize(["vendor", "admin"]),
  productController.updateProduct
);
router.delete(
  "/:id",
  authorize(["vendor", "admin"]),
  productController.deleteProduct
);
router.put(
  "/:id/featured",
  authorize(["admin"]),
  productController.setProductFeatured
);
router.put(
  "/:id/discount",
  authorize(["vendor", "admin"]),
  productController.setProductDiscount
);

module.exports = router;
