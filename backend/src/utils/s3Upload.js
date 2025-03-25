const AWS = require("aws-sdk");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

// Configure AWS S3
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const bucketName = process.env.AWS_S3_BUCKET;

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
    return cb(new Error("Only image files are allowed!"), false);
  }
};

// Create multer upload instance
exports.upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

/**
 * Upload file to S3
 * @param {Object} file - File object from multer
 * @param {String} folder - Folder path in S3 bucket (e.g., 'products', 'users')
 * @returns {Promise<String>} - URL of uploaded file
 */
exports.uploadToS3 = async (file, folder = "") => {
  if (!file) {
    throw new Error("No file provided");
  }

  // Generate unique filename
  const randomString = crypto.randomBytes(8).toString("hex");
  const fileExtension = path.extname(file.originalname);
  const filename = `${folder}/${Date.now()}-${randomString}${fileExtension}`;

  // Set upload parameters
  const params = {
    Bucket: bucketName,
    Key: filename,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  // Upload to S3
  const result = await s3.upload(params).promise();
  return result.Location;
};

/**
 * Delete file from S3
 * @param {String} fileUrl - Full URL of file to delete
 * @returns {Promise<Boolean>} - Success status
 */
exports.deleteFromS3 = async (fileUrl) => {
  if (!fileUrl) {
    throw new Error("No file URL provided");
  }

  // Extract key from URL
  const key = fileUrl.split(`${bucketName}/`)[1];

  if (!key) {
    throw new Error("Invalid S3 file URL");
  }

  // Set delete parameters
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  // Delete from S3
  await s3.deleteObject(params).promise();
  return true;
};

/**
 * Upload multiple files to S3
 * @param {Array} files - Array of file objects from multer
 * @param {String} folder - Folder path in S3 bucket
 * @returns {Promise<Array>} - Array of URLs of uploaded files
 */
exports.uploadMultipleToS3 = async (files, folder = "") => {
  if (!files || !Array.isArray(files) || files.length === 0) {
    throw new Error("No files provided");
  }

  const uploadPromises = files.map((file) => this.uploadToS3(file, folder));
  return Promise.all(uploadPromises);
};
