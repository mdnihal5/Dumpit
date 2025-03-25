const Vendor = require("../models/vendor.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");

/**
 * @desc    Get all vendors with pagination and filtering
 * @route   GET /api/vendors
 * @access  Public
 */
exports.getVendors = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Filtering
    let query = { isActive: true };

    if (req.query.category) {
      query.categories = req.query.category;
    }

    if (req.query.search) {
      query.$or = [
        { businessName: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ];
    }

    // Sorting
    const sortBy = req.query.sortBy || "businessName";
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
    const sort = {};
    sort[sortBy] = sortOrder;

    // Execute query
    const vendors = await Vendor.find(query)
      .sort(sort)
      .skip(startIndex)
      .limit(limit)
      .select("-bankDetails");

    // Get total count
    const total = await Vendor.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Vendors retrieved successfully",
      data: {
        vendors,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve vendors",
      error: error.message,
    });
  }
};

/**
 * @desc    Get nearby vendors based on location
 * @route   GET /api/vendors/nearby
 * @access  Public
 */
exports.getNearbyVendors = async (req, res) => {
  try {
    const { latitude, longitude, distance = 10 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Please provide latitude and longitude",
      });
    }

    // Find vendors within the specified distance (in km)
    const vendors = await Vendor.find({
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseInt(distance) * 1000, // Convert km to meters
        },
      },
    }).select("-bankDetails");

    // Calculate distance for each vendor and add it to the response
    const vendorsWithDistance = vendors.map((vendor) => {
      // Calculate distance if vendor has location coordinates
      let distanceInKm = 0;
      if (vendor.location && vendor.location.coordinates) {
        // Use Haversine formula to calculate distance
        const lat1 = parseFloat(latitude);
        const lon1 = parseFloat(longitude);
        const lat2 = vendor.location.coordinates[1];
        const lon2 = vendor.location.coordinates[0];

        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        distanceInKm = R * c; // Distance in km
      }

      // Convert vendor to plain object to add distance
      const vendorObj = vendor.toObject();
      vendorObj.distance = parseFloat(distanceInKm.toFixed(2));
      return vendorObj;
    });

    res.status(200).json({
      success: true,
      message: "Nearby vendors retrieved successfully",
      data: vendorsWithDistance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve nearby vendors",
      error: error.message,
    });
  }
};

// Helper function to convert degrees to radians
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * @desc    Get vendor by ID
 * @route   GET /api/vendors/:id
 * @access  Public
 */
exports.getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id).select("-bankDetails");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vendor retrieved successfully",
      data: vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve vendor",
      error: error.message,
    });
  }
};

/**
 * @desc    Get vendor products
 * @route   GET /api/vendors/:id/products
 * @access  Public
 */
exports.getVendorProducts = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if vendor exists
    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Filtering
    let query = { vendor: id, status: "active" };

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ];
    }

    // Get products
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    // Get total count
    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Vendor products retrieved successfully",
      data: {
        products,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve vendor products",
      error: error.message,
    });
  }
};

/**
 * @desc    Get vendor reviews
 * @route   GET /api/vendors/:id/reviews
 * @access  Public
 */
exports.getVendorReviews = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if vendor exists
    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Get reviews
    const reviews = await Vendor.findById(id)
      .select("reviews")
      .slice("reviews", [startIndex, limit])
      .populate("reviews.user", "name avatar");

    // Get total count
    const vendorWithReviewCount =
      await Vendor.findById(id).select("totalReviews");
    const total = vendorWithReviewCount.totalReviews || 0;

    res.status(200).json({
      success: true,
      message: "Vendor reviews retrieved successfully",
      data: {
        reviews: reviews.reviews,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve vendor reviews",
      error: error.message,
    });
  }
};

/**
 * @desc    Add vendor review
 * @route   POST /api/vendors/:id/reviews
 * @access  Private
 */
