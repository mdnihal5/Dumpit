const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { protect } = require("../middlewares/auth.middleware");

// Apply protect middleware to all routes
router.use(protect);

// Profile routes
router.get("/profile", userController.getUserProfile);
router.put("/profile", userController.updateUserProfile);

// Address routes
router.get("/addresses", userController.getAddresses);
router.post("/addresses", userController.addAddress);
router.put("/addresses/:addressId", userController.updateAddress);
router.put("/addresses/:addressId/default", userController.setDefaultAddress);
router.delete("/addresses/:addressId", userController.deleteAddress);

// Order stats
router.get("/order-stats", userController.getOrderStats);

module.exports = router;
