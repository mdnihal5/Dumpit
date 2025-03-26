const User = require("../models/user.model");
const Order = require("../models/order.model");
const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const logger = require("../utils/logger");

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select(
    "-refreshToken -resetPasswordToken -resetPasswordExpire"
  );

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
 * @route   PUT /api/users/profile
 * @access  Private
 */
exports.updateUserProfile = asyncHandler(async (req, res) => {
  const { name, avatar } = req.body;

  // Fields to update
  const updateFields = {};
  if (name) updateFields.name = name;
  if (avatar) updateFields.avatar = avatar;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $set: updateFields },
    { new: true, runValidators: true }
  ).select("-refreshToken -resetPasswordToken -resetPasswordExpire");

  logger.info(`User ${user._id} updated their profile`);

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: user,
  });
});

/**
 * @desc    Get all addresses
 * @route   GET /api/users/addresses
 * @access  Private
 */
exports.getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("addresses");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    data: user.addresses,
  });
});

/**
 * @desc    Add new address
 * @route   POST /api/users/addresses
 * @access  Private
 */
exports.addAddress = asyncHandler(async (req, res) => {
  const { type, street, city, state, zipCode, isDefault, coordinates } =
    req.body;

  // Validate required fields
  if (!street || !city || !state || !zipCode) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required address fields",
    });
  }

  const newAddress = {
    type: type || "home",
    street,
    city,
    state,
    zipCode,
    isDefault: isDefault || false,
    coordinates,
  };

  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // If new address is set as default, unset default for all other addresses
  if (newAddress.isDefault) {
    user.addresses.forEach((address) => {
      address.isDefault = false;
    });
  }
  // If this is the first address, set it as default
  else if (user.addresses.length === 0) {
    newAddress.isDefault = true;
  }

  // Add new address to the user's addresses array
  user.addresses.push(newAddress);
  await user.save();

  logger.info(`User ${user._id} added a new address`);

  res.status(201).json({
    success: true,
    message: "Address added successfully",
    data: user.addresses,
  });
});

/**
 * @desc    Update address
 * @route   PUT /api/users/addresses/:addressId
 * @access  Private
 */
exports.updateAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const { type, street, city, state, zipCode, isDefault, coordinates } =
    req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Find the address to update
  const addressIndex = user.addresses.findIndex(
    (address) => address._id.toString() === addressId
  );

  if (addressIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Address not found",
    });
  }

  // Update address fields
  if (type) user.addresses[addressIndex].type = type;
  if (street) user.addresses[addressIndex].street = street;
  if (city) user.addresses[addressIndex].city = city;
  if (state) user.addresses[addressIndex].state = state;
  if (zipCode) user.addresses[addressIndex].zipCode = zipCode;
  if (coordinates) user.addresses[addressIndex].coordinates = coordinates;

  // Handle default address status
  if (isDefault !== undefined) {
    // If setting this address as default, unset all others
    if (isDefault) {
      user.addresses.forEach((address, index) => {
        user.addresses[index].isDefault = index === addressIndex;
      });
    } else {
      // If unsetting default on this address, check if we need a new default
      if (user.addresses[addressIndex].isDefault) {
        // Pick first address as default if available
        if (user.addresses.length > 1) {
          const newDefaultIndex =
            addressIndex === 0 ? 1 : 0;
          user.addresses[newDefaultIndex].isDefault = true;
        }
      }
      user.addresses[addressIndex].isDefault = false;
    }
  }

  await user.save();
  logger.info(`User ${user._id} updated address ${addressId}`);

  res.status(200).json({
    success: true,
    message: "Address updated successfully",
    data: user.addresses,
  });
});

/**
 * @desc    Set address as default
 * @route   PUT /api/users/addresses/:addressId/default
 * @access  Private
 */
exports.setDefaultAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;

  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Find the address
  const addressExists = user.addresses.some(
    (address) => address._id.toString() === addressId
  );

  if (!addressExists) {
    return res.status(404).json({
      success: false,
      message: "Address not found",
    });
  }

  // Update all addresses (set isDefault to false)
  user.addresses.forEach((address) => {
    address.isDefault = address._id.toString() === addressId;
  });

  await user.save();
  logger.info(`User ${user._id} set address ${addressId} as default`);

  res.status(200).json({
    success: true,
    message: "Default address updated successfully",
    data: user.addresses,
  });
});

/**
 * @desc    Delete address
 * @route   DELETE /api/users/addresses/:addressId
 * @access  Private
 */
exports.deleteAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;

  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Find the address to delete
  const addressIndex = user.addresses.findIndex(
    (address) => address._id.toString() === addressId
  );

  if (addressIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Address not found",
    });
  }

  // Check if deleting the default address
  const isDefault = user.addresses[addressIndex].isDefault;

  // Remove the address
  user.addresses.splice(addressIndex, 1);

  // If deleted address was default and there are other addresses,
  // set the first one as default
  if (isDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();
  logger.info(`User ${user._id} deleted address ${addressId}`);

  res.status(200).json({
    success: true,
    message: "Address deleted successfully",
    data: user.addresses,
  });
});

/**
 * @desc    Get user order stats
 * @route   GET /api/users/order-stats
 * @access  Private
 */
exports.getOrderStats = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);

  // Get order stats
  const orderStats = await Order.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        total: { $sum: "$billing.total" },
      },
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: "$count" },
        totalSpent: { $sum: "$total" },
        statuses: {
          $push: {
            status: "$_id",
            count: "$count",
            total: "$total",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalOrders: 1,
        totalSpent: 1,
        statuses: 1,
      },
    },
  ]);

  // Get recent orders (last 5)
  const recentOrders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("orderNumber status billing.total createdAt")
    .lean();

  res.status(200).json({
    success: true,
    data: {
      stats: orderStats[0] || {
        totalOrders: 0,
        totalSpent: 0,
        statuses: [],
      },
      recentOrders,
    },
  });
});
