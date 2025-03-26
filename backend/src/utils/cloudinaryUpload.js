const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;
const { promisify } = require("util");
const streamifier = require("streamifier");
const ErrorResponse = require("./errorResponse");
const logger = require("./logger");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Configure multer for file upload
const storage = multer.memoryStorage();

// Validate file types
const fileFilter = (req, file, cb) => {
  // Allow only images
  const allowedFileTypes = /jpeg|jpg|png|webp/;
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new ErrorResponse("Only image files are allowed!", 400));
    return false;
  }
};

// Create multer upload instance
exports.upload = multer({
  storage,
  limits: { fileSize: Number(process.env.UPLOAD_LIMIT || 5) * 1024 * 1024 }, // Default 5MB
  fileFilter,
});

// Helper to upload from buffer to Cloudinary
const uploadFromBuffer = (buffer, options) => {
  return new Promise((resolve, reject) => {
    if (!buffer) {
      return reject(new ErrorResponse("Invalid file buffer", 400));
    }
    
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(new ErrorResponse(`Cloudinary upload failed: ${error.message}`, 500));
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

/**
 * Upload file to Cloudinary
 * @param {Object} file - File object from multer
 * @param {String} folder - Folder path in Cloudinary (e.g., 'products', 'users')
 * @returns {Promise<String>} - URL of uploaded file
 */
exports.uploadToCloudinary = async (file, folder = "") => {
  if (!file) {
    throw new ErrorResponse("No file provided", 400);
  }

  // Generate unique filename
  const randomString = crypto.randomBytes(8).toString("hex");
  const fileExtension = path.extname(file.originalname).toLowerCase();
  const publicId = `${Date.now()}-${randomString}`;
  const cloudinaryFolder = `${process.env.CLOUDINARY_FOLDER || "dumpit"}/${folder}`;

  try {
    // Upload to Cloudinary
    const result = await uploadFromBuffer(file.buffer, {
      folder: cloudinaryFolder,
      public_id: publicId,
      resource_type: "auto",
      format: fileExtension.replace(".", ""),
      tags: [folder],
    });

    logger.info(`File uploaded to Cloudinary: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    logger.error("Error uploading to Cloudinary:", error);
    throw error instanceof ErrorResponse ? error : new ErrorResponse(`Upload failed: ${error.message}`, 500);
  }
};

/**
 * Delete file from Cloudinary
 * @param {String} fileUrl - Full URL of file to delete
 * @returns {Promise<Boolean>} - Success status
 */
exports.deleteFromCloudinary = async (fileUrl) => {
  if (!fileUrl) {
    throw new ErrorResponse("No file URL provided", 400);
  }

  try {
    // Extract public_id from Cloudinary URL
    const urlParts = fileUrl.split("/");
    const publicId = urlParts[urlParts.length - 1].split(".")[0];
    const folderPath = urlParts.slice(-3, -1).join("/");
    const fullPublicId = `${folderPath}/${publicId}`;
    
    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(fullPublicId);
    
    if (result.result === "ok" || result.result === "not found") {
      logger.info(`File deleted from Cloudinary: ${fileUrl}`);
      return true;
    } else {
      throw new ErrorResponse(`Failed to delete from Cloudinary: ${result.result}`, 500);
    }
  } catch (error) {
    logger.error("Error deleting file from Cloudinary:", error);
    throw error instanceof ErrorResponse ? error : new ErrorResponse(`Delete failed: ${error.message}`, 500);
  }
};

/**
 * Upload multiple files to Cloudinary
 * @param {Array} files - Array of file objects from multer
 * @param {String} folder - Folder path in Cloudinary
 * @returns {Promise<Array>} - Array of URLs of uploaded files
 */
exports.uploadMultipleToCloudinary = async (files, folder = "") => {
  if (!files || !Array.isArray(files) || files.length === 0) {
    throw new ErrorResponse("No files provided", 400);
  }

  try {
    const uploadPromises = files.map((file) => this.uploadToCloudinary(file, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    logger.error("Error uploading multiple files:", error);
    throw error instanceof ErrorResponse ? error : new ErrorResponse(`Multiple upload failed: ${error.message}`, 500);
  }
};
