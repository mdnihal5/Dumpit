const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Middleware to protect routes - verifies JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    // Check if token exists in cookies (for web clients)
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Check if user still exists
  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User no longer exists",
    });
  }

  // Check if user is active
  if (user.status !== "active") {
    return res.status(403).json({
      success: false,
      message: "Your account is not active",
    });
  }

  // Add user to request object
  req.user = {
    id: user._id,
    role: user.role,
  };

  next();
});

/**
 * Middleware to authorize user roles
 * @param  {...String} roles - Allowed roles
 * @returns {Function} Middleware function
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(500).json({
        success: false,
        message: "Authorization error: User role not defined",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }

    next();
  };
};

/**
 * Middleware to validate vendor status
 * Only verified vendors can access certain routes
 */
exports.verifiedVendor = asyncHandler(async (req, res, next) => {
  // Check if user exists and is a vendor
  const user = await User.findById(req.user.id).populate("vendorInfo");

  if (!user || user.role !== "vendor") {
    return res.status(403).json({
      success: false,
      message: "Only vendors can access this route",
    });
  }

  if (!user.vendorInfo) {
    return res.status(403).json({
      success: false,
      message: "Vendor profile not found",
    });
  }

  if (user.vendorInfo.verificationStatus !== "verified") {
    return res.status(403).json({
      success: false,
      message: "Only verified vendors can access this route",
    });
  }

  next();
});

/**
 * Middleware to validate delivery partner status
 * Only active delivery partners can access certain routes
 */
exports.activeDeliveryPartner = asyncHandler(async (req, res, next) => {
  // Check if user exists and is a delivery partner
  const user = await User.findById(req.user.id).populate("deliveryInfo");

  if (!user || user.role !== "delivery") {
    return res.status(403).json({
      success: false,
      message: "Only delivery partners can access this route",
    });
  }

  if (!user.deliveryInfo) {
    return res.status(403).json({
      success: false,
      message: "Delivery partner profile not found",
    });
  }

  if (!user.deliveryInfo.isActive) {
    return res.status(403).json({
      success: false,
      message: "Only active delivery partners can access this route",
    });
  }

  next();
});
