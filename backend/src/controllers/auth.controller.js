const crypto = require('crypto')
const User = require('../models/user.model')
const {UserRole} = require('../constants')
const {ErrorResponse} = require('../middlewares/error.middleware')
const {sendPasswordResetEmail} = require('../services/email.service')
const {createPasswordResetNotification} = require('../services/notification.service')
const config = require('../config')
const path = require('path')
const asyncHandler = require('../middlewares/async.middleware')
const fs = require('fs')

/**
 * Get token from model, create cookie and send response
 */
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getJwtToken()

  const options = {
    expires: new Date(Date.now() + config.jwt.cookieExpire * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: config.server.nodeEnv === 'production',
  }

  // Remove password from user object
  const userData = user.toObject ? user.toObject() : user;
  if (userData.password) delete userData.password;

  res.status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      data: {
        token,
        user: userData
      }
    })
}

// @desc    Upload avatar
// @route   PUT /api/auth/avatar
// @access  Private
exports.uploadAvatar = async (req, res, next) => {
  try {
    console.log(`PUT /api/auth/avatar`)
    if (!req.files) {
      return next(new ErrorResponse('Please upload an image file', 400))
    }

    const file = req.files.avatar

    // Make sure the file is an image
    if (!file.mimetype.startsWith('image')) {
      return next(new ErrorResponse('Please upload an image file', 400))
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return next(new ErrorResponse('Image file must be less than 5MB', 400))
    }

    // Create custom filename
    const filename = `user_${req.user._id}_${Date.now()}${path.parse(file.name).ext}`
    const uploadPath = path.join(__dirname, `../../public/uploads/avatars/${filename}`)

    // Move file to the upload directory
    file.mv(uploadPath, async err => {
      if (err) {
        console.error('File upload error:', err)
        return next(new ErrorResponse('Problem with file upload', 500))
      }

      // Update user avatar in database
      const avatarUrl = `/uploads/avatars/${filename}`
      
      try {
        await User.findByIdAndUpdate(
          req.user._id, 
          { 
            avatar: {
              public_id: filename,
              url: avatarUrl
            }
          },
          { 
            new: true,
            runValidators: false // Skip validation to make avatar optional
          }
        )
        
        res.status(200).json({
          success: true,
          data: { avatarUrl },
          message: 'Avatar uploaded successfully'
        })
      } catch (dbError) {
        // Remove uploaded file if database update fails
        fs.unlink(uploadPath, unlinkErr => {
          if (unlinkErr) console.error('Error removing uploaded file:', unlinkErr)
        })
        throw dbError
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    console.log(`POST /api/auth/register`)

    const {name, email, password, role} = req.body

    // Check if user already exists
    const existingUser = await User.findOne({email})
    if (existingUser) {
      return next(new ErrorResponse('Email already registered', 400))
    }

    const avatar = {
      public_id: 'dumpit/avatars/default_avatar',
      url: 'https://plus.unsplash.com/premium_photo-1738550163830-07bccfea3805?q=80&w=200&auto=format&fit=crop',
    }

    // Create the user
    const user = await User.create({
      name,
      email,
      password,
      avatar,
      role: role === 'vendor' ? UserRole.VENDOR : UserRole.CUSTOMER,
    })

    // Generate and send JWT token
    sendTokenResponse(user, 201, res)
  } catch (error) {
    next(error)
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    console.log(`POST /api/auth/login`)

    const {email, password} = req.body
    // Find user by email
    const user = await User.findOne({email}).select('+password')
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401))
    }

    // Check if password matches
    const isPasswordMatch = await user.comparePassword(password)
    if (!isPasswordMatch) {
      return next(new ErrorResponse('Invalid credentials', 401))
    }
    sendTokenResponse(user, 200, res)
  } catch (error) {
    next(error)
  }
}

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = (req, res) => {
  console.log(`GET /api/auth/logout`)

  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  })
}

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  console.log(`GET /api/auth/me`)

  // User is already available in req due to the protect middleware
  const user = await User.findById(req.user._id)

  res.status(200).json({
    success: true,
    data: user,
  })
}

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
  try {
    console.log(`PUT /api/auth/updatedetails`)

    const {name, email} = req.body

    // Check if email already exists
    if (email) {
      const existingUser = await User.findOne({email})
      if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
        return next(new ErrorResponse('Email already in use', 400))
      }
    }

    // Update user details
    const fieldsToUpdate = {
      name: name || undefined,
      email: email || undefined,
    }

    const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {new: true, runValidators: true})

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    console.log(`PUT /api/auth/updatepassword`)

    const {currentPassword, newPassword} = req.body

    // Get user with password
    const user = await User.findById(req.user._id).select('+password')
    if (!user) {
      return next(new ErrorResponse('User not found', 404))
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return next(new ErrorResponse('Current password is incorrect', 401))
    }

    // Update password
    user.password = newPassword
    await user.save()

    sendTokenResponse(user, 200, res)
  } catch (error) {
    next(error)
  }
}

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    console.log(`POST /api/auth/forgotpassword`)

    const {email} = req.body

    // Find user by email
    const user = await User.findOne({email})
    if (!user) {
      return next(new ErrorResponse('There is no user with this email', 404))
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken()
    await user.save({validateBeforeSave: false})

    // Create reset URL
    const resetUrl = `${config.cors.frontendUrl}/reset-password/${resetToken}`

    try {
      // Send email
      await sendPasswordResetEmail(email, resetToken, resetUrl)

      // Create notification for password reset
      await createPasswordResetNotification(user._id.toString())

      res.status(200).json({
        success: true,
        message: 'Password reset email sent',
      })
    } catch (err) {
      console.error('Error sending password reset email:', err)

      // Reset user fields
      user.resetPasswordToken = undefined
      user.resetPasswordExpire = undefined
      await user.save({validateBeforeSave: false})

      return next(new ErrorResponse('Email could not be sent', 500))
    }
  } catch (error) {
    next(error)
  }
}

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    console.log(`PUT /api/auth/resetpassword/${req.params.resetToken}`)

    // Get hashed token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex')

    // Find user by token
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: {$gt: Date.now()},
    })

    if (!user) {
      return next(new ErrorResponse('Invalid or expired token', 400))
    }

    // Set new password
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    sendTokenResponse(user, 200, res)
  } catch (error) {
    next(error)
  }
}
