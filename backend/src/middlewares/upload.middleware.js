const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ErrorResponse = require('../utils/errorResponse');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
const avatarDir = path.join(uploadsDir, 'avatars');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Choose destination based on file type/use
    if (file.fieldname === 'avatar') {
      cb(null, avatarDir);
    } else {
      cb(null, uploadsDir);
    }
  },
  filename: function (req, file, cb) {
    // Generate a unique filename: timestamp-userId-originalname
    const uniqueSuffix = Date.now() + '-' + req.user.id;
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new ErrorResponse('Only image files are allowed!', 400), false);
  }
  cb(null, true);
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

// Middleware for avatar upload
const avatarUpload = upload.single('avatar');

// Error handling wrapper for multer
const handleAvatarUpload = (req, res, next) => {
  avatarUpload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new ErrorResponse('File is too large. Maximum size is 5MB', 400));
      }
      return next(new ErrorResponse(`Multer error: ${err.message}`, 400));
    } else if (err) {
      // An unknown error occurred
      return next(err);
    }
    // Everything went fine
    next();
  });
};

module.exports = {
  handleAvatarUpload
}; 