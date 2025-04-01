const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const {ErrorResponse} = require('./error.middleware')
const config = require('../config')

// Protect routes
const protect = async (req, res, next) => {
  try {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies.token) {
      token = req.cookies.token
    }
    if (!token) {
      return next(new ErrorResponse('Not authorized to access this route', 401))
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret)
      req.user = await User.findById(decoded.id).select('-password')

      if (!req.user) {
        return next(new ErrorResponse('User not found', 404))
      }
      next()
    } catch (error) {
      return next(new ErrorResponse('Not authorized to access this route', 401))
    }
  } catch (error) {
    next(error)
  }
}

// Authorize based on role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorResponse('Not authorized to access this route', 401))
    }

    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
    }

    next()
  }
}

module.exports = {protect, authorize}
