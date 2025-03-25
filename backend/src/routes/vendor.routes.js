const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendor.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

// Public routes
router.get("/", vendorController.getVendors);
router.get("/nearby", vendorController.getNearbyVendors);
router.get("/:id", vendorController.getVendorById);
router.get("/:id/products", vendorController.getVendorProducts);
router.get("/:id/reviews", vendorController.getVendorReviews);

// Protected routes
router.use(protect);

// Customer routes
router.post("/:id/reviews", vendorController.addVendorReview);

// Vendor routes
router.get(
  "/my-store",
  authorize(["vendor"]),
  vendorController.getMyVendorProfile
);
router.put(
  "/my-store",
  authorize(["vendor"]),
  vendorController.updateMyVendorProfile
);

// Admin routes
router.post("/", authorize(["admin"]), vendorController.createVendor);
router.put("/:id", authorize(["admin"]), vendorController.updateVendorByAdmin);
router.delete("/:id", authorize(["admin"]), vendorController.deleteVendor);
router.put(
  "/:id/promote",
  authorize(["admin"]),
  vendorController.promoteVendor
);

module.exports = router;
