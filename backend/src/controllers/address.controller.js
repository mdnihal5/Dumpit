const User = require('../models/user.model');
const { ErrorResponse } = require('../middlewares/error.middleware');

// @desc    Get all addresses for a user
// @route   GET /api/users/addresses
// @access  Private
exports.getAddresses = async (req, res, next) => {
  try {
    console.log(`GET /api/users/addresses`);

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    res.status(200).json({
      success: true,
      count: 0,
      data: []
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new address
// @route   POST /api/users/addresses
// @access  Private
exports.addAddress = async (req, res, next) => {
  try {
    console.log(`POST /api/users/addresses`);

    const { name, address, city, state, postalCode, country, phone, isDefault } = req.body;

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Create new address object
    const newAddress = {
      name,
      address,
      city,
      state,
      postalCode,
      country,
      phone,
      isDefault: isDefault || false
    };
    // If this is the default address, update other addresses
    if (newAddress.isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    // Add the new address
    console.log(user.addresses);
    console.log(newAddress);
    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({
      success: true,
      data: newAddress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an address
// @route   PUT /api/users/addresses/:id
// @access  Private
exports.updateAddress = async (req, res, next) => {
  try {
    console.log(`PUT /api/users/addresses/${req.params.id}`);

    const addressId = req.params.id;
    const { name, address, city, state, postalCode, country, phone, isDefault } = req.body;

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Find the address to update
    const addressToUpdate = user.addresses.id(addressId);
    
    if (!addressToUpdate) {
      return next(new ErrorResponse('Address not found', 404));
    }

    // Update the address fields
    if (name) addressToUpdate.name = name;
    if (address) addressToUpdate.address = address;
    if (city) addressToUpdate.city = city;
    if (state) addressToUpdate.state = state;
    if (postalCode) addressToUpdate.postalCode = postalCode;
    if (country) addressToUpdate.country = country;
    if (phone) addressToUpdate.phone = phone;
    
    // Handle isDefault flag
    if (isDefault) {
      // Update other addresses to not be default
      user.addresses.forEach(addr => {
        if (addr._id.toString() !== addressId) {
          addr.isDefault = false;
        }
      });
      addressToUpdate.isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: addressToUpdate
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an address
// @route   DELETE /api/users/addresses/:id
// @access  Private
exports.deleteAddress = async (req, res, next) => {
  try {
    console.log(`DELETE /api/users/addresses/${req.params.id}`);

    const addressId = req.params.id;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Find the address to delete
    const addressToDelete = user.addresses.id(addressId);
    
    if (!addressToDelete) {
      return next(new ErrorResponse('Address not found', 404));
    }

    // Check if it's the default address
    const isDefault = addressToDelete.isDefault;

    // Remove the address
    addressToDelete.remove();

    // If we removed the default address and there are other addresses, set a new default
    if (isDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set an address as default
// @route   PUT /api/users/addresses/:id/default
// @access  Private
exports.setDefaultAddress = async (req, res, next) => {
  try {
    console.log(`PUT /api/users/addresses/${req.params.id}/default`);

    const addressId = req.params.id;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Find the address to set as default
    const addressToSetAsDefault = user.addresses.id(addressId);
    
    if (!addressToSetAsDefault) {
      return next(new ErrorResponse('Address not found', 404));
    }

    // Update all addresses
    user.addresses.forEach(addr => {
      addr.isDefault = addr._id.toString() === addressId;
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Default address updated',
      data: addressToSetAsDefault
    });
  } catch (error) {
    next(error);
  }
}; 