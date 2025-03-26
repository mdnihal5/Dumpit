const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const logger = require("../utils/logger");

/**
 * Generate JWT token
 * @param {Object} user - User object
 * @returns {String} JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

/**
 * Generate refresh token
 * @param {Object} user - User object
 * @returns {String} Refresh token
 */
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role = "user" } = req.body;
  
  // Check for existing user
  const existingUser = await User.findOne({
    $or: [{ email }, { phone }],
  });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "User with this email or phone already exists",
    });
  }
  
  // Validate role
  if (!["user", "vendor"].includes(role)) {
    return res.status(400).json({
      success: false,
      message: "Invalid role. Must be user or vendor",
    });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
  });

  // Generate tokens
  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);

  // Save refresh token to user
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save();
  
  // Remove password from response
  user.password = undefined;
  user.refreshToken = undefined;

  logger.success(`New user registered: ${user.email}`);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user,
      token,
      refreshToken,
    },
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate inputs
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  // Find user by email
  const user = await User.findOne({
    email: email.toLowerCase()
  }).select("+password");

  if (!user) {
    logger.warn(`Failed login attempt for non-existent user: ${email}`);
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  // Check if account is active
  if (user.status !== "active") {
    logger.warn(`Login attempt for inactive account: ${email}`);
    return res.status(403).json({
      success: false,
      message: "Your account is not active. Please contact support.",
    });
  }

  // Verify password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    logger.warn(`Failed login attempt (incorrect password) for: ${email}`);
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  // Generate tokens
  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);

  // Update user's refreshToken and lastLogin
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save();

  // Remove sensitive data from response
  user.password = undefined;
  user.refreshToken = undefined;

  logger.success(`User logged in: ${user.email}`);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user,
      token,
      refreshToken,
    },
  });
});

/**
 * @desc    Refresh token
 * @route   POST /api/auth/refresh-token
 * @access  Public (with refresh token)
 */
exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: "Refresh token is required",
    });
  }

  // Verify refresh token
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);

  // Find user by id and check if refresh token matches
  const user = await User.findById(decoded.id).select("+refreshToken");

  if (!user || user.refreshToken !== refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }

  // Generate new tokens
  const newToken = generateToken(user);
  const newRefreshToken = generateRefreshToken(user);

  // Update user's refreshToken
  user.refreshToken = newRefreshToken;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
    data: {
      token: newToken,
      refreshToken: newRefreshToken,
    },
  });
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
exports.logout = asyncHandler(async (req, res) => {
  // Clear refresh token
  const user = await User.findById(req.user.id);
  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .select("-password -refreshToken -resetPasswordToken -resetPasswordExpire")
    .populate("addresses");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, avatar } = req.body;

  // Find user
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Check if email is already taken
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already taken",
      });
    }
  }

  // Check if phone is already taken
  if (phone && phone !== user.phone) {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Phone number already taken",
      });
    }
  }

  // Update user
  user.name = name || user.name;
  user.email = email || user.email;
  user.phone = phone || user.phone;
  user.avatar = avatar || user.avatar;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: user,
  });
});

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Please provide current and new password",
    });
  }

  // Find user
  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Verify current password
  const isPasswordCorrect = await user.comparePassword(currentPassword);
  if (!isPasswordCorrect) {
    return res.status(401).json({
      success: false,
      message: "Current password is incorrect",
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Please provide your email",
    });
  }

  // Find user
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save();

  // Send email with reset link
  // In a real app, you would send an email here
  // For development, just return the token

  res.status(200).json({
    success: true,
    message: "Password reset token generated",
    data: {
      resetToken, // In production, remove this and send via email
    },
  });
});

/**
 * @desc    Reset password
 * @route   PUT /api/auth/reset-password/:resetToken
 * @access  Public
 */
exports.resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Please provide a new password",
    });
  }

  // Hash token
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Find user by reset token and check expiry
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  // Update password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successful",
  });
});

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate("vendorInfo", "businessName verificationStatus")
    .populate("deliveryInfo", "isActive");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

/**
 * @desc    Update FCM token for push notifications
 * @route   PUT /api/auth/fcm-token
 * @access  Private
 */
exports.updateFcmToken = asyncHandler(async (req, res) => {
  const { fcmToken } = req.body;

  if (!fcmToken) {
    return res.status(400).json({
      success: false,
      message: "FCM token is required",
    });
  }

  await User.findByIdAndUpdate(req.user.id, { fcmToken });
  logger.info(`FCM token updated for user ${req.user.id}`);

  res.status(200).json({
    success: true,
    message: "FCM token updated successfully",
  });
});
