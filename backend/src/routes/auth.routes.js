const express = require('express')
const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  uploadAvatar
} = require('../controllers/auth.controller')
const {protect} = require('../middlewares/auth.middleware')
const {validate} = require('../middlewares/validate.middleware')
const {
  registerUserSchema,
  loginUserSchema,
  updateUserSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require('../validation/user.schema')

const router = express.Router()

router.post('/register', validate(registerUserSchema), register)
router.post('/login', validate(loginUserSchema), login)
router.get('/logout', logout)
router.get('/me', protect, getMe)
router.put('/updatedetails', protect, validate(updateUserSchema), updateDetails)
router.put('/updatepassword', protect, validate(changePasswordSchema), updatePassword)
router.post('/forgotpassword', validate(forgotPasswordSchema), forgotPassword)
router.put('/resetpassword/:resetToken', validate(resetPasswordSchema), resetPassword)
router.put('/avatar', protect, uploadAvatar)

module.exports = router