exports.addVendorReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Please provide a rating between 1 and 5",
      });
    }

    // Check if vendor exists
    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Check if user has already reviewed this vendor
    const alreadyReviewed = vendor.reviews.find(
      (review) => review.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this vendor",
      });
    }

    // Create review object
    const review = {
      user: req.user.id,
      rating: Number(rating),
      comment,
      createdAt: Date.now(),
    };

    // Add review to vendor's reviews array
    vendor.reviews.push(review);

    // Update vendor's rating statistics
    vendor.totalReviews = vendor.reviews.length;
    vendor.averageRating =
      vendor.reviews.reduce((acc, item) => item.rating + acc, 0) /
      vendor.reviews.length;

    // Save vendor with new review
    await vendor.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add review",
      error: error.message,
    });
  }
};

/**
 * @desc    Get vendor profile (for vendor user)
 * @route   GET /api/vendors/my-store
 * @access  Private/Vendor
 */
exports.getMyVendorProfile = async (req, res) => {
  try {
    // Find vendor profile associated with the current user
    const vendor = await Vendor.findOne({ user: req.user.id });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vendor profile retrieved successfully",
      data: vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve vendor profile",
      error: error.message,
    });
  }
};

/**
 * @desc    Update vendor profile (for vendor user)
 * @route   PUT /api/vendors/my-store
 * @access  Private/Vendor
 */
exports.updateMyVendorProfile = async (req, res) => {
  try {
    // Find vendor profile associated with the current user
    let vendor = await Vendor.findOne({ user: req.user.id });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    // Update vendor profile
    vendor = await Vendor.findOneAndUpdate({ user: req.user.id }, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Vendor profile updated successfully",
      data: vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update vendor profile",
      error: error.message,
    });
  }
};

/**
 * @desc    Create vendor (admin only)
 * @route   POST /api/vendors
 * @access  Private/Admin
 */
exports.createVendor = async (req, res) => {
  try {
    const { businessName, email, phone, userId } = req.body;

    // Check if a vendor with this business name, email, or phone already exists
    const existingVendor = await Vendor.findOne({
      $or: [{ businessName }, { email }, { phone }],
    });

    if (existingVendor) {
      return res.status(409).json({
        success: false,
        message:
          "A vendor with this business name, email, or phone already exists",
      });
    }

    // If userId is provided, check that user exists and update their role
    if (userId) {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Update user role to vendor
      user.role = "vendor";
      await user.save();

      // Add user id to vendor data
      req.body.user = userId;
    }

    // Create vendor
    const vendor = await Vendor.create(req.body);

    res.status(201).json({
      success: true,
      message: "Vendor created successfully",
      data: vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create vendor",
      error: error.message,
    });
  }
};

/**
 * @desc    Update vendor (admin only)
 * @route   PUT /api/vendors/:id
 * @access  Private/Admin
 */
exports.updateVendorByAdmin = async (req, res) => {
  try {
    // Find vendor by ID
    let vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Update vendor
    vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Vendor updated successfully",
      data: vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update vendor",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete vendor (admin only)
 * @route   DELETE /api/vendors/:id
 * @access  Private/Admin
 */
exports.deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // If the vendor has a user, update the user's role
    if (vendor.user) {
      const user = await User.findById(vendor.user);
      if (user) {
        user.role = "user";
        await user.save();
      }
    }

    await vendor.remove();

    res.status(200).json({
      success: true,
      message: "Vendor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete vendor",
      error: error.message,
    });
  }
};

/**
 * @desc    Promote vendor (set as featured or not)
 * @route   PUT /api/vendors/:id/promote
 * @access  Private/Admin
 */
exports.promoteVendor = async (req, res) => {
  try {
    const { isPromoted } = req.body;

    if (typeof isPromoted !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isPromoted must be a boolean value",
      });
    }

    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { isPromoted },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Vendor ${isPromoted ? "promoted" : "unpromoted"} successfully`,
      data: vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update vendor promotion status",
      error: error.message,
    });
  }
};
