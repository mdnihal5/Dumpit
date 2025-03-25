const User = require("../models/user.model");
const Order = require("../models/order.model");
const mongoose = require("mongoose");

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
exports.getUserProfile = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user profile",
      error: error.message,
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
exports.updateUserProfile = async (req, res) => {
  try {
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

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating user profile",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all addresses
 * @route   GET /api/users/addresses
 * @access  Private
 */
exports.getAddresses = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching addresses",
      error: error.message,
    });
  }
};

/**
 * @desc    Add new address
 * @route   POST /api/users/addresses
 * @access  Private
 */
exports.addAddress = async (req, res) => {
  try {
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

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding address",
      error: error.message,
    });
  }
};

/**
 * @desc    Update address
 * @route   PUT /api/users/addresses/:addressId
 * @access  Private
 */
exports.updateAddress = async (req, res) => {
  try {
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

    // Handle default address setting
    if (isDefault) {
      // Set all addresses to non-default
      user.addresses.forEach((address) => {
        address.isDefault = false;
      });
      // Set this address as default
      user.addresses[addressIndex].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating address",
      error: error.message,
    });
  }
};

/**
 * @desc    Set address as default
 * @route   PUT /api/users/addresses/:addressId/default
 * @access  Private
 */
exports.setDefaultAddress = async (req, res) => {
  try {
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

    res.status(200).json({
      success: true,
      message: "Default address updated successfully",
      data: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating default address",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete address
 * @route   DELETE /api/users/addresses/:addressId
 * @access  Private
 */
exports.deleteAddress = async (req, res) => {
  try {
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

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      data: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting address",
      error: error.message,
    });
  }
};

/**
 * @desc    Get user order stats
 * @route   GET /api/users/order-stats
 * @access  Private
 */
exports.getOrderStats = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order stats",
      error: error.message,
    });
  }
};
