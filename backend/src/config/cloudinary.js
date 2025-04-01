const cloudinary = require('cloudinary').v2
const config = require('../config')
const {CloudinaryStorage} = require('multer-storage-cloudinary')
const multer = require('multer')
const path = require('path')

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
})

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: config.cloudinary.folder,
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
})

// Configure multer
const upload = multer({
  storage,
  limits: {fileSize: 5 * 1024 * 1024}, // 5MB max file size
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if (extname && mimetype) {
      return cb(null, true)
    } else {
      cb(new Error('Images only!'))
    }
  },
})

/**
 * Upload file to Cloudinary
 * @param {File} file - File to upload
 * @param {string} folder - Folder to upload to
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} - Cloudinary response
 */
const uploadToCloudinary = async (file, folder = config.cloudinary.folder, options = {}) => {
  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({folder, ...options}, (error, result) => {
        if (error) return reject(error)
        resolve(result)
      })

      uploadStream.end(file.buffer)
    })

    return {
      url: result.secure_url,
      public_id: result.public_id,
      ...result,
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw new Error('Error uploading image')
  }
}

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Public ID of file to delete
 * @returns {Promise<Object>} - Cloudinary response
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    throw new Error('Error deleting image')
  }
}

module.exports = {
  cloudinary,
  upload,
  uploadToCloudinary,
  deleteFromCloudinary,
}
