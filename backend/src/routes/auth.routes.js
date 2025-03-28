const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/forgot-password", authController.forgotPassword);
router.put("/reset-password/:resetToken", authController.resetPassword);

// Protected routes (require authentication)
router.use(protect); // Apply protect middleware to all routes below

router.get("/me", authController.getCurrentUser);
router.post("/logout", authController.logout);
router.put("/change-password", authController.changePassword);
router.put("/profile", authController.updateProfile);
router.put("/fcm-token", authController.updateFcmToken);

module.exports = router;
