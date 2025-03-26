const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settings.controller");
const { protect } = require("../middlewares/auth.middleware");

// All settings routes require authentication
router.use(protect);

// Get user settings
router.get("/", settingsController.getUserSettings);

// Update user settings
router.put("/", settingsController.updateUserSettings);

// Update notification preferences
router.put("/notifications", settingsController.updateNotificationPreferences);

// Update language preference
router.put("/language", settingsController.updateLanguage);

// Update currency preference
router.put("/currency", settingsController.updateCurrency);

module.exports = router; 