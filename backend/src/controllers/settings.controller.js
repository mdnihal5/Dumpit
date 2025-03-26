const User = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const logger = require("../utils/logger");

// Get user settings
exports.getUserSettings = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+settings");
  
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  const defaultSettings = {
    darkMode: false,
    pushNotifications: true,
    emailNotifications: true,
    locationServices: true,
    language: "English",
    currency: "USD",
  };

  res.status(200).json({
    success: true,
    data: {
      settings: user.settings || defaultSettings,
    },
  });
});

// Update user settings
exports.updateUserSettings = asyncHandler(async (req, res, next) => {
  const { darkMode, locationServices } = req.body;
  
  const user = await User.findById(req.user.id).select("+settings");
  
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  // Initialize settings if they don't exist
  if (!user.settings) {
    user.settings = {};
  }

  // Update settings
  user.settings = {
    ...user.settings,
    darkMode,
    locationServices,
  };

  await user.save();
  logger.info(`User ${user._id} updated settings`);

  res.status(200).json({
    success: true,
    data: {
      settings: user.settings,
    },
  });
});

// Update notification preferences
exports.updateNotificationPreferences = asyncHandler(async (req, res, next) => {
  const { pushNotifications, emailNotifications } = req.body;
  
  const user = await User.findById(req.user.id).select("+settings");
  
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  // Initialize settings if they don't exist
  if (!user.settings) {
    user.settings = {};
  }

  // Update notification preferences
  user.settings = {
    ...user.settings,
    pushNotifications,
    emailNotifications,
  };

  await user.save();
  logger.info(`User ${user._id} updated notification preferences`);

  res.status(200).json({
    success: true,
    data: {
      settings: user.settings,
    },
  });
});

// Update language preference
exports.updateLanguage = asyncHandler(async (req, res, next) => {
  const { language } = req.body;
  
  const user = await User.findById(req.user.id).select("+settings");
  
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  // Initialize settings if they don't exist
  if (!user.settings) {
    user.settings = {};
  }

  // Update language preference
  user.settings = {
    ...user.settings,
    language,
  };

  await user.save();
  logger.info(`User ${user._id} updated language preference to ${language}`);

  res.status(200).json({
    success: true,
    data: {
      settings: user.settings,
    },
  });
});

// Update currency preference
exports.updateCurrency = asyncHandler(async (req, res, next) => {
  const { currency } = req.body;
  
  const user = await User.findById(req.user.id).select("+settings");
  
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  // Initialize settings if they don't exist
  if (!user.settings) {
    user.settings = {};
  }

  // Update currency preference
  user.settings = {
    ...user.settings,
    currency,
  };

  await user.save();
  logger.info(`User ${user._id} updated currency preference to ${currency}`);

  res.status(200).json({
    success: true,
    data: {
      settings: user.settings,
    },
  });
}); 